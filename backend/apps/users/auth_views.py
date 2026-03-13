from .library import *
from apps.user_settings.models import user_settings
from utils.validations import CustomValidationError400

# def get_http_message(http_code):
#     obj = resources_types.objects.filter(ID=f"TYPE.HTTP_CODE.{http_code}").values(
#         "SHORT_LABEL"
#     )
#     return obj


class UserRegisterView(generics.GenericAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        if not request.data["isAgree"]:
            msg = get_info_message("AUTH.REGISTER.TERMS")
            return Response(
                {"status_code": 400, "status_message": msg},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = Token.objects.create(user=user)
            row_id = uuid.uuid4().hex
            user_settings.objects.create(USER=user, ROW_ID=row_id)
            msg = get_info_message("AUTH.REGISTER.SUCCESS")
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                    "token": token.key,
                }
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data["user"]
            update_last_login(None, user)
            token = Token.objects.get_or_create(user=user)
            msg = get_info_message("AUTH.LOGIN.SUCCESS")
            return Response(
                {
                    "status_code": int(str(status.HTTP_200_OK)),
                    "status_message": msg,
                    "token": str(token[0]),
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


class UserChangePassword(generics.CreateAPIView):
    serializer_class = ChangePasswordSerializer
    authentication_classes = [
        TokenAuthentication,
    ]

    def post(self, request, *args, **kwargs):
        to_layerDb("STD")
        serializer = self.get_serializer(data=request.data)
        is_valid = serializer.is_valid()

        if request.data.get("old_password") == request.data.get("new_password"):
            is_valid = False
            msg = get_info_message("PROFILE.PASSWORD.UPDATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )

        elif serializer.is_valid():
            user = serializer.save()
            msg = get_info_message("PROFILE.PASSWORD.UPDATE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgetPassword(generics.GenericAPIView):
    serializer_class = ForgetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        to_layerDb("STD")
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            msg = get_info_message("AUTH.FORGETPASSWORD.SUCCSESS")
            data = {"status_code": 400, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetForgetPassword(generics.GenericAPIView):
    serializer_class = ResetNewPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(kwargs)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class logout(generics.ListAPIView):
    authentication_classes = [
        TokenAuthentication,
    ]

    def get(self, request, *args, **kwargs):
        return Response({"message": "successful logout"}, status=status.HTTP_200_OK)


class RemoveUserView(generics.CreateAPIView):
    authentication_classes = [
        TokenAuthentication,
    ]

    def post(self, request, *args, **kwargs):
        try:
            layers = request.data["LAYER_NAME"]
            for email in request.data.get("users"):
                User.objects.filter(id=email).delete()
            to_layerDb("STD")
            try:
                for email in request.data.get("users"):
                    user = User.objects.filter(id=email).first()
                    user.layer_name.remove(layers)
            except Exception as e:
                print("pass")
            msg = get_info_message("USER.DELETE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("USER.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )
