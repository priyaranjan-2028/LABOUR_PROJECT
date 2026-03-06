from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings

# 1. MOVE USER CLASS TO THE TOP
class User(AbstractUser):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    
    phone_regex = RegexValidator(
        regex=r'^\d{9,15}$', 
        message="Phone number must be entered as '999999999'. Up to 15 digits allowed."
    )
    country_code = models.CharField(max_length=5, default='+91')
    phone_number = models.CharField(validators=[phone_regex], max_length=17, unique=True)
    
    location = models.CharField(max_length=255, help_text="City and State")
    company_name = models.CharField(max_length=255, blank=True, null=True)
    
    date_joined = models.DateTimeField(auto_now_add=True)
    is_employer = models.BooleanField(default=True)

    # Remove 'username' requirement
    username = None 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number']

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Employer"
        verbose_name_plural = "Employers"

# 2. WORKER PROFILE BELOW
class WorkerProfile(models.Model):
    User = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='worker_profile'
    )
    expertise = models.CharField(max_length=255, help_text="e.g. Plumber, Electrician")
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Worker: {self.user.full_name}"