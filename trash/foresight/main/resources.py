from import_export import resources
from .models import RepairWorkTypes, MaintenanceWorkTypes, Repair, Maintenance


class RepairWorkResource(resources.ModelResource):
    class Meta:
        model = RepairWorkTypes
        fields = ['repair__repairDateStart', 'repair__repairDateEnd', 'repair__failure', 'repair__repairType', 'repair__description', 'repair__station__name', 'repair__pump__name', 'datePerformed', 'shaftModel', 'wheelModel','bearingElement', 'bearingType', 'bearingModel', 'mttf']
        export_order = ('repair__station__name', 'repair__pump__name', 'repair__repairType', 'repair__repairDateStart', 'repair__repairDateEnd', 'repair__failure', 'repair__description', 'datePerformed', 'shaftModel', 'wheelModel','bearingElement', 'bearingType', 'bearingModel', 'mttf')

class MaintenanceWorkResource(resources.ModelResource):
    class Meta:
        model = MaintenanceWorkTypes
        fields = ['maintenance__station__name', 'maintenance__pump__name', 'maintenance__maintenanceDateStart', 'maintenance__maintenanceDateEnd', 'maintenance__maintenanceType', 'maintenance__description', 'sealant', 'oil', 'datePerformed',]
        export_order = ['maintenance__station__name', 'maintenance__pump__name', 'maintenance__maintenanceDateStart', 'maintenance__maintenanceDateEnd', 'maintenance__maintenanceType', 'maintenance__description', 'sealant', 'oil', 'datePerformed',]



class RepairResource(resources.ModelResource):
    class Meta:
        model = Repair
        fields = ['repairDateStart', 'repairDateEnd', 'failure', 'repairType', 'description', 'station__name', 'pump__name']
        export_order = ('station__name', 'pump__name', 'repairType', 'repairDateStart', 'repairDateEnd', 'failure', 'description')

class MaintenanceResource(resources.ModelResource):
    class Meta:
        model = Maintenance
        fields = ['station__name', 'pump__name', 'maintenanceDateStart', 'maintenanceDateEnd', 'maintenanceType', 'description',]
        export_order = ['station__name', 'pump__name', 'maintenanceDateStart', 'maintenanceDateEnd', 'maintenanceType', 'description']