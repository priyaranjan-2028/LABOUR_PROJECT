from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models


class home(models.Model):
    name = models.CharField( max_length=50)
    email = models.EmailField(max_length=254, null=True)