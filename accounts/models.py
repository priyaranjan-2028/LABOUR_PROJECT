from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
import random



class home(models.Model):
    name = models.CharField( max_length=50)
    email = models.EmailField(max_length=254, null=True)



# for worker register 
class WorkType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Worker(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=128)

    works = models.ManyToManyField(WorkType)

    introduction = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    

class UserProfile(models.Model):

    USER_TYPE_CHOICES = (
        ('employer', 'Employer'),
        ('worker', 'Worker'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, unique=True)
    location = models.CharField(max_length=200)

    company = models.CharField(max_length=200, blank=True, null=True)

    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='worker'
    )

    # OTP fields
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        return str(random.randint(100000, 999999))

    def __str__(self):
        return self.full_name