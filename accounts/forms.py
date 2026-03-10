


from django import forms
from .models import Worker

class ProfilePhotoForm(forms.ModelForm):
    class Meta:
        model = Worker
        fields = ['profile_photo']