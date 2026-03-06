from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.models import User
# from .models import UserProfile, Worker  # Ensure these are imported correctly
from django.contrib.auth.decorators import login_required

# --- Helper Function ---
def index(request):
    return render (request,"index.html")
def get_names(full_name):
    parts = full_name.split()
    first_name = parts[0] if parts else ''
    last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''
    return first_name, last_name

# --- Employer/User Views ---

def user_register(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        country_code = request.POST.get('country_code')
        location = request.POST.get('location')
        company = request.POST.get('company', '')
        password = request.POST.get('password')

        # 1. Validation
        if User.objects.filter(email=email).exists():
            messages.error(request, 'This email is already registered.')
            return render(request, 'user_register.html')

        # 2. Create Base User
        first_name, last_name = get_names(full_name)
        user = User.objects.create_user(
            username=email, # Using email as username for auth
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # 3. Create Employer Profile
        UserProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=f"{country_code} {phone}",
            location=location,
            company=company,
            user_type='employer'
        )

        messages.success(request, 'Account created successfully! Please sign in.')
        return redirect('user_login')

    return render(request, 'user_register.html')

def user_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        remember = request.POST.get('remember')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            # Verify they are an Employer
            if UserProfile.objects.filter(user=user, user_type='employer').exists():
                login(request, user)
                if not remember:
                    request.session.set_expiry(0)
                return redirect('user_dashboard')
            else:
                messages.error(request, 'This account is not registered as an employer.')
        else:
            messages.error(request, 'Invalid email or password.')

    return render(request, 'user_login.html')

# --- Worker Views ---

def worker_register(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        # ... (Get other fields similarly)

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already in use.')
            return render(request, 'worker_register.html')

        # Create User & Worker Profile
        first_name, last_name = get_names(full_name)
        user = User.objects.create_user(username=email, email=email, password=password)
        
        Worker.objects.create(
            user=user,
            full_name=full_name,
            # ... store other fields
        )
        
        messages.success(request, 'Worker registration successful!')
        return redirect('worker_login')

    return render(request, 'worker_register.html')
def worker_login(request):
    return render(request, 'worker_login.html')


# --- Shared & Dashboard ---


def labour_dashboard(request):
    return render(request, 'labour_dashboard.html')

def user_logout(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('index')
def worker_dashboard(request):
    return render(request, 'worker_dashboard.html')
def update_profile(request):
    return render(request, 'labour_register.html')

