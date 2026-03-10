from django.shortcuts import render
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from accounts.models import UserProfile
from django.contrib import messages


# Create your views here.
from geopy.geocoders import Nominatim

from geopy.exc import GeocoderTimedOut


def user_dashboard(request):
    """Main dashboard view for users"""

    user_profile = UserProfile.objects.filter(user=request.user).first()

    latitude = None
    longitude = None

    if user_profile and user_profile.location:

        location = user_profile.location

        try:
            geolocator = Nominatim(user_agent="labour_connect", timeout=10)

            # Add India to improve accuracy
            full_address = f"{location}, India"

            geo_location = geolocator.geocode(full_address)

            if geo_location:
                latitude = geo_location.latitude
                longitude = geo_location.longitude
            else:
                # fallback default (Bhubaneswar)
                latitude = 20.2961
                longitude = 85.8245

        except GeocoderTimedOut:
            latitude = 20.2961
            longitude = 85.8245

    context = {
        'user': request.user,
        'user_profile': user_profile,
        'user_latitude': latitude,
        'user_longitude': longitude,
    }

    return render(request, 'user/user_dashboard.html', context)
def update_profile(request):
    """Update user profile"""
    try:
        user_profile = UserProfile.objects.get(user=request.user)

        user_profile.full_name = request.POST.get('full_name', user_profile.full_name)
        user_profile.phone = request.POST.get('phone', user_profile.phone)
        user_profile.location = request.POST.get('location', user_profile.location)

        if request.POST.get('company'):
            user_profile.company = request.POST.get('company')

        user_profile.save()

        email = request.POST.get('email')
        if email and email != request.user.email:
            request.user.email = email
            request.user.save()

        messages.success(request, 'Profile updated successfully!')

    except Exception as e:
        messages.error(request, f'Error updating profile: {str(e)}')

    return redirect('user:user_dashboard')