from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import (
    User,
    Doctor,
    Appointment,
    Prescription,
    PrescriptionItem,
    LabTest,
    LabBooking,
    LabBookingItem,
    Order,
    OrderItem,
    Payment,
    Review,
    HealthRecord,
    OTP,
)


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "first_name", "last_name", "phone", "role"]


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError({"error": "Invalid email or password"})

        attrs["user"] = user
        return attrs


class DoctorSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    commission_percent = serializers.SerializerMethodField()
    commission_amount = serializers.SerializerMethodField()
    doctor_receives = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            "id",
            "user",
            "user_name",
            "doctor_name",
            "specialization",
            "experience",
            "consultation_fee",
            "commission_percent",
            "commission_amount",
            "doctor_receives",
            "bio",
            "image",
            "is_approved",
        ]
        read_only_fields = ["user"]

    def get_commission_percent(self, obj):
        return "7.00"

    def get_commission_amount(self, obj):
        return obj.commission_amount

    def get_doctor_receives(self, obj):
        return obj.doctor_receives


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_details = DoctorSerializer(source="doctor", read_only=True)
    patient_details = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    patient_email = serializers.SerializerMethodField()

    payment_status = serializers.SerializerMethodField()
    transaction_id = serializers.SerializerMethodField()
    payment_gateway = serializers.SerializerMethodField()
    razorpay_payment_id = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "doctor",
            "doctor_details",
            "patient_details",
            "patient_name",
            "patient_email",
            "appointment_date",
            "payment_method",
            "symptoms",
            "status",
            "subtotal_amount",
            "commission_percent",
            "commission_amount",
            "doctor_payout",
            "total_amount",
            "payment_status",
            "transaction_id",
            "payment_gateway",
            "razorpay_payment_id",
        ]
        read_only_fields = [
            "patient",
            "status",
            "subtotal_amount",
            "commission_percent",
            "commission_amount",
            "doctor_payout",
            "total_amount",
            "payment_status",
            "transaction_id",
            "payment_gateway",
            "razorpay_payment_id",
        ]

    def get_patient_details(self, obj):
        if not obj.patient:
            return None
        full_name = f"{obj.patient.first_name} {obj.patient.last_name}".strip()
        return {
            "id": obj.patient.id,
            "name": full_name if full_name else obj.patient.username,
            "email": obj.patient.email,
            "username": obj.patient.username,
            "first_name": obj.patient.first_name,
            "last_name": obj.patient.last_name,
        }

    def get_patient_name(self, obj):
        if not obj.patient:
            return None
        full_name = f"{obj.patient.first_name} {obj.patient.last_name}".strip()
        return full_name if full_name else obj.patient.username

    def get_patient_email(self, obj):
        return obj.patient.email if obj.patient else None

    def get_payment_status(self, obj):
        payment = Payment.objects.filter(appointment=obj).order_by("-id").first()
        return payment.payment_status if payment else None

    def get_transaction_id(self, obj):
        payment = Payment.objects.filter(appointment=obj).order_by("-id").first()
        return payment.transaction_id if payment else None

    def get_payment_gateway(self, obj):
        payment = Payment.objects.filter(appointment=obj).order_by("-id").first()
        return payment.payment_method if payment else None

    def get_razorpay_payment_id(self, obj):
        payment = Payment.objects.filter(appointment=obj).order_by("-id").first()
        return payment.razorpay_payment_id if payment else None


class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = "__all__"


class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True)

    class Meta:
        model = Prescription
        fields = "__all__"

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        prescription = Prescription.objects.create(**validated_data)
        for item in items_data:
            PrescriptionItem.objects.create(prescription=prescription, **item)
        return prescription


class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = "__all__"


class LabBookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabBookingItem
        fields = ["id", "test_name", "quantity", "price", "line_total"]


class LabBookingSerializer(serializers.ModelSerializer):
    items = LabBookingItemSerializer(many=True)
    doctor_name = serializers.CharField(source="doctor.doctor_name", read_only=True)

    payment_status = serializers.SerializerMethodField()
    transaction_id = serializers.SerializerMethodField()
    payment_gateway = serializers.SerializerMethodField()
    razorpay_payment_id = serializers.SerializerMethodField()

    class Meta:
        model = LabBooking
        fields = [
            "id",
            "user",
            "doctor",
            "doctor_name",
            "full_name",
            "phone",
            "address",
            "payment_method",
            "subtotal_amount",
            "commission_percent",
            "commission_amount",
            "lab_payout",
            "total_amount",
            "booking_date",
            "status",
            "items",
            "payment_status",
            "transaction_id",
            "payment_gateway",
            "razorpay_payment_id",
        ]
        read_only_fields = [
            "user",
            "subtotal_amount",
            "commission_percent",
            "commission_amount",
            "lab_payout",
            "total_amount",
            "booking_date",
            "status",
            "payment_status",
            "transaction_id",
            "payment_gateway",
            "razorpay_payment_id",
        ]

    def get_payment_status(self, obj):
        payment = Payment.objects.filter(lab_booking=obj).order_by("-id").first()
        return payment.payment_status if payment else None

    def get_transaction_id(self, obj):
        payment = Payment.objects.filter(lab_booking=obj).order_by("-id").first()
        return payment.transaction_id if payment else None

    def get_payment_gateway(self, obj):
        payment = Payment.objects.filter(lab_booking=obj).order_by("-id").first()
        return payment.payment_method if payment else None

    def get_razorpay_payment_id(self, obj):
        payment = Payment.objects.filter(lab_booking=obj).order_by("-id").first()
        return payment.razorpay_payment_id if payment else None


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "medicine_name",
            "category",
            "quantity",
            "price",
            "commission_percent",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    payment_status = serializers.SerializerMethodField()
    transaction_id = serializers.SerializerMethodField()
    payment_gateway = serializers.SerializerMethodField()
    razorpay_payment_id = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "full_name",
            "phone",
            "address",
            "payment_method",
            "subtotal_amount",
            "commission_amount",
            "pharmacy_payout",
            "total_amount",
            "status",
            "created_at",
            "items",
            "payment_status",
            "transaction_id",
            "payment_gateway",
            "razorpay_payment_id",
        ]
        read_only_fields = [
            "user",
            "subtotal_amount",
            "commission_amount",
            "pharmacy_payout",
            "total_amount",
            "status",
            "created_at",
            "payment_status",
            "transaction_id",
            "payment_gateway",
            "razorpay_payment_id",
        ]

    def get_payment_status(self, obj):
        payment = Payment.objects.filter(order=obj).order_by("-id").first()
        return payment.payment_status if payment else None

    def get_transaction_id(self, obj):
        payment = Payment.objects.filter(order=obj).order_by("-id").first()
        return payment.transaction_id if payment else None

    def get_payment_gateway(self, obj):
        payment = Payment.objects.filter(order=obj).order_by("-id").first()
        return payment.payment_method if payment else None

    def get_razorpay_payment_id(self, obj):
        payment = Payment.objects.filter(order=obj).order_by("-id").first()
        return payment.razorpay_payment_id if payment else None


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = [
            "payment_status",
            "transaction_id",
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["user"]


class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = "__all__"
        read_only_fields = ["user"]