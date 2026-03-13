from apps.code_list.models import code_list
from apps.code_list.serializers import CodeListSerializer


class CodeListORM:
    def getCodeList(queryset, culture, hierarchy=False):
        if queryset:
            serializer = CodeListSerializer(queryset, many=True)
            values = []
            _getChildCodeList(serializer.data, culture, None, hierarchy, values)
            return values


def _getChildCodeList(data, culture, parent, hierarchy, response_value):
    for index in range(0, len(data)):
        childItem = []
        if parent is not None:
            for items in parent:
                childItem.append(items)

        childItem.append(data[index].get("ROW_ID"))
        queryset = code_list.objects.filter(
            LIST_TYPE=data[index].get("CODE"), CULTURE=culture
        )
        serializer = CodeListSerializer(queryset, many=True)

        if hierarchy:
            data[index] = _CodeListHierarchy(data[index], childItem)
            response_value.append(data[index])
        else:
            data[index]["CHILD"] = serializer.data
            response_value.append(data[index])
        _getChildCodeList(
            serializer.data, culture, childItem, hierarchy, response_value
        )


def _CodeListHierarchy(data, childItem):
    data["HIERARCHY"] = childItem
    return data


# def _getChildCodeList(data,culture,index,parent):
#     for item in data:
#             childItem = []
#             if parent is not None:
#                 for data in parent:
#                     childItem.append(data)

#             childItem.append(item.get('ROW_ID'))

#             item['HIERARCHY'] = childItem

#             if index == 0:
#                 respons_value.append(item)


#             queryset = code_list.objects.filter(
#                     LIST_TYPE=item.get("CODE"),
#                     CULTURE=item.get("CULTURE")
#                 )
#             serializer = CodeListDetailsSerializer(queryset, many=True)
#             _getChildCodeList(serializer.data,respons_value,1,childItem)
#         return respons_value
