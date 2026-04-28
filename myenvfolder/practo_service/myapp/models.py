from decimal import Decimal
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("PATIENT", "Patient"),
        ("DOCTOR", "Doctor"),
        ("ADMIN", "Admin"),
    )

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="PATIENT")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email


class Doctor(models.Model):
    COMMISSION_PERCENT = Decimal("7.00")

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="doctor_profile"
    )
    doctor_name = models.CharField(max_length=120, blank=True, null=True)
    specialization = models.CharField(max_length=100)
    experience = models.PositiveIntegerField()
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    bio = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="doctors/", blank=True, null=True)
    is_approved = models.BooleanField(default=True)

    @property
    def commission_amount(self):
        return (self.consultation_fee * self.COMMISSION_PERCENT) / Decimal("100")

    @property
    def doctor_receives(self):
        return self.consultation_fee - self.commission_amount

    def __str__(self):
        return self.doctor_name or self.user.email


class Appointment(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed"),
    )

    PAYMENT_CHOICES = (
        ("COD", "Cash"),
        ("ONLINE", "Online"),
    )

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default="COD")
    symptoms = models.TextField(blank=True, null=True)

    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_percent = models.DecimalField(max_digits=5, decimal_places=2, default=7.00)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    doctor_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        fee = Decimal(str(self.doctor.consultation_fee or 0))
        percent = Decimal(str(self.commission_percent or 0))
        commission = (fee * percent) / Decimal("100")

        self.subtotal_amount = fee
        self.commission_amount = commission
        self.doctor_payout = fee
        self.total_amount = fee + commission
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient.email} - {self.doctor.user.email} - {self.status}"


class Prescription(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name="prescription")
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription #{self.id}"


class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name="items")
    medicine_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.medicine_name


class LabTest(models.Model):
    test_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.test_name


class LabBooking(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("BOOKED", "Booked"),
        ("SAMPLE_COLLECTED", "Sample Collected"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    )

    PAYMENT_CHOICES = (
        ("COD", "Cash on Collection"),
        ("ONLINE", "Online Payment"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lab_bookings")
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lab_bookings",
    )

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default="COD")

    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_percent = models.DecimalField(max_digits=5, decimal_places=2, default=8.00)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    lab_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="BOOKED")

    def __str__(self):
        return f"{self.user.email} - LabBooking #{self.id}"


class LabBookingItem(models.Model):
    booking = models.ForeignKey(LabBooking, on_delete=models.CASCADE, related_name="items")
    test_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.line_total = Decimal(str(self.price or 0)) * Decimal(str(self.quantity or 1))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.test_name


class Order(models.Model):
    STATUS_CHOICES = (
        ("PENDING_PAYMENT", "Pending Payment"),
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    )

    PAYMENT_CHOICES = (
        ("COD", "Cash on Delivery"),
        ("ONLINE", "Online Payment"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default="COD")

    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pharmacy_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    medicine_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    commission_percent = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    line_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.line_total = Decimal(str(self.price or 0)) * Decimal(str(self.quantity or 1))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.medicine_name


class Payment(models.Model):
    PAYMENT_STATUS = (
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    PAYMENT_FOR = (
        ("APPOINTMENT", "Appointment"),
        ("ORDER", "Order"),
        ("LAB", "Lab"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    lab_booking = models.ForeignKey(LabBooking, on_delete=models.SET_NULL, null=True, blank=True)

    payment_for = models.CharField(max_length=20, choices=PAYMENT_FOR)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, default="RAZORPAY")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="PENDING")
    transaction_id = models.CharField(max_length=255, blank=True, null=True)

    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment #{self.id} - {self.payment_status}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveIntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.rating}"


class HealthRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="health_records")
    file = models.FileField(upload_to="health_records/")
    record_type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.record_type


class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps")
    otp_code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.otp_code}"