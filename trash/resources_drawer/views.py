from django.shortcuts import render
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import ResourceDrawerSaveSerializer, ResourceDrawerDetailsSerializer
from .models import resources_drawer
from services.parsers.addData.type import typeAddData
from django.db.models import Q
from apps.type.models import type as Type
from apps.resources_types.models import resources_types
from utils.utils import import_data
from apps.layer.helpers import to_layerDb
from apps.layer.models import layer


class ResourceDrawerSaveView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        # validate_model_not_null(request.data, "resources_types", request)
        serializer = ResourceDrawerSaveSerializer(data=request.data)
        serializer.is_valid()
        serializer.create(request.data)
        return Response({"Message": "successful"}, status=status.HTTP_200_OK)


class ResourceDrawerScriptView(generics.ListAPIView):
    serializer_class = ResourceDrawerSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        import_data(resources_drawer, "resources_drawer")
        return Response({"Message": "Succsessfull"}, status=status.HTTP_200_OK)


class DrawerView(generics.CreateAPIView):
    serializer_class = ResourceDrawerDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        self.culture = request.data.get("CULTURE")
        self.test = []
        self.layers = []
        self.request = request
        self.roles = []
        self.tempt_data = False
        if request.role:
            self.roles = request.role.keys()
        queryset = self._get_Queryset("drawerMenu", request)

        serializer = ResourceDrawerDetailsSerializer(queryset, many=True).data
        self.new_dict = dict()
        serializer = self._filter_role(serializer, request)
        self._getChild(serializer, request)
        new_dict_copy = self.new_dict.copy()
        # print(new_dict_copy.keys())
        for keys, value in new_dict_copy.items():
            if not value.get("ID") == "drawerMenu":
                del self.new_dict[keys]
        if "Configuration" in self.new_dict.keys():
            self.new_dict["Configuration"]["Items"]["Items"][
                "Items"
            ] = self._get_lg_std_Items()

        self.delete_empty_items(self.new_dict)
        return Response(self.new_dict, status=status.HTTP_200_OK)

    def _get_Queryset(self, id, request):
        layer_level = (
            layer.objects.filter(LAYER_NAME=request.active_layers)
            .values_list("LAYER_LEVEL", flat=True)
            .first()
        )[0]
        return resources_drawer.objects.filter(
            Q(ID=id)
            & Q(CULTURE=self.culture)
            & Q(HIDDEN=False)
            & Q(LAYER_LEVEL__lte=layer_level)
        ).order_by("SORT_ORDER")

    def _filter_role(self, data, request):
        filtered = []
        for value in data:
            parent = value.get("PARENT")
            if parent in self.roles:
                if not request.role[parent]["READ"]:
                    self.test.append(parent)
                    continue
            filtered.append(value)

        return filtered

    def _tempt_add_resources_types(self, tempt, id_list, type_qs):
        # print(qs)
        qs = resources_types.objects.filter(
            Q(ID__in=id_list) & Q(CULTURE=self.culture) & Q(HIDDEN=False)
        ).order_by("SHORT_LABEL")
        serializer = ResourceDrawerDetailsSerializer(qs, many=True)
        for data in serializer.data:
            label = data.get("SHORT_LABEL")
            id = data.get("ID")
            for types in type_qs:
                if types.get("LABEL_ID") == id:
                    data["TYPE"] = types.get("TYPE")

            if data.get("SHORT_LABEL") == None:
                label = data.get("MOBILE_LABEL")
            tempt[label] = data
        return tempt

    def _resources_drawer(self, serializer, tempt):
        for index, value in enumerate(serializer.data):
            id = value.get("PARENT")
            if len(id.split(".")) > 1:
                info = id.split(".")[1]
                if info == "STD":
                    self.tempt_data = True
                    id_list = []
                    type_qs = []
                else:
                    type_qs = Type.objects.filter(LABEL_ID=id).values(
                        "LABEL_ID", "TYPE"
                    )
                    id_list = [item["LABEL_ID"] for item in type_qs]
                    test = id_list[0].split(".")[1]
                    if test in self.roles:
                        if not self.request.role[test]["READ"]:
                            id_list = []
                    self.layers.append(id)

                # print(qs
                tempt = self._tempt_add_resources_types(tempt, id_list, type_qs)
        return tempt

    def _filtered_process(self, item, data, request, tempt):
        filtered_data = self._filter_role(list(data), request)
        filtered_data = {item["SHORT_LABEL"]: {**item} for item in filtered_data}
        item["Items"] = filtered_data
        if tempt:
            item["Items"] = tempt
        return item

    def _process(self, queryset, item, request):
        if queryset:
            serializer = ResourceDrawerDetailsSerializer(queryset, many=True)
            tempt = {}
            tempt = self._resources_drawer(serializer, tempt)

            self._getChild(serializer.data, request)
            parent_label = item.get("SHORT_LABEL")
            self.new_dict[parent_label] = self._filtered_process(
                item, serializer.data, request, tempt
            )
        elif item.get("ID") == "drawerMenu":
            parent_label = item.get("SHORT_LABEL")
            self.new_dict[parent_label] = item

    def _getChild(self, data, request):
        for item in data:
            id = item.get("PARENT")
            queryset = self._get_Queryset(id, request)
            self._process(queryset, item, request)

    def _get_lg_std_Items(self):
        if self.tempt_data:
            type_qs = Type.objects.filter(TYPE_CLASS="ITEM").values("LABEL_ID", "TYPE")
            id_list = [item["LABEL_ID"] for item in type_qs]
            for layer in self.layers:
                id_list.remove(layer)
            tempt = {}
            test = self._tempt_add_resources_types(tempt, id_list, type_qs)
            items_to_remove = (
                []
            )  # Kaldırılacak öğeleri tutmak için boş bir liste oluşturun

            for keys, item in test.items():
                id = item["ID"].split(".")[1]
                if id in self.roles:
                    if not self.request.role[id]["READ"]:
                        items_to_remove.append(keys)

            for key in items_to_remove:
                test.pop(key)

            return test

    def delete_empty_items(self, data):
        for item in list(data.keys()):
            task = data[item].get("Items")
            if task:
                empty_data = [
                    "RoutesStop-Tempt",
                    "Orgnaization-Tempt",
                    "Geography-Tempt",
                ]
                if list(task.keys())[0] in empty_data:
                    print(list(task.keys())[0])
                    del data[item]
                    continue
                self.delete_empty_items(task)
            if task == {}:
                # print(item)
                del data[item]
