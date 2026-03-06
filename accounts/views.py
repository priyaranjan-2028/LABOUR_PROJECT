from django.shortcuts import render, redirect
import json
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.models import User
from .models import Worker, WorkType
# for otp send 
import random
import json
from django.http import JsonResponse
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.models import User
from .models import UserProfile # Ensure these are imported correctly
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.contrib import messages
import random
from django.utils import timezone
from django.conf import settings
# --- Helper Function ---
def index(request):
    return render (request,"index.html")

# --- Employer/User Views ---
def login1(request):
    return render(request, 'login1.html')





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

# send otp
def send_otp(request):
    data = json.loads(request.body)
    email = data.get("email")

    otp = random.randint(100000,999999)

    request.session["otp"] = otp
    request.session["email"] = email

    send_mail(
        "Your OTP",
        f"Your OTP is {otp}",
        "your_email@gmail.com",
        [email],
        fail_silently=False,
    )

    return JsonResponse({"message":"OTP sent to email"})

# verify otp

def verify_otp(request):
    data = json.loads(request.body)
    otp = data.get("otp")

    if str(request.session.get("otp")) == str(otp):
        return JsonResponse({"status":"success"})
    else:
        return JsonResponse({"status":"fail"})


def worker_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            worker = Worker.objects.get(email=email, password=password)
            request.session["worker_id"] = worker.id
            return redirect("worker_dashboard")
        except Worker.DoesNotExist:
            return render(request, "worker_login.html", {"error": "Invalid email or password"})

    return render(request, "worker_login.html")


# --- Shared & Dashboard ---


def user_dashboard(request):
    return render(request, 'user_dashboard.html')

#def user_logout(request):
    logout(request)
 #   messages.info(request, "You have been logged out.")
    return redirect('index')
def worker_dashboard(request):
    return render(request, 'worker_dashboard.html')
'''def update_profile(request):
    return render(request, 'labour_register.html')
'''



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
'''
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

        # 1️⃣ Email validation
        if User.objects.filter(email=email).exists():
            messages.error(request, 'This email is already registered.')
            return render(request, 'user_register.html')

        # 2️⃣ Create User
        first_name, last_name = get_names(full_name)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # 3️⃣ Generate OTP
        otp = random.randint(100000, 999999)

        # 4️⃣ Create Profile
        UserProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=f"{country_code} {phone}",
            location=location,
            company=company,
            user_type='employer',
            otp=otp,
            otp_created_at=timezone.now(),
            is_verified=False
        )

        # 5️⃣ Send OTP Email
        send_mail(
            subject='Your OTP Verification Code',
            message=f'Your OTP is {otp}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        # 6️⃣ Save email in session
        request.session['verify_email'] = email

        return redirect('varify_otp_user')

    return render(request, 'user_register.html')
def varify_otp_user(request):

    email = request.session.get('verify_email')

    if not email:
        return redirect('user_register')

    try:
        user = User.objects.get(email=email)
        profile = UserProfile.objects.get(user=user)
    except:
        messages.error(request, "User not found.")
        return redirect('user_register')

    if request.method == 'POST':

        entered_otp = request.POST.get('otp')

        if str(profile.otp) == entered_otp:

            profile.is_verified = True
            profile.otp = None
            profile.save()

            messages.success(request, "Account verified successfully!")
            return redirect('user_login')

        else:
            messages.error(request, "Invalid OTP")

    return render(request, 'varify_otp_user.html')
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