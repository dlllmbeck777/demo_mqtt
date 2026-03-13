from django import forms
from django.forms import formset_factory
from .models import Maintenance, MaintenanceWorkTypes, Repair, RepairWorkTypes
from django.utils import formats

class MaintenanceForm(forms.ModelForm):
    class Meta:
        model = Maintenance
        fields = ['station', 'pump', 'maintenanceDateStart', 'maintenanceDateEnd', 'maintenanceType', 'description']
        widgets = {
            'maintenanceDateStart': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
            'maintenanceDateEnd': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
        }


class MaintenanceOilForm(forms.ModelForm):

    class Meta:
        model = MaintenanceWorkTypes
        fields = ['oil', 'datePerformed',]
        widgets = {
            'datePerformed': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
        }

class MaintenanceSealantForm(forms.ModelForm):

    class Meta: 
        model = MaintenanceWorkTypes
        fields = ['sealant', 'datePerformed',]
        widgets = {
            'datePerformed': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
        }  

class RepairForm(forms.ModelForm):
    class Meta:
        model = Repair
        fields = ['station', 'pump', 'repairDateStart', 'repairDateEnd', 'failure', 'repairType', 'description']
        widgets = {
            'repairDateStart': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
            'repairDateEnd': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
        }

class RepairWorkBearingForm(forms.ModelForm):
    class Meta:
        model = RepairWorkTypes
        fields = ['datePerformed', 'bearingElement', 'bearingType', 'bearingModel', 'mttf']
        widgets = {
            'datePerformed': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
        }

class RepairWorkWheelForm(forms.ModelForm):

    class Meta:
        model = RepairWorkTypes
        fields = ['datePerformed', 'wheelModel', 'mttf']
        widgets = {
            'datePerformed': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
        }

class RepairWorkShaftForm(forms.ModelForm):
    class Meta:
        model = RepairWorkTypes
        fields = ['datePerformed', 'shaftModel', 'mttf']
        widgets = {
            'datePerformed': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
        }

class RepairWorkRotorForm(forms.ModelForm):
    class Meta:
        model = RepairWorkTypes
        fields = ['datePerformed', 'mttf']      
        widgets = {
            'datePerformed': forms.DateTimeInput(attrs={'class': 'form-control', 'type':'datetime-local'}),
        }