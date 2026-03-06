from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.models import User


# Create your views here.
def index(request):
    return render(request, 'index.html')



def worker_dashboard(request):
    return render(request, 'worker_dashboard.html')



def forgot_password(request):
    if request.method == "POST":
        username = request.POST.get('username')
        new_password = request.POST.get('new_password')

        try:
            user = User.objects.get(username=username)
            user.set_password(new_password)
            user.save()
            messages.success(request, "Password updated successfully! Please login.")
            return redirect('login')
        except User.DoesNotExist:
            return render(request, 'forget_password.html', {'error': 'Username does not exist.'})

    return render(request, 'forget_password.html')