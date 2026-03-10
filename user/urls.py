from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
app_name = "user"

urlpatterns = [
path("user_dashboard/", views.user_dashboard, name="user_dashboard"),
path("update_profile/", views.update_profile, name="update_profile"),
]