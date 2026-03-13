from django.shortcuts import render
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import ResourceDrawerDetailsSerializer, TestSerializer
from .models import resources_drawer
from apps.layer.helpers import to_layerDb
import json
from apps.type.models import type as types
from apps.resources_types.models import resources_types
from apps.layer.models import layer
from utils.utils import import_data


class ResourceDrawerScriptView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        import_data(resources_drawer, "resources_drawer")
        return Response({"Message": "Succsessfull"}, status=status.HTTP_200_OK)


class ResourceDrawerMenuView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        self.layer_level = (
            layer.objects.filter(LAYER_NAME=request.active_layers)
            .values_list("LAYER_LEVEL", flat=True)
            .first()
        )[0]
        self.culture = kwargs["culture"]
        data = resources_drawer.objects.filter(
            ID="DRAWERMENU", CULTURE=self.culture
        ).first()
        self.return_value = {}
        self.filter_dublicate = []
        # print(request.role.keys())
        self.get_child(data, tempt_dict=self.return_value)

        return Response(self.return_value, status=status.HTTP_200_OK)

    def get_child(
        self, data, is_parent=True, parent_id=None, tempt_dict={}, parent_dict={}
    ):
        try:
            data_child = data.CHILD.filter(LAYER_LEVEL__lte=self.layer_level).order_by(
                "SORT_ORDER"
            )

            if not is_parent:
                # print(data_child)
                data_child = data.CHILD.filter(
                    child__isnull=False,
                    LAYER_LEVEL__lte=self.layer_level,
                    CULTURE=self.culture,
                ).order_by("SORT_ORDER")
                # ORGANIZATION the type classes of the organization's items are also ITEM, even if the ORGANIZATION does not receive the item, it filters it.
                data_child2 = data.CHILD.filter(
                    child__isnull=False, CULTURE=self.culture
                ).order_by("SORT_ORDER")
                unique_data_child = data_child2.difference(data_child)
                for values in unique_data_child:
                    self.filter_dublicate.append(str(values.IS_ITEM).split(".")[1])

            for item in data_child:
                default_dict = {
                    "ID": item.ID,
                    "PARENT": parent_id,
                    "CULTURE": item.CULTURE,
                    "SHORT_LABEL": item.SHORT_LABEL,
                    "MOBILE_LABEL": item.MOBILE_LABEL,
                    "ICON": item.ICON,
                    "ROW_ID": item.ROW_ID,
                    "CHILD": {},
                    "PATH": item.PATH,
                }

                if is_parent:
                    if self.filter_role(str(item.ID).upper()):
                        continue
                    tempt_dict[item.ID] = default_dict

                if parent_id:
                    if self.filter_role(str(item.ID).upper()):
                        continue
                    if parent_dict["PARENT"]:
                        main_parent_id = parent_dict["PARENT"]
                        if item.IS_ITEM:
                            self.get_filtered_item(
                                tempt_dict,
                                item.IS_ITEM,
                                main_parent_id,
                                parent_id,
                                parent_dict,
                            )
                            try:
                                if not tempt_dict[main_parent_id]["CHILD"][parent_id][
                                    "CHILD"
                                ]:
                                    del tempt_dict[main_parent_id]["CHILD"][parent_id]
                            except:
                                pass

                        else:
                            tempt_dict[main_parent_id]["CHILD"][parent_id]["CHILD"][
                                item.ID
                            ] = default_dict
                    else:
                        tempt_dict[parent_id]["CHILD"][item.ID] = default_dict

                self.get_child(
                    item, False, item.ID, tempt_dict, parent_dict=default_dict
                )
        except Exception as e:
            print(e)

    def get_filtered_item(
        self, tempt_dict, item_type, main_parent_id, parent_id, parent_dict
    ):
        for value in self.get_type(item_type):
            if self.filter_role(value["TYPE"]):
                continue
            if not (value["TYPE"] in self.filter_dublicate):
                try:
                    value["PATH"] = value["TYPE"]
                    tempt_dict[main_parent_id]["CHILD"][parent_id]["CHILD"][
                        value["TYPE"]
                    ] = value
                    self.filter_dublicate.append(value["TYPE"])
                except:
                    tempt_dict[main_parent_id]["CHILD"][parent_id] = parent_dict
                    value["PATH"] = value["TYPE"]
                    tempt_dict[main_parent_id]["CHILD"][parent_id]["CHILD"][
                        value["TYPE"]
                    ] = value
                    self.filter_dublicate.append(value["TYPE"])

    def filter_role(self, item_id):
        role_key = list(self.request.role.keys()) if self.request.role else []

        if item_id in role_key and not self.request.role[item_id]["READ"]:
            return True
        else:
            return False

    def get_type(self, type_id):
        if type_id == "ALL_ITEM":
            item_type = (
                types.objects.filter(TYPE_CLASS="ITEM", HIDDEN="False")
                .values("TYPE", "LABEL_ID")
                .order_by("TYPE")
            )
            for item in item_type:
                self.type_update(item)
            return list(item_type)

        else:
            item_type = (
                types.objects.filter(
                    LABEL_ID=type_id, TYPE_CLASS="ITEM", HIDDEN="False"
                )
                .order_by("TYPE")
                .values("TYPE", "LABEL_ID")
                .first()
            )

            return [self.type_update(item_type)]

    def type_update(self, item_type):
        item_resources = self.get_resources(item_type["LABEL_ID"])
        if item_resources:
            item_type.update(item_resources)
        item_type.pop("LABEL_ID")
        return item_type

    def get_resources(self, label_id):
        return (
            resources_types.objects.filter(CULTURE=self.culture, ID=label_id)
            .values()
            .first()
        )
