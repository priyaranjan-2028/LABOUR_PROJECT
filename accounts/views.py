from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.models import User
from .models import Worker, WorkType

# --- Helper Function ---
def index(request):
    return render (request,"index.html")

# --- Employer/User Views ---
def login(request):
    return render(request, 'login.html')

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

    works = WorkType.objects.all()

    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")
        intro = request.POST.get("introduction")

        selected_works = request.POST.getlist("works")

        if password != confirm_password:
            return render(request, "worker_register.html", {"error":"Passwords do not match", "works":works})

        worker = Worker.objects.create(
            name=name,
            email=email,
            phone=phone,
            password=password,
            introduction=intro
        )

        worker.works.set(selected_works)

        return redirect("login")

    return render(request, "worker_register.html", {"works":works})
def worker_login(request):
    return render(request, 'worker_login.html')


# --- Shared & Dashboard ---


def labour_dashboard(request):
    return render(request, 'labour_dashboard.html')

#def user_logout(request):
    logout(request)
 #   messages.info(request, "You have been logged out.")
    return redirect('index')
def worker_dashboard(request):
    return render(request, 'worker_dashboard.html')
'''def update_profile(request):
    return render(request, 'labour_register.html')
'''





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
