from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [

  path('', views.index, name='index'),
  path('login/', views.login, name='login'),
  
  path('worker_dashboard/', views.worker_dashboard, name='worker_dashboard'),
 # path('login/', views.logi, name='login'),
  path('forget_password/', views.forgot_password, name='forget_password'),
  path('labour_dashboard/', views.labour_dashboard, name='labour_dashboard'),
  path('worker_login/', views.worker_login, name='worker_login'),
  path('user_login/', views.user_login, name='user_login'),
  path('worker_register/', views.worker_register, name='worker_register'),
  path('user_register/', views.user_register, name='user_register'),

]
    


    



 
  #path('update-profile/', views.update_profile, name='update_profile'),
 



