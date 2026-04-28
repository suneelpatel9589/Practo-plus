from decimal import Decimal
import random
import hmac
import hashlib
from datetime import timedelta
from .models import Order, OrderItem, Payment

import razorpay
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Sum
from django.utils import timezone

from rest_framework import serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Doctor,
    Appointment,
    Review,
    LabTest,
    LabBooking,
    LabBookingItem,
    Order,
    OrderItem,
    HealthRecord,
    OTP,
    Payment,
)
from .serializers import (
    DoctorSerializer,
    AppointmentSerializer,
    ReviewSerializer,
    LabTestSerializer,
    LabBookingSerializer,
    OrderSerializer,
    HealthRecordSerializer,
    LoginSerializer,
    UserSerializer,
    PaymentSerializer,
)

User = get_user_model()


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and str(request.user.role).upper() == "PATIENT"


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and str(request.user.role).upper() == "DOCTOR"


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and str(request.user.role).upper() == "ADMIN"


class IsDoctorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and str(request.user.role).upper() in ["DOCTOR", "ADMIN"]


class IsPatientOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and str(request.user.role).upper() in ["PATIENT", "ADMIN"]


class DoctorViewSet(ModelViewSet):
    queryset = Doctor.objects.select_related("user").all()
    serializer_class = DoctorSerializer
    filterset_fields = ["specialization", "experience", "is_approved"]
    search_fields = ["doctor_name", "user__first_name", "user__last_name", "specialization"]
    ordering_fields = ["consultation_fee", "experience"]

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsDoctor()]
        if self.action in ["approve", "reject"]:
            return [IsAuthenticated(), IsAdmin()]
        return [AllowAny()]

    def perform_create(self, serializer):
        if str(self.request.user.role).upper() != "DOCTOR":
            raise serializers.ValidationError(
                {"detail": "Only users with doctor role can create doctor profile."}
            )

        if Doctor.objects.filter(user=self.request.user).exists():
            raise serializers.ValidationError(
                {"detail": "only one doctor profile allowed per user."}
            )

        serializer.save(user=self.request.user)

    @action(detail=True, methods=["patch"])
    def approve(self, request, pk=None):
        doctor = self.get_object()
        doctor.is_approved = True
        doctor.save()
        return Response({"message": "Doctor approved successfully"})

    @action(detail=True, methods=["patch"])
    def reject(self, request, pk=None):
        doctor = self.get_object()
        doctor.is_approved = False
        doctor.save()
        return Response({"message": "Doctor rejected successfully"})


class AppointmentViewSet(ModelViewSet):
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.select_related("patient", "doctor", "doctor__user").all()

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsPatient()]
        if self.action == "cancel":
            return [IsAuthenticated()]
        if self.action in ["update", "partial_update", "destroy", "complete", "confirm"]:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Appointment.objects.none()
        user = self.request.user
        if not user.is_authenticated:
            return Appointment.objects.none()
        role = str(user.role).upper()

        if role == "PATIENT":
            return Appointment.objects.filter(patient=user).select_related("doctor", "doctor__user")
        if role == "DOCTOR":
            return Appointment.objects.filter(doctor__user=user).select_related("patient", "doctor", "doctor__user")
        if role == "ADMIN":
            return Appointment.objects.all().select_related("patient", "doctor", "doctor__user")
        return Appointment.objects.none()
        
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment_method = str(request.data.get("payment_method", "COD")).upper()

        appointment = serializer.save(
            patient=request.user,
            status="PENDING",
            payment_method=payment_method
        )

        if payment_method == "ONLINE":
            payment = Payment.objects.create(
                user=request.user,
                appointment=appointment,
                payment_for="APPOINTMENT",
                amount=appointment.total_amount,
                payment_method="RAZORPAY",
                payment_status="PENDING",
            )
            return Response({
                "message": " Appointment booked. Complete payment to confirm appointment.",
                "appointment_id": appointment.id,
                "payment_id": payment.id,
                "payment_method": "ONLINE",
                "amount": appointment.total_amount,
                "status": appointment.status,
            }, status=201)

        return Response({
            "message": "Appointment booked successfully with Cash on Delivery. Please pay at the clinic.",
            "appointment_id": appointment.id,
            "payment_method": "COD",
            "status": appointment.status,
        }, status=201)

    @action(detail=True, methods=["patch"])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        role = str(request.user.role).upper()

        if role == "PATIENT" and appointment.patient != request.user:
            return Response({"detail": "patient can only cancel their own appointment"}, status=403)

        if role == "DOCTOR" and appointment.doctor.user != request.user:
            return Response({"detail": "doctor can only cancel their own appointment."}, status=403)

        if role == "ADMIN":
            appointment.status = "CANCELLED"
            appointment.save()
            return Response({"message": "Appointment cancelled successfully", "status": appointment.status})

        if role not in ["PATIENT", "DOCTOR", "ADMIN"]:
            return Response({"detail": "Permission denied."}, status=403)

        appointment.status = "CANCELLED"
        appointment.save()
        return Response({"message": "Appointment cancelled successfully", "status": appointment.status})

    @action(detail=True, methods=["patch"])
    def complete(self, request, pk=None):
        appointment = self.get_object()
        role = str(request.user.role).upper()

        if role == "ADMIN" or (role == "DOCTOR" and appointment.doctor.user == request.user):
            appointment.status = "COMPLETED"
            appointment.save()
            return Response({"message": "Appointment completed successfully", "status": appointment.status})

        return Response({"detail": "Permission denied."}, status=403)

    @action(detail=True, methods=["patch"])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        role = str(request.user.role).upper()

        if role == "ADMIN" or (role == "DOCTOR" and appointment.doctor.user == request.user):
            appointment.status = "CONFIRMED"
            appointment.save()
            return Response({"message": "Appointment confirmed successfully", "status": appointment.status})

        return Response({"detail": "Permission denied."}, status=403)


