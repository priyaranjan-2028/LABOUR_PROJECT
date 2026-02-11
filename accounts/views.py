from django.shortcuts import render
from django.shortcuts import render, redirect


# Create your views here.
def index(request):
    return render(request, 'index.html')

def register(request):
    return render(request, 'register.html')