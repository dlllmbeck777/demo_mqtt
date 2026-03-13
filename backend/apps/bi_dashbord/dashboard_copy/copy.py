from datetime import datetime
from apps.bi_dashbord.models import bi_dashboard
from apps.bi_widgets.models import bi_widget
from apps.bi_widget_property.models import bi_widget_property
from apps.bi_layouts.models import bi_layout
import uuid
from apps.item.models import item
from apps.layer.helpers import to_layerDb


def copyWidget(data, to_item_id):
    widgets, layouts, dashboard = parser_data(data, to_item_id)
    new_widgets = []
    for item in widgets:
        new_widget_id = re_create_widgets(find_widgets(item))
        property = find_widgets_prop(item)

        re_create_widgets_prop(property, new_widget_id)
        re_create_layouts(layouts, new_widget_id, item)
        new_widgets.append(new_widget_id)
    re_create_dashboard(dashboard, new_widgets)


def find_widgets(widgets):
    return bi_widget.objects.filter(WIDGET_ID=widgets).values().first()


def find_widgets_prop(widget):
    return bi_widget_property.objects.filter(WIDGET_ID=widget).values()


def date_time_now():
    return datetime.now().strftime("%Y-%m-%d")


def re_create_layouts(layouts, widget_id, old_widget_id):
    # print(widget_id.WIDGET_ID)
    layouts_objs = bi_layout.objects.filter(i=old_widget_id).values(
        "w", "i", "h", "x", "y", "l_type"
    )

    for layouts_obj in layouts_objs:
        if "id" in layouts_obj.keys():
            layouts_obj.pop("id")

        layouts_obj["ROW_ID"] = uuid.uuid4().hex
        layouts_obj["i"] = widget_id
        bi_layout.objects.create(**layouts_obj)


def re_create_widgets(widget):
    widget["WIDGET_ID"] = uuid.uuid4().hex
    widget["LAST_UPDT_DATE"] = date_time_now()
    widget["START_DATETIME"] = date_time_now()
    widget["ROW_ID"] = uuid.uuid4().hex
    widget["VERSION"] = uuid.uuid4().hex
    return bi_widget.objects.create(**widget)


def re_create_widgets_prop(widget_prop, widget_id):
    for item in widget_prop:
        item.pop("id")
        item["START_DATETIME"] = date_time_now()
        item["LAST_UPDT_DATE"] = date_time_now()
        item["ROW_ID"] = uuid.uuid4().hex
        item["VERSION"] = uuid.uuid4().hex
        if item["PROPERTY_NAME"] == "Transaction Property":
            item["PROPERTY_STRING"] = ""
        if item["PROPERTY_NAME"] == "Assets":
            item["PROPERTY_JSON"] = ""

        widget_prop = bi_widget_property.objects.create(**item)
        widget_prop.PROPERTY_TAG.set([])
        widget_prop.PROPERTY_TAG_CAL.set([])
        widget_prop.WIDGET_ID.set([widget_id])


def re_create_dashboard(
    dashboard,
    new_widgets,
):
    if "id" in dashboard.keys():
        dashboard.pop("id")
    bi_dashboard_obj = bi_dashboard.objects.create(**dashboard)
    bi_dashboard_obj.WIDGETS.set(new_widgets)


def find_name(NAME, TO_ITEM_ID):
    return (
        bi_dashboard.objects.filter(NAME__startswith=NAME, ITEM_ID=TO_ITEM_ID)
        .values_list("NAME", flat=True)
        .order_by("-id")
        .first()
    )


def find_item(item_id):
    return item.objects.filter(ITEM_ID=item_id).first()


def create_name(**kwargs):
    name = find_name(**kwargs)
    if name:
        split_name = str(name).split("-")
        if len(split_name) > 1:
            split_name[1] = int(split_name[1]) + 1
            name = split_name[0] + "-" + str(split_name[1])
        else:
            name = name + "-" + "1"

    return kwargs["NAME"]


def date_formater(date):
    from datetime import datetime

    old_date_string = date
    old_format = "%d-%m-%Y"
    new_format = "%Y-%m-%d"
    new_date_string = datetime.strptime(old_date_string, old_format).strftime(
        new_format
    )

    return new_date_string


def parser_data(data, to_item_id):
    data["NAME"] = create_name(NAME=data["NAME"], TO_ITEM_ID=to_item_id)
    data["ITEM_ID"] = find_item(to_item_id)
    data["START_DATETIME"] = date_time_now()
    data["ROW_ID"] = uuid.uuid4().hex
    return data.pop("WIDGETS"), data.pop("layouts"), data