class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.select_related("user", "doctor").all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsPatient()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LabTestViewSet(ModelViewSet):
    queryset = LabTest.objects.all()
    serializer_class = LabTestSerializer
    permission_classes = [IsAuthenticated]


class LabBookingViewSet(ModelViewSet):
    serializer_class = LabBookingSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsPatient()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return LabBooking.objects.none()
        
        user = self.request.user
        if not user.is_authenticated:
            return LabBooking.objects.none()
        role = str(user.role).upper()

        if role == "PATIENT":
            return LabBooking.objects.filter(user=user)
        if role == "DOCTOR":
            return LabBooking.objects.filter(doctor__user=user)
        if role == "ADMIN":
            return LabBooking.objects.all()
        
        return LabBooking.objects.none()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        items = data.get("items", [])

        if not items:
            return Response({"error": "Lab test items are required"}, status=400)

        full_name = data.get("full_name", "").strip()
        phone = data.get("phone", "").strip()
        address = data.get("address", "").strip()
        payment_method = str(data.get("payment_method", "COD")).upper()
        doctor_id = data.get("doctor")

        if not full_name or not phone or not address:
            return Response({"error": "full_name, phone and address are required"}, status=400)

        doctor = None
        if doctor_id:
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                return Response({"error": "Invalid doctor id"}, status=400)

        booking = LabBooking.objects.create(
            user=request.user,
            doctor=doctor,
            full_name=full_name,
            phone=phone,
            address=address,
            payment_method=payment_method,
            subtotal_amount=Decimal("0.00"),
            commission_percent=Decimal("8.00"),
            commission_amount=Decimal("0.00"),
            lab_payout=Decimal("0.00"),
            total_amount=Decimal("0.00"),
            status="PENDING" if payment_method == "ONLINE" else "BOOKED",
        )

        subtotal = Decimal("0.00")

        for item in items:
            test_name = item.get("test_name") or item.get("name")
            quantity = int(item.get("quantity", 1))
            price = Decimal(str(item.get("price", 0)))

            if not test_name:
                return Response({"error": "test_name is required in each item"}, status=400)

            if quantity <= 0:
                return Response({"error": "quantity must be greater than 0"}, status=400)

            row = LabBookingItem.objects.create(
                booking=booking,
                test_name=test_name,
                quantity=quantity,
                price=price,
            )
            subtotal += row.line_total

        commission = (subtotal * booking.commission_percent) / Decimal("100")
        booking.subtotal_amount = subtotal
        booking.commission_amount = commission
        booking.lab_payout = subtotal
        booking.total_amount = subtotal + commission
        booking.save()

        if payment_method == "ONLINE":
            payment = Payment.objects.create(
                user=request.user,
                lab_booking=booking,
                payment_for="LAB",
                amount=booking.total_amount,
                payment_method="RAZORPAY",
                payment_status="PENDING",
            )

            serializer = self.get_serializer(booking)
            return Response(
                {
                    "message": "Lab booking created. Complete payment to confirm booking.",
                    "booking_id": booking.id,
                    "payment_id": payment.id,
                    "payment_method": "ONLINE",
                    **serializer.data,
                },
                status=201,
            )

        serializer = self.get_serializer(booking)
        return Response(
            {"message": "Lab test booked successfully", "id": booking.id, **serializer.data},
            status=201,
        )

    @action(detail=True, methods=["patch"], url_path="update-status")
    def update_status(self, request, pk=None):
        booking = self.get_object()
        role = str(request.user.role).upper()
        new_status = str(request.data.get("status", "")).upper()

        allowed = ["BOOKED", "SAMPLE_COLLECTED", "PROCESSING", "COMPLETED", "CANCELLED"]

        if new_status not in allowed:
            return Response({"detail": "Invalid status"}, status=400)

        if role == "ADMIN":
            pass

        elif role == "DOCTOR":
            if not booking.doctor or booking.doctor.user != request.user:
                return Response(
                    {"detail": "You can only update lab bookings linked to you."},
                    status=403,
                )

            if str(booking.status).upper() in ["COMPLETED", "CANCELLED"]:
                return Response(
                    {"detail": "This lab booking cannot be updated now."},
                    status=400,
                )

        elif role == "PATIENT":
            if booking.user != request.user:
                return Response(
                    {"detail": "You can only cancel your own lab booking."},
                    status=403,
                )

            if new_status != "CANCELLED":
                return Response(
                    {"detail": "Patients can only cancel lab bookings."},
                    status=403,
                )

            if str(booking.status).upper() in ["COMPLETED", "CANCELLED"]:
                return Response(
                    {"detail": "This lab booking cannot be cancelled now."},
                    status=400,
                )

        else:
            return Response({"detail": "Permission denied."}, status=403)

        booking.status = new_status
        booking.save()

        serializer = self.get_serializer(booking)
        return Response(
            {
                "message": "Lab booking status updated successfully",
                **serializer.data,
            },
            status=200,
        )


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsPatient()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Order.objects.none()
        user = self.request.user
        if not user.is_authenticated:
            return Order.objects.none()
        role=str(user.role).upper()
        if role == "PATIENT":
            return Order.objects.filter(user=user).prefetch_related("items").order_by("-created_at")
        if role in ["DOCTOR", "ADMIN"]:
            return Order.objects.all().prefetch_related("items").order_by("-created_at")
        return Order.objects.none()
        
    

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        items = data.get("items", [])

        if not items:
            return Response({"error": "Cart items are required"}, status=400)

        full_name = data.get("full_name", "").strip()
        phone = data.get("phone", "").strip()
        address = data.get("address", "").strip()
        payment_method = str(data.get("payment_method", "COD")).upper()

        if not full_name or not phone or not address:
            return Response({"error": "full_name, phone and address are required"}, status=400)

        order = Order.objects.create(
            user=request.user,
            full_name=full_name,
            phone=phone,
            address=address,
            payment_method=payment_method,
            subtotal_amount=Decimal("0.00"),
            commission_amount=Decimal("0.00"),
            pharmacy_payout=Decimal("0.00"),
            total_amount=Decimal("0.00"),
            status="PENDING_PAYMENT" if payment_method == "ONLINE" else "PENDING",
        )

        subtotal = Decimal("0.00")
        commission_total = Decimal("0.00")

        for item in items:
            medicine_name = item.get("medicine_name") or item.get("name")
            category = item.get("category", "")
            quantity = int(item.get("quantity", 1))
            price = Decimal(str(item.get("price", 0)))
            commission_percent = Decimal(str(item.get("commission_percent", 10)))

            if not medicine_name:
                return Response({"error": "medicine_name is required in each item"}, status=400)

            if quantity <= 0:
                return Response({"error": "quantity must be greater than 0"}, status=400)

            row = OrderItem.objects.create(
                order=order,
                medicine_name=medicine_name,
                category=category,
                quantity=quantity,
                price=price,
                commission_percent=commission_percent,
            )

            subtotal += row.line_total
            commission_total += (row.line_total * commission_percent) / Decimal("100")

        order.subtotal_amount = subtotal
        order.commission_amount = commission_total
        order.pharmacy_payout = subtotal
        order.total_amount = subtotal + commission_total
        order.save()

        if payment_method == "ONLINE":
            payment = Payment.objects.create(
                user=request.user,
                order=order,
                payment_for="ORDER",
                amount=order.total_amount,
                payment_method="RAZORPAY",
                payment_status="PENDING",
            )

            serializer = self.get_serializer(order)
            return Response(
                {
                    "message": "Order created. Complete payment to place order.",
                    "order_id": order.id,
                    "payment_id": payment.id,
                    "payment_method": "ONLINE",
                    **serializer.data,
                },
                status=201,
            )

        serializer = self.get_serializer(order)
        return Response(
            {"message": "Order placed successfully", "id": order.id, **serializer.data},
            status=201,
        )

    @action(detail=True, methods=["patch"], url_path="update-status")
    def update_status(self, request, pk=None):
        order = self.get_object()
        role = str(request.user.role).upper()

        new_status = str(request.data.get("status", "")).upper()
        allowed_statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]

        if new_status not in allowed_statuses:
            return Response({"detail": "Invalid status"}, status=400)

        if role == "PATIENT":
            if order.user != request.user:
                return Response({"detail": "You can only cancel your own order."}, status=403)

            if new_status != "CANCELLED":
                return Response({"detail": "Patients can only cancel orders."}, status=403)

            if str(order.status).upper() in ["SHIPPED", "DELIVERED", "CANCELLED"]:
                return Response({"detail": "This order cannot be cancelled now."}, status=400)

            order.status = "CANCELLED"
            order.save()

            serializer = self.get_serializer(order)
            return Response(
                {
                    "message": "Order cancelled successfully",
                    **serializer.data,
                },
                status=200,
            )

        if role != "ADMIN":
            return Response({"detail": "Only admin can update order status"}, status=403)

        payment = Payment.objects.filter(order=order).order_by("-id").first()

        if (
            str(order.payment_method).upper() == "ONLINE"
            and (not payment or str(payment.payment_status).upper() != "SUCCESS")
            and new_status in ["PAID", "SHIPPED", "DELIVERED"]
        ):
            return Response(
                {"detail": "Online payment not completed yet"},
                status=400,
            )

        order.status = new_status
        order.save()

        if str(order.payment_method).upper() == "COD" and new_status == "DELIVERED":
            if payment:
                payment.payment_status = "SUCCESS"
                payment.payment_method = payment.payment_method or "COD"
                payment.transaction_id = payment.transaction_id or f"COD-ORDER-{order.id}"
                payment.save()
            else:
                Payment.objects.create(
                    user=order.user,
                    order=order,
                    payment_for="ORDER",
                    amount=order.total_amount,
                    payment_method="COD",
                    payment_status="SUCCESS",
                    transaction_id=f"COD-ORDER-{order.id}",
                )

        serializer = self.get_serializer(order)
        return Response(
            {
                "message": f"Order status updated to {new_status}",
                **serializer.data,
            },
            status=200,
        )
