import pathlib
import xml.etree.ElementTree as ET

from bs4 import BeautifulSoup
from django.http import HttpResponse
from django.shortcuts import render

from apps.code_list.models.code_list import code_list

work_dir = str(pathlib.Path().resolve())
tree = ET.parse(work_dir + "/apps/parsers/xml/DbInfo.xml")
root = tree.getroot()

print(root)

# tables = []
# for table in root.findall('.//DbTable') : # table = (Name="CODE_LIST" TablespaceName="PRIMARY")

#     tables.append ({
#         'table_name': table.get('Name'),
#     })

#     columns = []
#     for column in table.findall('.//DbColumn'): # column = (Name="LIST_TYPE" Precision="100" IsIdentity="False" IsNullable="False" LogicalDbType="Varchar")
#         columns.append ({
#             'column_name': column.get('Name'), # 'column_name' = "LIST_TYPE"
#             'column_type': column_types[column.get('LogicalDbType')], # 'column_type' = column_types[Varchar]
#             'precision': column.get('Precision'),
#             'identity': column.get('IsIdentity'),
#             'null': column.get('IsNullable'),
#             'DefaultValueType': column.get('DefaultValueType'),
#             'PkOrder': column.get('PkOrder')
#             })


column_types = {
    "Varchar": "CharField",
    "NumericData": "DecimalField",
    "Unicode": "CharField",
    "Date": "DateField",
    "Char": "CharField",
}


def index(request):
    # return render(request, 'new/index.html', {'table': tables, 'column': columns})
    # tables = []

    for table in root.findall(
        ".//DbTable"
    ):  # table = (Name="CODE_LIST" TablespaceName="PRIMARY")

        # tables.append ({
        #     'table_name': table.get('Name'),
        # })

        columns = []
        for column in table.findall(
            ".//DbColumn"
        ):  # column = (Name="LIST_TYPE" Precision="100" IsIdentity="False" IsNullable="False" LogicalDbType="Varchar")
            column_attr = {
                # 'max_length': column.get('Precision'),
                "decimal_places": column.get("Scale"),
                # 'primary_key': column.get('IsIdentity'),
                "null": column.get("IsNullable"),
                "default": column.get("DefaultValueType"),
                # 'primary_key': column.get('PkOrder')
            }
            if column_types[column.get("LogicalDbType")] == "DecimalField":
                column_attr["max_digits"] = column.get("Precision")
            else:
                column_attr["max_length"] = column.get("Precision")

            col_name = column.get("Name")
            if col_name in ["LIST_TYPE", "CODE_TEXT", "LEGACY_CODE"]:
                col_name = col_name.replace("_", "")

            # from uuid import uuid4
            if column.get("DefaultValueType") == "Guid":
                column_attr["default"] = "uuid4"

            import datetime

            now = datetime.datetime.now()
            if column.get("DefaultValueType") == "Now":
                column_attr["default"] = now.strftime("%Y-%m-%d")

            columns.append(
                {
                    "column_name": col_name,  # 'column_name' = "LIST_TYPE"
                    "column_type": column_types[
                        column.get("LogicalDbType")
                    ],  # 'column_type' = column_types[Varchar]
                    "column_attr": {
                        k: v for k, v in column_attr.items() if v is not None
                    },
                }
            )

        model_content = render(
            request,
            "new/model.html",
            {"table_name": table.get("Name").lower(), "column": columns},
        )

        soup = BeautifulSoup(model_content.content)
        #  print(soup.get_text())

        model_file = open(
            work_dir + "/apps/code_list/models/" + table.get("Name").lower() + ".py",
            "w",
        )  # f = open("", "")
        model_file.write(soup.get_text())

    #     print(model_file.read())

    return HttpResponse(soup.get_text())
    # return HttpResponse("Hello, world!")


def add_data(request):
    og_std = ET.parse(work_dir + "/apps/parsers/xml/OG_STD.xml")
    og_std_root = og_std.getroot()

    code_lists = []
    for child in og_std_root.findall("CodeLists"):
        for _child in child:
            _keys = _child.keys()
            code_lists.append(
                code_list(**{key.upper(): _child.get(key) for key in _keys})
            )
    code_list.objects.bulk_create(code_lists)
    return HttpResponse("Success")
