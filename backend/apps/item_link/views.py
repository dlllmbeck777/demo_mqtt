from django.shortcuts import render
from collections import defaultdict
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import item_link
from apps.tags_calculated.models import tags_calculated
from .serializers import (
    ItemLinkSaveSerializer,
    ItemLinkDetailsSerializer,
    ItemLinkDetailsTagSerializer,
)
from utils.models_utils import validate_find
from apps.item_property.models import item_property
from utils.models_utils import validate_model_not_null
from apps.item_property.serializers import ItemPropertyNameSerializer
from django.db.models import Q
from apps.tags.models import tags
from apps.item.models import item
from apps.item.serializers import ItemDetailsSerializer
from apps.tags.serializers import TagsFieldsSerializer
import threading
import json
import os
from django.db.models import F, Value
from django.db.models.functions import Concat
from django.db.models import Subquery, OuterRef
from django.db import transaction
from apps.tags_calculated.models import tags_calculated
from apps.tags_calculated.serializers import TagCalculatedGetAllDetailsSerializers
from apps.uom.models import uom
from apps.uom_base_unit.models import uom_base_unit


# Create your views here.
class ItemLinkSchemaView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def _getitemProps(self, request, selected_id_type, selected_item_type):
        return (
            item_property.objects.filter(
                ITEM_ID__in=item.objects.filter(
                    ITEM_TYPE=request.data.get(selected_item_type)
                )
                .exclude(
                    ITEM_ID__in=item_link.objects.filter(**request.data).values_list(
                        selected_id_type, flat=True
                    )
                )
                .values_list("ITEM_ID", flat=True),
                PROPERTY_TYPE="NAME",
            )
            .annotate(ITEMS_ID=Concat(F("ITEM_ID"), Value("")))
            .values("ITEMS_ID", "PROPERTY_STRING")
            .order_by("PROPERTY_STRING")
        )

    def _getTagsProps(self, request, selected_id_type, selected_item_type, layer_name):
        return (
            tags.objects.filter(LAYER_NAME=layer_name)
            .exclude(
                TAG_ID__in=item_link.objects.filter(**request.data).values_list(
                    selected_id_type, flat=True
                )
            )
            .annotate(
                PROPERTY_STRING=Concat(F("NAME"), Value("")),
                ITEMS_ID=Concat(F("TAG_ID"), Value("")),
            )
            .values("ITEMS_ID", "PROPERTY_STRING")
            .order_by("NAME")
        )

    def post(self, request, *args, **kwargs):
        layer_name = request.data.pop("LAYER_NAME")
        selected_id_type = (
            "TO_ITEM_ID" if request.data.get("FROM_ITEM_ID") else "FROM_ITEM_ID"
        )
        selected_item_type = (
            "TO_ITEM_TYPE" if request.data.get("TO_ITEM_TYPE") else "FROM_ITEM_TYPE"
        )
        item_props = (
            self._getitemProps(request, selected_id_type, selected_item_type)
            if request.data.get(selected_item_type) != "TAG_CACHE"
            else self._getTagsProps(
                request, selected_id_type, selected_item_type, layer_name
            )
        )
        return Response(item_props, status=status.HTTP_201_CREATED)


class ItemLinkSaveView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            try:
                for item in request.data:
                    validate_model_not_null(item, "ITEM_LINK", request=request)
                    serializer = ItemLinkSaveSerializer(data=item)
                    serializer.is_valid()
                    serializer.save(item)
            except Exception as e:
                transaction.set_rollback(True)
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Message": "Succsesful"}, status=status.HTTP_200_OK)


class ItemLinkCardinaltyCheckView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        subquery = item_link.objects.filter(**request.data)
        if subquery:
            return Response(True, status=status.HTTP_200_OK)
        else:
            return Response(False, status=status.HTTP_200_OK)


