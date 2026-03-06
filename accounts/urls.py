from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [

  path('', views.index, name='index'),
  path('login1/', views.login1, name='login1'),
  
  path('worker_dashboard/', views.worker_dashboard, name='worker_dashboard'),
 # path('login/', views.logi, name='login'),
 # path('forget_password/', views.forgot_password, name='forget_password'),
  path("user_dashboard/", views.user_dashboard, name="user_dashboard"),
  path('worker_login/', views.worker_login, name='worker_login'),
  path('user_login/', views.user_login, name='user_login'),
  path('worker_register/', views.worker_register, name='worker_register'),
  path("send-otp/", views.send_otp, name="send_otp"),
  path("varify_otp_user/", views.varify_otp_user, name="varify_otp_user"),
  path('user_register/', views.user_register, name='user_register'),

]
    


    



 
  #path('update-profile/', views.update_profile, name='update_profile'),
 



