from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    



    path('worker_dashboard/', views.worker_dashboard, name='worker_dashboard'),
     path('update-profile/', views.update_profile, name='update_profile'),
    path('labour_dashboard/', views.labour_dashboard, name='labour_dashboard'),
    


    
    path('worker_login/', views.worker_login, name='worker_login'),
    path('user_login/', views.user_login, name='user_login'),
    path('worker-register/', views.worker_register, name='worker_register'),
    path('user-register/', views.user_register, name='user_register'),
]