class ItemLinkDetailsView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def _getName(self, request, linked_item, selected_id_type):
        if request.get("LINK_TYPE") != "TAG_ITEM":
            return (
                item_property.objects.filter(
                    ITEM_ID__in=(linked_item.values(selected_id_type)),
                    PROPERTY_TYPE="NAME",
                )
                .values("PROPERTY_STRING")
                .order_by("ITEM_ID")
            )
        else:
            return (
                tags.objects.filter(
                    TAG_ID__in=(linked_item.values(selected_id_type)),
                )
                .annotate(
                    ITEMS_ID=Concat(F("TAG_ID"), Value("")),
                    PROPERTY_STRING=Concat(F("NAME"), Value("")),
                )
                .order_by("TAG_ID")
                .values("PROPERTY_STRING")
            )

    def post(self, request, *args, **kwargs):
        selected_id_type = (
            "TO_ITEM_ID" if request.data.get("FROM_ITEM_ID") else "FROM_ITEM_ID"
        )
        selected_item_type = (
            "TO_ITEM_TYPE" if request.data.get("FROM_ITEM_ID") else "FROM_ITEM_TYPE"
        )
        linked_item = (
            item_link.objects.filter(**request.data)
            .values(
                "START_DATETIME",
                "END_DATETIME",
                "LINK_ID",
                selected_id_type,
                selected_item_type,
            )
            .order_by(selected_id_type)
        )
        item_prop = self._getName(request.data, linked_item, selected_id_type)
        new_list = []
        for links, prop in zip(linked_item, item_prop):
            new_list.append({**links, **prop})
        new_list = sorted(new_list, key=lambda x: x["PROPERTY_STRING"])
        return Response(new_list, status=status.HTTP_200_OK)


class ItemLinkUpdateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response_list = []
        for item in request.data.values():
            new_keys = [key.upper() for key in item.keys()]
            links_dict = {
                new_keys[i]: value for i, (_, value) in enumerate(item.items())
            }
            # print(links_dict)
            quaryset = item_link.objects.filter(LINK_ID=links_dict.get("LINK_ID"))
            validate_find(quaryset, request)
            quaryset.update(**links_dict)
            response_list.append(links_dict)
        # serializer = ItemLinkDetailsSerializer(quaryset, many=True)
        return Response(response_list, status=status.HTTP_200_OK)

    # def _getChild(self,data,tempt):
    #     for index in range(len(data)):
    #         quaryset_from = item_property.objects.filter(ITEM_ID = data[index].get('FROM_ITEM_ID'),PROPERTY_TYPE = 'NAME').order_by('START_DATETIME')
    #         quaryset_to = item_property.objects.filter(ITEM_ID = data[index].get('TO_ITEM_ID'),PROPERTY_TYPE = 'NAME').order_by('START_DATETIME')
    #         serializer_from = ItemPropertyNameSerializer(quaryset_from,many = True)
    #         serializer_to = ItemPropertyNameSerializer(quaryset_to,many = True)
    #         if quaryset_from:
    #             data[index]['FROM_ITEM_NAME'] = serializer_from.data[0].get("PROPERTY_STRING")
    #         if quaryset_to:
    #             data[index]['TO_ITEM_NAME'] = serializer_to.data[0].get("PROPERTY_STRING")
    #         quaryset  = item_link.objects.filter(TO_ITEM_TYPE = data[index].get('FROM_ITEM_TYPE'))
    #         if quaryset:
    #             serializer = ItemLinkDetailsSerializer(quaryset,many = True)
    #             data[index]['CHILD'] = serializer.data
    #             self._getChild(serializer.data,tempt)


class ItemLinkDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        quaryset = item_link.objects.filter(LINK_ID=request.data.get("LINK_ID"))
        validate_find(quaryset, request)
        quaryset.delete()
        return Response("Deleted SUCCSESFUL", status=status.HTTP_200_OK)


