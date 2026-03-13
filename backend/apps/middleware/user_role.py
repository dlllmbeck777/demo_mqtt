from rest_framework.authentication import TokenAuthentication
from apps.users.models import User
from apps.users.serializers import UserSerializer
from apps.roles.models import roles
from apps.roles.serializers import RolesPropertySerializer


class UserRoleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request = self._get_user_from_token(request)
        self._set_user_role(request)
        response = self.get_response(request)

        return response

    def _get_user_from_token(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Token "):
            return request

        try:
            _, token = auth_header.split()
            authenticator = TokenAuthentication()
            user, _ = authenticator.authenticate_credentials(token)
            request.user = user
        except:
            request.user = None

        return request

    def _set_user_role(self, request):
        if not request.user or not request.user.is_authenticated:
            request.role = None
            return

        try:
            user_role = User.objects.filter(email=request.user).values("role").first()
            if user_role:
                role = roles.objects.filter(ROLES_ID=user_role["role"]).first()
                if role:
                    serializer = RolesPropertySerializer(role)
                    response = {
                        item["ROLES_TYPES"]: {**item}
                        for item in serializer.data.get("PROPERTY_ID")
                    }
                    request.role = response
                else:
                    request.role = None
            else:
                request.role = None
        except User.DoesNotExist:
            request.role = None
