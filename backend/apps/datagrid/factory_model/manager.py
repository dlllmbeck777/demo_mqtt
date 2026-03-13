from .resources_list import ResourcesList
from .uom import UomDataGrid
from .code_list import CodeListImporter
from .users import UsersDataGrid


def get_model(model):
    MODEL = {
        "RESOURCE_LIST": ResourcesList(),
        "UOM": UomDataGrid(),
        "CODE_LIST": CodeListImporter(),
        "USERS": UsersDataGrid(),
    }
    return MODEL[model]
