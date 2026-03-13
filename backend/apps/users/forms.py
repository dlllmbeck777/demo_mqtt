from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import User

class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation',
                                widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class CustomUserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label=("Password"),
                                         help_text=("Raw passwords are not stored, so there is no way to see "  # Noqa
                                                    "this user's password, but you can change the password "  # Noqa
                                                    "using <a href=\"../password/\">this form</a>."))  # Noqa

    class Meta:
        model = User
        fields = ('email', 'password', 'is_active', 'is_admin', 'is_staff', 'is_employee', 'is_client', 'service_admin')

    def clean_password(self):
        return self.initial["password"]