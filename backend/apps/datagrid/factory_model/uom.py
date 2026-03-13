from .base_model import ModelImporter


class UomDataGrid(ModelImporter):
    def get_model(self):
        from apps.uom.models import uom

        return uom