class TagsLinksView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        id = request.data.get("ID")
        self.culture = request.data.get("CULTURE")
        # qs = item_link.objects.filter(
        #     (Q(TO_ITEM_ID=id) | Q(FROM_ITEM_ID=id)) & ~Q(LINK_TYPE="TAG_ITEM")
        # )
        qs = item_link.objects.filter(Q(TO_ITEM_ID__exact=id), ~Q(LINK_TYPE="TAG_ITEM"))

        if not qs:
            qs = item_link.objects.filter(
                Q(FROM_ITEM_ID__exact=id), ~Q(LINK_TYPE="TAG_ITEM")
            )
        tagList = []
        serializer = ItemLinkDetailsSerializer(qs, many=True).data
        self._getChild(serializer, tagList)
        return Response(tagList)

    def _getChild(self, data, tagList):
        for index in data:
            qs = item_link.objects.filter(
                Q(TO_ITEM_ID=index.get("FROM_ITEM_ID")) & ~Q(LINK_TYPE="TAG_ITEM")
            )
            if qs:
                serializer = ItemLinkDetailsTagSerializer(qs, many=True)
                self._getChild(serializer.data, tagList)
                find_tags = tags.objects.filter(
                    ITEM_ID__exact=index.get("TO_ITEM_ID")
                ).values()
                find_cal_tags = tags_calculated.objects.filter(
                    ITEM_ID__exact=index.get("TO_ITEM_ID")
                ).values()
                if find_tags:
                    find_tags = self._get_tags_uom(find_tags)
                    find_tags = self._get_tags_uom(find_cal_tags)

                    tagList.extend(find_tags)
                    tagList.extend(find_cal_tags)

            else:
                find_tags = tags.objects.filter(
                    ITEM_ID__exact=index.get("FROM_ITEM_ID")
                ).values()
                find_cal_tags = tags_calculated.objects.filter(
                    ITEM_ID__exact=index.get("FROM_ITEM_ID")
                ).values()
                if find_tags:
                    self._get_tags_uom(find_tags)
                    self._get_tags_uom(find_cal_tags)
                    tagList.extend(find_tags)
                    tagList.extend(find_cal_tags)

    def _get_tags_uom(self, data):
        for item in data:
            self.get_tags_uom(item)
        return data

    def get_tags_uom(self, data):
        obj = (
            uom.objects.filter(CODE=data["UOM_CODE"], CULTURE=self.culture)
            .values("NAME", "QUANTITY_TYPE", "CATALOG_SYMBOL")
            .first()
        )
        if not obj:
            obj = (
                uom_base_unit.objects.filter(
                    CODE=data["UOM_CODE"], CULTURE=self.culture
                )
                .values("NAME", "QUANTITY_TYPE", "CATALOG_SYMBOL")
                .first()
            )
        if obj:
            obj["UOM_NAME"] = obj.pop("NAME")
            data.update(obj)

    #     quaryset = item_link.objects.filter(
    #         Q(TO_ITEM_ID__exact=request.data.get("ID")), ~Q(LINK_TYPE="TAG_ITEM")
    #     )
    #     if not quaryset:
    #         quaryset = item_link.objects.filter(
    #             Q(FROM_ITEM_ID__exact=request.data.get("ID")), ~Q(LINK_TYPE="TAG_ITEM")
    #         )

    #     tagsList = []
    #     serializer = ItemLinkDetailsSerializer(quaryset, many=True)
    #     self._getChild(serializer.data, tagsList)
    #     return Response(tagsList)

    # def _getChild(self, data, tagsList):
    #     for index in range(len(data)):
    #         quaryset = item_link.objects.filter(
    #             Q(TO_ITEM_ID__exact=data[index].get("FROM_ITEM_ID")),
    #             ~Q(LINK_TYPE="TAG_ITEM"),
    #         )

    #         if quaryset:
    #             serializer = ItemLinkDetailsTagSerializer(quaryset, many=True)
    #             self._getChild(serializer.data, tagsList)
    #             find_tags = tags.objects.filter(
    #                 ITEM_ID__exact=data[index].get("TO_ITEM_ID")
    #             )
    #             if find_tags:
    #                 for item in TagsFieldsSerializer(find_tags, many=True).data:
    #                     tagsList.append(item)

    #         else:
    #             find_tags = tags.objects.filter(ITEM_ID=data[index].get("FROM_ITEM_ID"))
    #             print(find_tags)
    #             if find_tags:
    #                 for item in TagsFieldsSerializer(find_tags, many=True).data:
    #                     tagsList.append(item)

    #    new_dict = {
    #     'TO_ITEM_NAME':data[index].get('FROM_ITEM_NAME'),
    #     "TO_ITEM_ID": data[index].get('FROM_ITEM_ID'),
    #     "TO_ITEM_TYPE": data[index].get('FROM_ITEM_TYPE'),
    #    }
    #    data[index]['CHILD'] = [new_dict]


# class TagsLinksTestView(generics.CreateAPIView):
#     permission_classes = [permissions.AllowAny]


#     def post(self, request, *args, **kwargs):
#         quaryset  = item_link.objects.filter(Q(TO_ITEM_ID = request.data.get('ID')),~Q(LINK_TYPE='TAG_ITEM'))
#         if not quaryset:
#             quaryset  = item_link.objects.filter(Q(FROM_ITEM_ID= request.data.get('ID')),~Q(LINK_TYPE='TAG_ITEM'))
#         thread_list = []
#         tempt ={}
#         tagsList = []
#         serializer = ItemLinkDetailsSerializer(quaryset,many = True)
#         print(serializer.data)
#         return Response(tagsList)


#     def _getChild(self,data,tempt,tagsList):
#             quaryset  = item_link.objects.filter(Q(TO_ITEM_ID = data.get('FROM_ITEM_ID')),~Q(LINK_TYPE='TAG_ITEM'))
#             if quaryset:
#                 serializer = ItemLinkDetailsSerializer(quaryset,many = True)
#                 data['CHILD'] = serializer.data
#                 self._getChild(serializer.data,tempt,tagsList)
#                 find_tags = tags.objects.filter(ITEM_ID = data.get('TO_ITEM_ID'))
#                 if find_tags:
#                     for item in TagsFieldsSerializer(find_tags,many=True).data:
#                         tagsList.append(item)

