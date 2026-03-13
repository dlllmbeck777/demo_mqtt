from .base_model import ModelImporter


class CodeListImporter(ModelImporter):
    def get_model(self):
        from apps.code_list.models import code_list

        return code_list
