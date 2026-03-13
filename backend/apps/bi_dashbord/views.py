from datetime import datetime
from django.shortcuts import render
from utils.utils import get_info_message
from utils.validations import CustomValidationError400
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import bi_dashboard
from apps.bi_layouts.models import bi_layout
from apps.bi_widgets.models import bi_widget
from apps.tags.models import tags
from apps.tags_calculated.models import tags_calculated
from apps.item.models import item
from apps.bi_widget_property.models import bi_widget_property
from apps.bi_widget_property.serializers import Widget_PropertyDublicateSerializer
from apps.bi_layouts.serializers import LayoutsSerializer, LayoutsDublicateSerializer
from .serializers import DashBoardsSaveSerializer, DashBoardsAllFieldSerializer
import uuid
from rest_framework.response import Response
from apps.users.models import User
from apps.roles.models import roles
from django.db import transaction


class DashBoardsGetUserView(generics.CreateAPIView):
    serializer_class = DashBoardsAllFieldSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(self.get_role())

    def get_role(self):
        all_user = User.objects.exclude(role_id__ROLES_NAME="Admin").values(
            "email", "first_name", "last_name"
        )

        obj = (
            bi_dashboard.objects.filter(
                ROW_ID=self.request.data["ROW_ID"],
            )
            .values_list("DASHBOARD_USER", flat=True)
            .first()
        )
        if obj:
            for user in all_user:
                if user["email"] in obj:
                    user["state"] = True
                else:
                    user["state"] = False
        # print(obj)
        return all_user


class DashBoardsUpdateUserView(generics.CreateAPIView):
    serializer_class = DashBoardsAllFieldSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(self.get_role())

    def get_role(self):
        obj = (
            bi_dashboard.objects.filter(
                ROW_ID=self.request.data["ROW_ID"],
            )
            .values_list("DASHBOARD_USER", flat=True)
            .first()
        )
        if self.request.data["email"] in obj:
            if not self.request.data["state"]:  # state false
                obj.remove(self.request.data["email"])
            else:
                pass  # Email already exists but request to be added has been made
        else:
            if self.request.data["state"]:  # state True
                obj.append(self.request.data["email"])
            else:
                pass  # Email does not exist but deletion request has been made
        bi_dashboard.objects.filter(
            ROW_ID=self.request.data["ROW_ID"],
        ).update(DASHBOARD_USER=obj)

        return {"message": "Successful"}


# Create your views here.
class DashBoardsView(generics.CreateAPIView):
    serializer_class = DashBoardsAllFieldSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request):
        # layouts_type = ["lg", "md", "xs", "xss"]

        return Response(self.return_result(), status=status.HTTP_200_OK)

    def get_query(self):
        role_name = (
            roles.objects.filter(
                ROLES_ID__in=(
                    User.objects.filter(email=str(self.request.user)).values_list(
                        "role_id", flat=True
                    )
                )
            )
            .values_list("ROLES_NAME", flat=True)
            .first()
        )
        if role_name == "Admin":
            return bi_dashboard.objects.filter(
                ITEM_ID=self.request.data.get("ITEM_ID")
            ).order_by("NAME")
        else:
            return bi_dashboard.objects.filter(
                ITEM_ID=self.request.data.get("ITEM_ID"),
                DASHBOARD_USER__contains=str(self.request.user),
            ).order_by("NAME")

    def return_result(self):
        layouts_type = (
            bi_layout.objects.order_by().values_list("l_type", flat=True).distinct()
        )

        dashboards = self.get_query()
        result = {}
        for dashboard in dashboards:
            tempt = {
                **DashBoardsAllFieldSerializer(dashboard).data,
                "layouts": {
                    item: LayoutsSerializer(
                        bi_layout.objects.filter(
                            i__in=DashBoardsAllFieldSerializer(dashboard).data[
                                "WIDGETS"
                            ],
                            l_type=item,
                        ),
                        many=True,
                    ).data
                    for item in layouts_type
                },
            }
            result[dashboard.NAME] = tempt
        return result


