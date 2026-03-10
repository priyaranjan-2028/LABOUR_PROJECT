from django.contrib import admin
from django.urls import path
from . import views
app_name = "app1"   
urlpatterns = [
   path('dashboard1/',views.dashboard1,name='dashboard1'),
   path('profile/',views.profile,name='profile'),
   path('notification/',views.notification,name='notification'),
   path('update/',views.update,name='update'),
   path('workhistory/',views.workhistory,name='workhistory'),
   path('recent/',views.recent,name='recent'),
   path("ajax-upload-photo/", views.ajax_upload_profile_photo, name="ajax_upload_photo"),
  
    
]