class HealthRecordViewSet(ModelViewSet):
    serializer_class = HealthRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return HealthRecord.objects.none()
        user = self.request.user
        if not user.is_authenticated:
            return HealthRecord.objects.none()
        role=str(user.role).upper()
        if role == "ADMIN":
            return HealthRecord.objects.all()
        return HealthRecord.objects.filter(user=user)
        

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminUserViewSet(ModelViewSet):
    queryset = User.objects.all().order_by("-id")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class PaymentViewSet(ModelViewSet):
    queryset = Payment.objects.all().order_by("-id")
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        doctor_commission = Appointment.objects.aggregate(total=Sum("commission_amount"))["total"] or 0
        medicine_commission = Order.objects.aggregate(total=Sum("commission_amount"))["total"] or 0
        lab_commission = LabBooking.objects.aggregate(total=Sum("commission_amount"))["total"] or 0

        total_revenue = doctor_commission + medicine_commission + lab_commission

        return Response({
            "total_users": User.objects.count(),
            "total_doctors": Doctor.objects.count(),
            "total_patients": User.objects.filter(role="PATIENT").count(),
            "total_appointments": Appointment.objects.count(),
            "total_orders": Order.objects.count(),
            "total_lab_bookings": LabBooking.objects.count(),
            "doctor_commission": doctor_commission,
            "medicine_commission": medicine_commission,
            "lab_commission": lab_commission,
            "total_revenue": total_revenue,
        })


