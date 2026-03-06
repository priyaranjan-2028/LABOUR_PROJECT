
from django.contrib import admin
from django.urls import path, include
from accounts import views

urlpatterns = [
  path('', views.index, name='index'),
  
  path('worker_dashboard/', views.worker_dashboard, name='worker_dashboard'),
 # path('login/', views.logi, name='login'),
  path('forget_password/', views.forgot_password, name='forget_password'),

]