# Create your views here.
class DashBoardsSaveView(generics.CreateAPIView):
    serializer_class = DashBoardsSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = DashBoardsSaveSerializer(data=request.data)
            if serializer.is_valid():
                widget_prop = serializer.save()
                message = DashBoardsSaveSerializer(widget_prop).data
                msg = get_info_message("DASHBOARD.CREATE.SUCCESS")
                return Response(
                    {
                        "status_code": int(str(status.HTTP_200_OK)),
                        "status_message": msg,
                        "data": message,
                    },
                    status=status.HTTP_200_OK,
                )
        except:
            msg = get_info_message("DASHBOARD.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class DashBoardsDeleteView(generics.CreateAPIView):
    serializer_class = DashBoardsSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            qs = bi_dashboard.objects.filter(ROW_ID=request.data.get("ROW_ID"))
            if qs:
                widgets = qs.values_list("WIDGETS", flat=True)
                propertys = bi_widget_property.objects.filter(WIDGET_ID__in=widgets)
                for prop in propertys:
                    prop.PROPERTY_TAG.clear()
                    prop.WIDGET_ID.clear()
                propertys.delete()
                bi_widget.objects.filter(WIDGET_ID__in=widgets).delete()
                qs.delete()
                msg = get_info_message("DASHBOARD.DELETE.SUCCESS")
                return Response(
                    {
                        "status_code": int(str(status.HTTP_200_OK)),
                        "status_message": msg,
                    },
                    status=status.HTTP_200_OK,
                )
        except:
            msg = get_info_message("DASHBOARD.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class DashBoardsDeleteAllView(generics.CreateAPIView):
    serializer_class = DashBoardsSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            qs = bi_dashboard.objects.filter(ITEM_ID=request.data.get("FROM_ITEM_ID"))
            if qs:
                widgets = qs.values_list("WIDGETS", flat=True)
                propertys = bi_widget_property.objects.filter(WIDGET_ID__in=widgets)
                for prop in propertys:
                    prop.PROPERTY_TAG.clear()
                    prop.WIDGET_ID.clear()
                propertys.delete()
                bi_widget.objects.filter(WIDGET_ID__in=widgets).delete()
                bi_layout.objects.filter(i__in=widgets).delete()
                qs.delete()
                msg = get_info_message("DASHBOARD.DELETE.SUCCESS")
                return Response(
                    {
                        "status_code": int(str(status.HTTP_200_OK)),
                        "status_message": msg,
                    },
                    status=status.HTTP_200_OK,
                )
        except:
            msg = get_info_message("DASHBOARD.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class DashBoardsDublicateView(generics.CreateAPIView):
    serializer_class = DashBoardsAllFieldSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            dashboard_item = bi_dashboard.objects.filter(
                ROW_ID=request.data.get("ROW_ID")
            )
            serializer = DashBoardsAllFieldSerializer(dashboard_item, many=True)
            current_date = datetime.now()

            # Tarihi "yyyy-mm-dd" formatına çevir
            start_time = current_date.strftime("%Y-%m-%d")
            # find last name
            try:
                if dashboard_item:
                    dashboard_item = serializer.data[0]
                    latest_dashboard = (
                        bi_dashboard.objects.filter(
                            NAME__startswith=dashboard_item["NAME"]
                        )
                        .order_by("-id")
                        .first()
                    )
                    if latest_dashboard:
                        last_dash = latest_dashboard.NAME.rfind("-")
                        if last_dash != -1:
                            last_number = int(latest_dashboard.NAME[last_dash + 1 :])
                            dashboard_item[
                                "NAME"
                            ] = f'{dashboard_item["NAME"]}-{last_number + 1}'
                        else:
                            dashboard_item["NAME"] = f'{dashboard_item["NAME"]}-1'

                new_widget_id = []
                for widget_item in serializer.data[0]["WIDGETS"]:
                    widget_obj = bi_widget.objects.filter(
                        WIDGET_ID=widget_item
                    ).values()[0]
                    widget_obj["WIDGET_ID"] = uuid.uuid4().hex

                    widget_obj["START_DATETIME"] = start_time
                    widget_obj["LAST_UPDT_DATE"] = start_time
                    widget_obj["END_DATETIME"] = "9000-01-01"

                    # widget_obj.append(widget_obj["WIDGET_ID"])
                    widget_obj["ROW_ID"] = uuid.uuid4().hex
                    new_widget = bi_widget.objects.create(**widget_obj)
                    new_widget_id.append(new_widget)

                    # WİDGET PROPERTY

                    widget_property_obj = bi_widget_property.objects.filter(
                        WIDGET_ID=widget_item
                    )
                    widget_prop_serialzier = Widget_PropertyDublicateSerializer(
                        widget_property_obj, many=True
                    )
                    for prop_item in widget_prop_serialzier.data:
                        prop_item["ROW_ID"] = uuid.uuid4().hex
                        prop_item.pop("WIDGET_ID")
                        prop_item.pop("id")
                        prop_item.pop("VERSION")
                        prop_item.pop("DB_ID")
                        prop_item["START_DATETIME"] = start_time
                        prop_item["LAST_UPDT_DATE"] = start_time
                        prop_item["END_DATETIME"] = "9000-01-01"
                        property_tag = prop_item.pop("PROPERTY_TAG")
                        property_tag_cal = prop_item.pop("PROPERTY_TAG_CAL")
                        propb_obj = bi_widget_property.objects.create(**prop_item)
                        propb_obj.WIDGET_ID.set([new_widget])
                        new_tags = []
                        new_tags_cal = []
                        for tag in property_tag:
                            tags_obj = tags.objects.filter(TAG_ID=tag["TAG_ID"])[0]
                            new_tags.append(tags_obj)
                        for tag in property_tag_cal:
                            tags_cal_obj = tags_calculated.objects.filter(
                                TAG_ID=tag["TAG_ID"]
                            )[0]
                            new_tags_cal.append(tags_cal_obj)
                        propb_obj.PROPERTY_TAG_CAL.set(new_tags_cal)
                        propb_obj.PROPERTY_TAG.set(new_tags)

                    # LAYOUTS
                    layouts_obj = bi_layout.objects.filter(i=widget_item)
                    layouts_serializer = LayoutsDublicateSerializer(
                        layouts_obj, many=True
                    )
                    for layouts_item in layouts_serializer.data:
                        layouts_item.pop("id")
                        layouts_item["ROW_ID"] = uuid.uuid4().hex
                        layouts_item["i"] = new_widget
                        bi_layout.objects.create(**layouts_item)

                # dashboards
                dashboard_item["ROW_ID"] = uuid.uuid4().hex
                dashboard_item.pop("id")
                dashboard_item.pop("WIDGETS")
                item_for_dashboard = item.objects.filter(
                    ITEM_ID=dashboard_item["ITEM_ID"]
                ).first()
                dashboard_item["START_DATETIME"] = start_time
                dashboard_item["ITEM_ID"] = item_for_dashboard
                dashboard_obj = bi_dashboard.objects.create(**dashboard_item)
                dashboard_obj.WIDGETS.set(new_widget_id)
                msg = get_info_message("DASHBOARD.DUBLICATE.SUCCESS")
                data = {"status_code": 200, "status_message": msg}
                # Red.delete(str(request.user) + request.data.get("HIERARCHY")[0])
                return Response(data, status=status.HTTP_200_OK)
            except Exception as e:
                transaction.set_rollback(True)
                msg = get_info_message("DASHBOARD.DUBLICATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )


class DashBoardsCopyView(generics.CreateAPIView):
    serializer_class = DashBoardsAllFieldSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            try:
                to_item_id = request.data["TO_ITEM_ID"]
                from apps.bi_dashbord.dashboard_copy.copy import copyWidget

                for data in request.data["DATA"].values():
                    copyWidget(data, to_item_id)
                msg = get_info_message("DASHBOARD.DUBLICATE.SUCCESS")
                data = {"status_code": 200, "status_message": msg}
                # Red.delete(str(request.user) + request.data.get("HIERARCHY")[0])
                return Response(data, status=status.HTTP_200_OK)
            except Exception as e:
                transaction.set_rollback(True)
                msg = get_info_message("DASHBOARD.DUBLICATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )
