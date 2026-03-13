from django.contrib import admin
from main.models import Station, Pump, Sensor, Maintenance, MaintenanceWorkTypes, Repair, RepairWorkTypes, Prediction, Max_prediction, Value
# Register your models here.

admin.site.register(Station)
admin.site.register(Pump)
admin.site.register(Sensor)
admin.site.register(Maintenance)
admin.site.register(MaintenanceWorkTypes)
admin.site.register(RepairWorkTypes)
admin.site.register(Repair)
admin.site.register(Prediction)
admin.site.register(Max_prediction)
admin.site.register(Value)