#             else:
#                 find_tags = tags.objects.filter(ITEM_ID = data.get('FROM_ITEM_ID'))
#                 if find_tags:
#                     for item in TagsFieldsSerializer(find_tags,many=True).data:
#                         tagsList.append(item)


class ItemLinkHierarchyView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_active_status(self, item_id):
        active_status = (
            item_property.objects.filter(ITEM_ID=item_id, PROPERTY_TYPE="ACTIVE")
            .order_by("START_DATETIME")
            .values_list("PROPERTY_STRING", flat=True)
            .first()
        )
        return active_status

    def get_queryset(self):
        pass

    def _get_first_property_map(self, item_ids, property_type):
        property_map = {}
        queryset = (
            item_property.objects.filter(
                ITEM_ID__in=item_ids,
                PROPERTY_TYPE=property_type,
            )
            .order_by("ITEM_ID", "START_DATETIME")
            .values("ITEM_ID", "PROPERTY_STRING")
        )

        for prop in queryset:
            item_id = prop.get("ITEM_ID")
            if item_id and item_id not in property_map:
                property_map[item_id] = prop.get("PROPERTY_STRING")

        return property_map

    def _create_link_node(self, link, name_map, active_map):
        from_item_id = link["FROM_ITEM_ID"]
        to_item_id = link["TO_ITEM_ID"]
        node = {
            "LINK_ID": link["LINK_ID"],
            "LINK_TYPE": link["LINK_TYPE"],
            "FROM_ITEM_ID": from_item_id,
            "FROM_ITEM_TYPE": link["FROM_ITEM_TYPE"],
            "TO_ITEM_ID": to_item_id,
            "TO_ITEM_TYPE": link["TO_ITEM_TYPE"],
            "START_DATETIME": link["START_DATETIME"],
            "END_DATETIME": link["END_DATETIME"],
            "ACTIVE": active_map.get(from_item_id)
            if link["LINK_TYPE"] == "BATTERY_ITEM"
            else None,
        }

        from_item_name = name_map.get(from_item_id)
        to_item_name = name_map.get(to_item_id)
        if from_item_name is not None:
            node["FROM_ITEM_NAME"] = from_item_name
        if to_item_name is not None:
            node["TO_ITEM_NAME"] = to_item_name

        return node

    def _attach_children(self, parent_id, children_by_parent):
        children = [
            dict(child)
            for child in children_by_parent.get(parent_id, [])
            if child.get("FROM_ITEM_NAME") is not None
        ]
        children.sort(key=lambda child: child["FROM_ITEM_NAME"])

        for child in children:
            nested_children = self._attach_children(
                child["FROM_ITEM_ID"], children_by_parent
            )
            if nested_children:
                child["CHILD"] = nested_children

        return children

    def _build_hierarchy(self):
        company_ids = list(
            item.objects.filter(ITEM_TYPE="COMPANY").values_list("ITEM_ID", flat=True)
        )
        if not company_ids:
            return []

        links = list(
            item_link.objects.exclude(LINK_TYPE="TAG_ITEM").values(
                "LINK_ID",
                "LINK_TYPE",
                "FROM_ITEM_ID",
                "FROM_ITEM_TYPE",
                "TO_ITEM_ID",
                "TO_ITEM_TYPE",
                "START_DATETIME",
                "END_DATETIME",
            )
        )

        item_ids = set(company_ids)
        for link in links:
            item_ids.add(link["FROM_ITEM_ID"])
            item_ids.add(link["TO_ITEM_ID"])

        name_map = self._get_first_property_map(item_ids, "NAME")
        active_map = self._get_first_property_map(item_ids, "ACTIVE")
        children_by_parent = defaultdict(list)

        for link in links:
            children_by_parent[link["TO_ITEM_ID"]].append(
                self._create_link_node(link, name_map, active_map)
            )

        hierarchy = []
        for company_id in company_ids:
            company_node = {
                "ITEM_ID": company_id,
                "FROM_ITEM_ID": company_id,
                "LINK_ID": company_id,
                "LINK_TYPE": "COMPANY",
            }
            company_name = name_map.get(company_id)
            if company_name is not None:
                company_node["FROM_ITEM_NAME"] = company_name

            children = self._attach_children(company_id, children_by_parent)
            if children:
                company_node["CHILD"] = children

            hierarchy.append(company_node)

        return hierarchy

    def get(self, request, *args, **kwargs):
        hierarchy = self._build_hierarchy()
        if hierarchy:
            return Response(hierarchy)
        return Response([], status=status.HTTP_200_OK)

    def _getChild(self, data):
        for index in range(len(data)):
            item_id = data[index].get("FROM_ITEM_ID")
            quaryset = item_link.objects.filter(
                Q(TO_ITEM_ID=item_id), ~Q(LINK_TYPE="TAG_ITEM")
            )
            # print(data[index].get("LINK_TYPE"), quaryset)
            if quaryset:
                serializer = ItemLinkDetailsSerializer(quaryset, many=True)
                serializer.data[index]["ACTIVE"] = None
                self._getName(serializer.data)

                sorted_data = sorted(
                    [d for d in serializer.data if d.get("FROM_ITEM_NAME") != None],
                    key=lambda x: x["FROM_ITEM_NAME"],
                )
                data[index]["CHILD"] = sorted_data
                self._getChild(sorted_data)

    def _getName(self, data):
        for index in range(len(data)):
            quaryset_from = item_property.objects.filter(
                ITEM_ID=data[index].get("FROM_ITEM_ID"), PROPERTY_TYPE="NAME"
            ).order_by("START_DATETIME")
            quaryset_to = item_property.objects.filter(
                ITEM_ID=data[index].get("TO_ITEM_ID"), PROPERTY_TYPE="NAME"
            ).order_by("START_DATETIME")
            serializer_from = ItemPropertyNameSerializer(quaryset_from, many=True)
            serializer_to = ItemPropertyNameSerializer(quaryset_to, many=True)
            if quaryset_from:
                data[index]["FROM_ITEM_NAME"] = serializer_from.data[0].get(
                    "PROPERTY_STRING"
                )
                item_id = data[index].get("FROM_ITEM_ID")
                if data[index]["LINK_TYPE"] == "BATTERY_ITEM":
                    data[index]["ACTIVE"] = self.get_active_status(item_id)

            if quaryset_to:
                data[index]["TO_ITEM_NAME"] = serializer_to.data[0].get(
                    "PROPERTY_STRING"
                )

    # def _add_elasticsearch(self, data="", is_first=False):
    #     try:
    #         if is_first == True:
    #             indices = list(self.es.indices.get_alias().keys())
    #             if "hierarchy" in indices:
    #                 self.es.delete_by_query(
    #                     index="hierarchy", body={"query": {"match_all": {}}}
    #                 )
    #         else:
    #             for item in data:
    #                 self.es.index(index="hierarchy", body=item)
    #     except Exception as e:
    #         pass


