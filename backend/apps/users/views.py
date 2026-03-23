from .library import *

from apps.layer.helpers import get_std_db_alias, to_layerDb
from .helpers import public_active_layer_name, visible_layer_names


class UserCheckView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            is_available = False
            user = User.objects.filter(email=request.data.get("email"))
            data = ""
            is_available = False
            if user:
                is_available = True
            msg = get_info_message("AUTH.REGISTER.FAIL.INUSE")
            data = {"status_code": 200, "status_message": msg, "data": is_available}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserLayersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            alias = get_std_db_alias()
            user = User.objects.using(alias).filter(email=str(request.user)).first()
            if not user:
                return Response([], status=status.HTTP_200_OK)
            layers = visible_layer_names(user, alias)
            return Response(layers, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserModelViewSet(ModelViewSet):
    """
    Endpiont for user model, It accept all operations except for user creation.
    It will be enabled or disabled based upon the product requirements.
    """

    serializer_class = UserModelSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ("head", "option", "get")

    def get(self, request, *args, **kwargs):
        try:
            queryset = User.objects.all()
            serializer = UserModelSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserDetails(generics.ListAPIView):
    queryset = User.objects.none()
    serializer_class = UserModelDepthSerializer
    permissions_classes = [AllowAny]

    def list(self, request):
        try:
            std_alias = get_std_db_alias()
            std_user = (
                User.objects.using(std_alias).filter(email=str(request.user)).first()
            )
            current_user = User.objects.filter(email=request.user).first()
            source_user = current_user or std_user

            if not source_user:
                return Response(
                    {"error": f"User not found: {request.user}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer = self.serializer_class(source_user)
            if request.role:
                serializer.data["role"]["PROPERTY_ID"] = request.role

            data = serializer.data
            if std_user:
                data["layer_name"] = visible_layer_names(std_user, std_alias)
                data["active_layer"] = public_active_layer_name(std_user, std_alias)
                return Response(data, status=status.HTTP_200_OK)
            try:
                data["layer_name"] = visible_layer_names(source_user, std_alias)
                data["active_layer"] = public_active_layer_name(source_user, std_alias)
            except:
                # print(user)
                to_layerDb("STD")
                user = User.objects.filter(email=request.user)[0]
                data["layer_name"] = visible_layer_names(user, std_alias)
                data["active_layer"] = public_active_layer_name(user, std_alias)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = []

    def list(self, request):
        try:
            queryset = self.get_queryset()
            serializer = UserSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# class ForgetPasswordChange(generics.GenericAPIView):
#     """
#     if forgot_logged is valid and account exists then only pass otp, phone and password to reset the password. All three should match.APIView
#     """

#     def post(self, request, *args, **kwargs):
#         phone = request.data.get("phone", False)
#         otp = request.data.get("otp", False)
#         password = request.data.get("password", False)


class UserConfirmEmailView(AtomicMixin, GenericAPIView):
    serializer_class = None
    authentication_classes = ()

    def get(self, request, activation_key):
        """
        View for confirm email.

        Receive an activation key as parameter and confirm email.
        """
        try:
            user = get_object_or_404(User, activation_key=str(activation_key))
            if user.confirm_email():
                return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserEmailConfirmationStatusView(generics.GenericAPIView):
    serializer_class = None
    authentication_classes = (TokenAuthentication,)

    def get(self, request):
        """Retrieve user current confirmed_email status."""
        try:
            user = self.request.user
            return Response({"status": user.confirmed_email}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetUserRolesView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            qs = User.objects.filter(role=None, layer_name="OG_STD")
            serializer = UserSerializer(qs, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetUserByRoleIdView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            qs = User.objects.filter(
                role=request.data.get("ROLES_ID"), layer_name="OG_STD"
            )
            serializer = UserSerializer(qs, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
