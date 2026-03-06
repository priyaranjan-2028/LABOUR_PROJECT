from django.contrib import admin
from accounts.models import home, Worker, WorkType,UserProfile

# Register your models here.
# accounts/admin.py
admin.site.register(home)
admin.site.register(Worker)
admin.site.register(WorkType)


admin.site.register( UserProfile)