class TagsLinksSelectedView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        liste = []
        for item in request.data.get("ID"):
            find_tags = tags.objects.filter(ITEM_ID__exact=item)
            if find_tags:
                liste.append(list(TagsFieldsSerializer(find_tags, many=True).data))

        return Response(sum(liste, []))


class TagCalAndTagsLinksSelectedView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        liste = []
        for item in request.data.get("ID"):
            find_tags = tags.objects.filter(ITEM_ID__exact=item)
            find_cal_tags = tags_calculated.objects.filter(ITEM_ID__exact=item)
            if find_tags:
                liste.append(list(TagsFieldsSerializer(find_tags, many=True).data))
            if find_cal_tags:
                liste.append(
                    list(
                        TagCalculatedGetAllDetailsSerializers(
                            find_cal_tags, many=True
                        ).data
                    )
                )

        return Response(sum(liste, []))


class ItemLinkHierarchySearchView(ItemLinkHierarchyView):
    permission_classes = [permissions.AllowAny]

    def _filter_hierarchy(self, items, query):
        query = query.lower()
        filtered = []

        for item_data in items:
            item_name = (item_data.get("FROM_ITEM_NAME") or "").lower()
            children = item_data.get("CHILD") or []
            filtered_children = self._filter_hierarchy(children, query)
            is_match = query in item_name

            if not is_match and not filtered_children:
                continue

            filtered_item = dict(item_data)
            if is_match:
                if children:
                    filtered_item["CHILD"] = children
            elif filtered_children:
                filtered_item["CHILD"] = filtered_children
            else:
                filtered_item.pop("CHILD", None)

            filtered.append(filtered_item)

        return filtered

    def post(self, request, *args, **kwargs):
        item_name = (request.data.get("FROM_ITEM_NAME") or "").strip()
        if not item_name:
            return Response([], status=status.HTTP_200_OK)

        hierarchy = self._build_hierarchy()
        return Response(self._filter_hierarchy(hierarchy, item_name))
