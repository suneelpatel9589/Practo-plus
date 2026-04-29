from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DoctorViewSet,
    AppointmentViewSet,
    ReviewViewSet,
    LabTestViewSet,
    LabBookingViewSet,
    OrderViewSet,
    HealthRecordViewSet,
    AdminUserViewSet,
    PaymentViewSet,
    AdminDashboardView,
    CreateRazorpayOrderView,
    VerifyRazorpayPaymentView,
    login_user,
    send_otp,
    verify_otp,
    forgot_password,
    reset_password
)

router = DefaultRouter()
router.register("doctors", DoctorViewSet, basename="doctors")
router.register("appointments", AppointmentViewSet, basename="appointments")
router.register("lab-tests", LabTestViewSet, basename="lab-tests")
router.register("lab-orders", LabBookingViewSet, basename="lab-orders")
router.register("orders", OrderViewSet, basename="orders")
router.register("health-records", HealthRecordViewSet, basename="health-records")
router.register("admin-users", AdminUserViewSet, basename="admin-users")
router.register("payments", PaymentViewSet, basename="payments")

urlpatterns = [
    path("login/", login_user, name="login"),
    path("send-otp/", send_otp, name="send-otp"),
    path("verify-otp/", verify_otp, name="verify-otp"),
    path("admin-dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("forgot-password/", forgot_password, name="forgot-password"),
    path("reset-password/", reset_password, name="reset-password"),

    path("payment-gateway/create-order/", CreateRazorpayOrderView.as_view(), name="payment-create-order"),
    path("payment-gateway/verify/", VerifyRazorpayPaymentView.as_view(), name="payment-verify"),

    path("", include(router.urls)),
]