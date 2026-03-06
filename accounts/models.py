from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings


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