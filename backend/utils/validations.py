from rest_framework.exceptions import APIException


class CustomValidationError400(APIException):
    status_code = 400
    default_detail = {
        "status_code": int(400),
        "status_message": "msg",
    }


class CustomValidationError404(APIException):
    status_code = 404
    default_detail = {
        "status_code": int(404),
        "status_message": "msg",
    }
