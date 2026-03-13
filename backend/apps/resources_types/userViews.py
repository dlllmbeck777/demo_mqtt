# from django.shortcuts import render
# from utils.permissions.employee import IsEmployeeUser
# from rest_framework.authentication import TokenAuthentication
# from rest_framework import generics, permissions
# from rest_framework.response import Response
# import uuid
# from rest_framework import status
# from .serializers import (
#     ResourceListDetailsSerializer,
#     ResourceListSaveSerializer,
#     ResourceListParentSerializer,
# )
# from apps.type.models import type as Type
# from apps.type.serializers import (
#     TypeResourceListManagerSerializer,
#     TypeDetailsSerializer,
# )
# from django.db.models import Q
# from .models import resources_types
# from apps.type_link.models import type_link
# from apps.type_link.serializers import TypeLinkDetails2Serializer
# from services.parsers.addData.type import typeAddData
# from utils.models_utils import validate_model_not_null, validate_find


# class DrawerView(generics.CreateAPIView):
#     serializer_class = ResourceListDetailsSerializer
#     permission_classes = [permissions.AllowAny]
#     def _get_Queryset(self,id):
#         return resources_types.objects.filter(
#                 Q(ID=id) & Q(CULTURE=self.culture) & Q(HIDDEN=False)
#             ).order_by("SORT_ORDER")
    
#     def _filter_role(self,data,request):
#         filtered = []
#         test = {}
#         for value in data:
#             parent = value.get('PARENT')
#             if parent in self.roles:
#                 if not request.role[parent]['READ']:
#                     print(parent," NO Permissions")
#                     continue
#             filtered.append(value)
#         return filtered
    
#     def _resource_list(self,serializer,tempt):
#         for index, value in enumerate(serializer.data):
#             id = (value.get('PARENT'))
#             if len(id.split('.'))>1:
#                 info = id.split('.')[1]
#                 if info == "OG_STD":
#                     type_list = list(Type.objects.filter(LAYER_NAME=info)
#                                             .values_list('LABEL_ID', flat=True))
#                     print(len(type_list))
#                     for layer in self.layers:
#                         type_list.remove(layer)
#                 else:
#                     type_list = [id]
#                     self.layers.append(id)
#                 qs = resources_types.objects.filter(
#                             Q(ID__in=type_list) & Q(CULTURE=self.culture) & Q(HIDDEN=False)
#                             ).order_by("SHORT_LABEL")
#                 serializer = ResourceListDetailsSerializer(qs, many=True)
#                 for data in serializer.data:
#                     label = data.get('SHORT_LABEL')
#                     if data.get('SHORT_LABEL') == None:
#                         label = data.get('MOBILE_LABEL')
#                     # print(data,"-------------> DATA")
#                     tempt[label] = data
#         # print(tempt,"\n\n")
#         return tempt

#     def _filtered_process(self,item,data,request,tempt):
#         filtered_data = self._filter_role(list(data),request)
#         filtered_data = {
#                         item["SHORT_LABEL"]: {
#                             **item
#                         } for item in filtered_data
#                     }
#         item["Items"] = filtered_data
#         if tempt:
#             item["Items"]= tempt
#         return item

#     def _process(self,queryset,item,request):
#         if queryset:
#             serializer = ResourceListDetailsSerializer(queryset, many=True)
#             tempt = {}
#             tempt = self._resource_list(serializer,tempt)
#             self._getChild(serializer.data,request)
#             parent_label = item.get("SHORT_LABEL")
#             self.new_dict[parent_label] =self._filtered_process(
#                                                                     item,
#                                                                     serializer.data,
#                                                                     request,
#                                                                     tempt)
#         elif item.get("ID") == "drawerMenu2":
#             parent_label = item.get("SHORT_LABEL")
#             self.new_dict[parent_label] = item
    
#     def _getChild(self, data,request):
#         for item in data:
#             id = item.get("PARENT")
#             queryset = self._get_Queryset(id)
#             self._process(queryset,item,request)

#     def post(self, request, *args, **kwargs):
#         self.culture = request.data.get('CULTURE')
#         self.layers = []
#         self.roles = []
#         if request.role:
#             self.roles = request.role.keys()
#         queryset = resources_types.objects.filter(
#             Q(ID="drawerMenu2")
#             & Q(CULTURE=self.culture)
#             & Q(HIDDEN=False)
#         ).order_by("SORT_ORDER")
        
#         serializer = ResourceListDetailsSerializer(queryset, many=True).data
#         self.new_dict = dict()
#         serializer = self._filter_role(serializer ,request)
#         self._getChild(serializer,request)
#         new_dict_copy = self.new_dict.copy()
#         for keys,value in new_dict_copy.items():
#             if not value.get('ID') == "drawerMenu2":
#                 del self.new_dict[keys]
#             if value.get('Items') == {}:
#                 del self.new_dict[keys]
                
#         return Response(self.new_dict, status=status.HTTP_200_OK)


# class ResourceListUserDrawerMenutView(generics.CreateAPIView):
#     permission_classes = [permissions.IsAuthenticated, IsEmployeeUser]

#     def _getChild(self, data):
#         for item in data:
#             id = item.get("PARENT")
#             queryset = resources_types.objects.filter(
#                 Q(ID=id) & Q(CULTURE=self.culture) & Q(HIDDEN=False) & Q(REV_GRP_ID=3)
#             ).order_by("SORT_ORDER")
#             if queryset:
#                 serializer = ResourceListDetailsSerializer(queryset, many=True)
#                 self._getChild(serializer.data)
#                 parent_label = item.get("SHORT_LABEL")
#                 item["Items"] = serializer.data
#                 self.new_dict[parent_label] = item
#             elif item.get("ID") == "drawerMenu":
#                 parent_label = item.get("SHORT_LABEL")
#                 self.new_dict[parent_label] = item

#     def post(self, request, *args, **kwargs):
#         self.culture = request.data.get("CULTURE")
#         queryset = resources_types.objects.filter(
#             Q(ID="drawerMenu")
#             & Q(CULTURE=self.culture)
#             & Q(HIDDEN=False)
#             & Q(REV_GRP_ID=3)
#         ).order_by("SORT_ORDER")

#         validate_find(queryset, request)

#         serializer = ResourceListDetailsSerializer(queryset, many=True)
#         self.new_dict = dict()
#         self._getChild(serializer.data)
#         return Response(self.new_dict, status=status.HTTP_200_OK)
