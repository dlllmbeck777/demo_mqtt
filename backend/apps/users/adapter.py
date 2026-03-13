from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.adapter import get_adapter
from allauth.account.adapter import get_adapter as get_account_adapter
from django.contrib.auth import get_user_model


class NoNewUsersAccountAdapter(DefaultAccountAdapter):
    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the
        signup form.
        """
        # print('----------------------------------------------------------> SAVE')
        from allauth.utils import user_email, user_field, user_username

        data = form.cleaned_data
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        username = data.get("username")
        user_email(user, email)
        user_username(user, username)
        if first_name:
            user_field(user, "first_name", first_name)
        if last_name:
            user_field(user, "last_name", last_name)
        if "password1" in data:
            user.set_password(data["password1"])
        else:
            user.set_unusable_password()
        self.populate_username(request, user)
        if commit:
            # Ability not to commit makes it easier to derive from
            # this adapter by adding
            user.save()
        return user

    def is_auto_signup_allowed(self, request, sociallogin):
        # If email is sp
        return False

    def is_open_for_signup(self, request, sociallogin):
        """
        Checks whether or not the site is open for signups.
        Next to simply returning True/False you can also intervene the
        regular flow by raising an ImmediateHttpResponse
        """
        print("is_open_for_signup")
        return False


class FooAppSocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request, sociallogin):
        """
        Checks whether or not the site is open for signups.
        Next to simply returning True/False you can also intervene the
        regular flow by raising an ImmediateHttpResponse
        """
        print("------------------------------------------> is open for signup")
        return False

    def is_auto_signup_allowed(self, request, sociallogin):
        print("----------------------------------------> is auto signup allowed")
        return False
