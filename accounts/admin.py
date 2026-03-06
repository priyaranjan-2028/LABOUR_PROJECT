from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # The fields to be displayed in the list view
    list_display = ('email', 'full_name', 'phone_number', 'location', 'company_name', 'is_staff')
    
    # Filter options on the right sidebar
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_employer')
    
    # Search functionality
    search_fields = ('email', 'full_name', 'phone_number', 'company_name')
    
    # How fields are grouped in the 'Edit User' page
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone_number', 'country_code', 'location', 'company_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_employer', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Required when using email as the USERNAME_FIELD
    ordering = ('email',)

# Register the custom model with the custom admin class
admin.site.register(User, CustomUserAdmin)