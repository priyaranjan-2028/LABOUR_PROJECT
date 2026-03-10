from urllib import request

from django.shortcuts import render,redirect

from accounts.models import Worker
from accounts.forms import ProfilePhotoForm

# Create your views here.
def dashboard1(request):
    email = request.session.get('worker_email')  # or request.user.email if using auth
    worker = Worker.objects.filter(email=email).first()  # fetch from DB

    return render(request, 'worker/dashboard1.html', {'worker': worker})
# app1/views.py
from django.http import JsonResponse
from accounts.models import Worker

def ajax_upload_profile_photo(request):
    if request.method == "POST" and request.FILES.get("profile_photo"):
        email = request.session.get("worker_email")
        if not email:
            return JsonResponse({"success": False, "error": "Not logged in"})

        worker = Worker.objects.filter(email=email).first()
        if not worker:
            return JsonResponse({"success": False, "error": "Worker not found"})

        worker.profile_photo = request.FILES["profile_photo"]
        worker.save()
        return JsonResponse({"success": True, "photo_url": worker.profile_photo.url})

    return JsonResponse({"success": False, "error": "Invalid request"})

def notification(request):
    return render(request,'worker/notification.html')
'''def update(request):
    return render(request,'worker/update.html')'''
def workhistory(request):
    return render(request,'worker/workhistory.html')
def recent(request):
    return render(request,'worker/recent.html')
'''def profile(request):
    return render(request,'worker/profile.html')

'''
'''
from django.shortcuts import render, redirect
from .models import Worker'''


def profile(request):
    # ✅ Get email from session
    email = request.session.get("worker_email")

    if not email:
        # Not logged in
        return redirect("app1:worker_login")

    # Fetch worker using email
    worker = Worker.objects.filter(email=email).first()

    if not worker:
        # Worker not found in DB
        return redirect("app1:worker_register")

    context = {
        "worker": worker
    }
    return render(request, "worker/profile.html", context)

# app1/views.py
from django.shortcuts import render, redirect
from accounts.models import Worker  # import Worker from accounts app
from django import forms

# Create the form inside this app1 file (or you can put it in forms.py inside app1)
class WorkerUpdateForm(forms.ModelForm):
    STATUS_CHOICES = [
        
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    status = forms.ChoiceField(
        choices=STATUS_CHOICES, 
        widget=forms.Select(attrs={'class': 'form-input'})  # <- ensures your style is applied
    )

    class Meta:
        model = Worker
        fields = ['name', 'email', 'phone', 'location', 'works', 'status']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input'}),
            'email': forms.EmailInput(attrs={'class': 'form-input'}),
            'phone': forms.TextInput(attrs={'class': 'form-input'}),
            'location': forms.TextInput(attrs={'class': 'form-input'}),
            'works': forms.SelectMultiple(attrs={'class': 'form-input'}),
        }

def update(request):
    # Assuming you store logged-in worker's id in session
    worker_id = request.session.get('worker_id')  
    worker = Worker.objects.filter(id=worker_id).first()
    
    if request.method == 'POST':
        form = WorkerUpdateForm(request.POST, instance=worker)
        if form.is_valid():
            form.save()
            return redirect('app1:dashboard1')
    else:
        form = WorkerUpdateForm(instance=worker)
    
    return render(request, 'worker/update.html', {'form': form})

