from .item_event import ItemEventImporter
from .tags import TagsImporter
from .code_list import CodeListImporter


def get_model(model):
    MODEL = {
        "ITEM_EVENT": ItemEventImporter(),
        "TAGS": TagsImporter(),
        "CODE_LIST": CodeListImporter(),
    }
    return MODEL[model]
