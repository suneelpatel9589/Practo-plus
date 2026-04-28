from django.contrib import admin
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()

admin.site.register(User)
admin.site.register(Doctor)
admin.site.register(Appointment)
admin.site.register(LabTest)
admin.site.register(Review)
admin.site.register(LabBooking)
admin.site.register(OrderItem)
admin.site.register(Order)
admin.site.register(HealthRecord)
admin.site.register(Payment)




# Register your models here.


