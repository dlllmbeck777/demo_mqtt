def set_child_by_culture(model, culture):
    # drawerMenu
    ids = ["HOME", "OVERVIEW", "REPORTING", "ADMINISTRATION", "TOOLS", "CONFIGURATION"]

    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    drawerMenu = model.objects.filter(ID="DRAWERMENU", CULTURE=culture).first()
    drawerMenu.CHILD.set(obj)
    # REPORT
    ids = ["VIEWER", "DESIGNER"]

    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    reporting = model.objects.filter(ID="REPORTING", CULTURE=culture).first()
    reporting.CHILD.set(obj)

    ids = ["PROFILE", "USERS", "ROLES", "DIAGNOSTICS"]

    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    ADMIN = model.objects.filter(ID="ADMINISTRATION", CULTURE=culture).first()
    ADMIN.CHILD.set(obj)

    # TOOLS
    ids = [
        "PROJECT",
        "UOM_EDITOR",
        "RESOURCES",
        "CODE_LST",
        "TYPES",
        "LOADER",
    ]
    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    TOOLS = model.objects.filter(ID="TOOLS", CULTURE=culture).first()
    TOOLS.CHILD.set(obj)

    # CONFIG
    ids = ["TAGS", "ROUTE_AND_STOP", "ORGANIZATION", "GEOGRAPHY", "ITEMS"]
    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    CONFIG = model.objects.filter(ID="CONFIGURATION", CULTURE=culture).first()
    CONFIG.CHILD.set(obj)

    # TAGS
    ids = [
        "TAG_MANAGER",
        "TAG_CALCULATED",
    ]
    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    TAGS = model.objects.filter(ID="TAGS", CULTURE=culture).first()
    TAGS.CHILD.set(obj)

    # ROUTE_AND_STOP
    ids = [
        "ROUTE_AND_STOP-TEMP1",
        "ROUTE_AND_STOP-TEMP2",
    ]
    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    ROUTE_AND_STOP = model.objects.filter(ID="ROUTE_AND_STOP", CULTURE=culture).first()
    ROUTE_AND_STOP.CHILD.set(obj)

    # ORGANIZATION
    ids = [
        "ORGANIZATION-TEMP1",
        "ORGANIZATION-TEMP2",
        "ORGANIZATION-TEMP3",
        "ORGANIZATION-TEMP4",
        "ORGANIZATION-TEMP5",
    ]
    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    ORGANIZATION = model.objects.filter(ID="ORGANIZATION", CULTURE=culture).first()
    ORGANIZATION.CHILD.set(obj)

    # GEOGRAPHY
    ids = ["GEOGRAPHY-TEMP1", "GEOGRAPHY-TEMP2", "GEOGRAPHY-TEMP3"]

    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    GEOGRAPHY = model.objects.filter(ID="GEOGRAPHY", CULTURE=culture).first()
    GEOGRAPHY.CHILD.set(obj)

    # ITEMS
    ids = ["ITEMS-TEMP1"]

    obj = model.objects.filter(ID__in=ids, CULTURE=culture)

    ITEMS = model.objects.filter(ID="ITEMS", CULTURE=culture).first()
    ITEMS.CHILD.set(obj)