class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get("payment_id")

        if not payment_id:
            return Response({"error": "payment_id is required"}, status=400)

        try:
            payment = Payment.objects.get(id=payment_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

        if payment.payment_status == "SUCCESS":
            return Response({"error": "Payment already completed"}, status=400)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        razorpay_order = client.order.create({
            "amount": int(float(payment.amount) * 100),
            "currency": "INR",
            "receipt": f"receipt_{payment.id}",
        })

        payment.razorpay_order_id = razorpay_order["id"]
        payment.save()

        return Response({
            "key": settings.RAZORPAY_KEY_ID,
            "amount": int(float(payment.amount) * 100),
            "currency": "INR",
            "razorpay_order_id": razorpay_order["id"],
            "payment_id": payment.id,
        })


class VerifyRazorpayPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get("payment_id")
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        if not all([payment_id, razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"error": "Missing fields"}, status=400)

        try:
            payment = Payment.objects.get(id=payment_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

        if payment.payment_status == "SUCCESS":
            return Response({
                "message": "Payment already verified",
                "payment_status": payment.payment_status,
                "transaction_id": payment.transaction_id,
                "payment_method": payment.payment_method,
                "appointment_id": payment.appointment.id if payment.appointment else None,
                "appointment_status": payment.appointment.status if payment.appointment else None,
                "order_id": payment.order.id if payment.order else None,
                "order_status": payment.order.status if payment.order else None,
                "lab_booking_id": payment.lab_booking.id if payment.lab_booking else None,
                "lab_booking_status": payment.lab_booking.status if payment.lab_booking else None,
            }, status=200)

        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()

        if generated_signature != razorpay_signature:
            payment.payment_status = "FAILED"
            payment.save()
            return Response({"error": "Invalid signature"}, status=400)

        payment.razorpay_order_id = razorpay_order_id
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.transaction_id = razorpay_payment_id
        payment.payment_status = "SUCCESS"
        payment.save()

        appointment_id = None
        appointment_status = None
        order_id = None
        order_status = None
        lab_booking_id = None
        lab_booking_status = None

        if payment.appointment:
            payment.appointment.status = "CONFIRMED"
            payment.appointment.save()
            appointment_id = payment.appointment.id
            appointment_status = payment.appointment.status

        if payment.lab_booking:
            payment.lab_booking.status = "BOOKED"
            payment.lab_booking.save()
            lab_booking_id = payment.lab_booking.id
            lab_booking_status = payment.lab_booking.status

        if payment.order:
            payment.order.status = "PAID"
            payment.order.save()
            order_id = payment.order.id
            order_status = payment.order.status

        return Response({
            "message": "Payment verified successfully",
            "payment_status": payment.payment_status,
            "transaction_id": payment.transaction_id,
            "payment_method": payment.payment_method,
            "appointment_id": appointment_id,
            "appointment_status": appointment_status,
            "order_id": order_id,
            "order_status": order_status,
            "lab_booking_id": lab_booking_id,
            "lab_booking_status": lab_booking_status,
        }, status=200)


def generate_otp():
    return str(random.randint(100000, 999999))


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            },
        }, status=200)

    return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    try:
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        email = request.data.get("email")
        phone = request.data.get("phone")
        role = request.data.get("role", "PATIENT")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        if str(role).upper() == "ADMIN":
            return Response({"error": "Admin signup not allowed from public form"}, status=403)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)

        username = email.split("@")[0]

        user = User.objects.create(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role=str(role).upper(),
        )
        user.set_password(password)
        user.save()

        otp_code = generate_otp()
        OTP.objects.create(user=user, otp_code=otp_code)

        subject = "Practo Service - OTP Verification Code"
        message = (
            f"Hello {first_name or 'User'},\n\n"
            f"Your OTP is {otp_code}\n"
            f"This OTP is valid for 5 minutes.\n\n"
            f"Do not share this OTP with anyone.\n\n"
            f"Regards,\nPracto Service Team"
        )

        send_mail(
            subject=subject,
            message=message,
            from_email="Practo Service <suneelpatel9589@gmail.com>",
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent to email successfully"}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp_code = request.data.get("otp")

    if not email or not otp_code:
        return Response({"error": "Email and OTP are required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    otp = OTP.objects.filter(user=user, otp_code=otp_code, is_verified=False).last()

    if not otp:
        return Response({"error": "Invalid OTP"}, status=400)

    if otp.created_at < timezone.now() - timedelta(minutes=5):
        return Response({"error": "OTP expired"}, status=400)

    otp.is_verified = True
    otp.save()

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "OTP verified successfully",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
        },
    }, status=200)