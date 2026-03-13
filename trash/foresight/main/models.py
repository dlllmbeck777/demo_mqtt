from bson.json_util import default
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField, JSONField
from django.db.models.deletion import CASCADE, PROTECT
from sqlalchemy import null

# Create your models here.

# class Employee(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)


class Station (models.Model): 
    name = models.CharField(max_length=100, help_text="Код станции")


    def __str__(self):
        return self.name
    
class Pump(models.Model): 
    name = models.CharField(max_length=100)
    station = models.ForeignKey(Station, on_delete=models.PROTECT)
    bearing_counter = models.IntegerField(default=0)
    wheel_counter = models.IntegerField(default=0)
    shaft_counter = models.IntegerField(default=0)
    rotor_counter = models.IntegerField(default=0)
    oil_counter = models.IntegerField(default=0)
    sealant_counter = models.IntegerField(default=0)
    def __str__(self):
        return self.name+" от "+self.station.name

class Sensor(models.Model):
    code = models.CharField(max_length=100, null=True)
    name = models.CharField(max_length=100, null=True)
    place = models.CharField(max_length=100, null=True)
    pump = models.ForeignKey(Pump, on_delete=models.PROTECT, null=True)
    ip = models.CharField(max_length=100, null=True)
    ip_id = models.IntegerField(null=True)
    ip_channel = models.IntegerField(null=True)
    register_modbus = models.IntegerField(null=True)
    unit = models.CharField(max_length=100, null=True)
    max_v = models.FloatField(null=True)
    min_v = models.FloatField(null=True)
    
    def __str__(self):
        return self.code+" от "+self.pump.name

class Value(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, null=True)
    v = models.FloatField(null=True)
    q = models.BooleanField(default=True)
    t = models.BigIntegerField()
    def __str__(self):
        return " "+self.sensor.name




class Maintenance(models.Model):
    TYPE_CHOICES = (
        ('maintenance1', 'TO1'),
        ('maintenance2', 'TO2'),
        ('maintenance3', 'TO3')
    )
    description = models.CharField(max_length=1000, verbose_name="Заключение", help_text="Опишите заключение по ТО")
    createdDate = models.DateTimeField(auto_now_add=True, help_text="Дата и время создания")
    updatedDate = models.DateTimeField(auto_now=True, help_text="Дата и время создания")
    station = models.ForeignKey(Station, on_delete=PROTECT, verbose_name="Станция", help_text="Укажите станцию, на которой было проделано ТО")
    pump = models.ForeignKey(Pump, on_delete=PROTECT, verbose_name="Насос", help_text="Укажите насос, на которой было проделано ТО")
    maintenanceType = models.CharField(max_length=100, choices=TYPE_CHOICES, verbose_name="Вид ТО", help_text="Укажите ТО, которое было проделано")
    maintenanceDateStart = models.DateTimeField(verbose_name="Начало", help_text="Укажите начало работы ТО")
    maintenanceDateEnd = models.DateTimeField(verbose_name="Конец", help_text="Укажите конец работы ТО")
    def __str__(self):
        return str(self.pk) + str(self.station) + str(self.pump) + str(self.maintenanceType)


class MaintenanceWorkTypes(models.Model):
    WORK_CHOICES = (
        ('oil', 'Замена смазки в подшипниках насоса'),
        ('sealant', 'Замена уплотнения')
    )
    OIL_CHOICES = (
        ('oil0', '-'),
        ('oil1', 'Bechem Berutox FE 18 EP'),

    )
    SEALANT_CHOICES = (
        ('sealant1', 'LP-D-S32-D20/60-DE1'),
        ('sealant2', 'Джон Крэйн Мех. уплотн., двойное, открытое'),
        ('sealant3', 'FE08, Burgmann, LP-D-S32-D20<')
    )
    workPerformed = models.CharField(max_length=100, choices=WORK_CHOICES, verbose_name="Выберите выполненную работу", help_text="Укажите работы, которая была выполнена")
    oil = models.CharField(max_length=100, choices=OIL_CHOICES, null=True, verbose_name="Смазка", help_text="Выберите из списка смазку, которая была использована во время ТО")
    sealant = models.CharField(max_length=100, choices=SEALANT_CHOICES, null=True, verbose_name="Уплотнение", help_text="Выберите из списка уплотнение, которое было заменено") 
    datePerformed = models.DateTimeField(verbose_name="Выберите дату и время выполненной работы", help_text="Укажите дату и время работы, которая была выполнена")
    maintenance = models.ForeignKey(Maintenance, on_delete=CASCADE)

    def __str__(self):
        return str(self.pk) + str(self.maintenance.pk) + str(self.workPerformed)

    def oil_verbose(self):
        return dict(MaintenanceWorkTypes.OIL_CHOICES)[self.oil]

    def sealant_verbose(self):
        return dict(MaintenanceWorkTypes.SEALANT_CHOICES)[self.sealant]




class Repair(models.Model):
    TYPE_CHOICES = (
        ('repair1', 'АВР'),
        ('repair2', 'ТР'),
    )
    description = models.CharField(max_length=1000, verbose_name="Заключение", help_text="Опишите заключение проделанного ремонта")
    createdDate = models.DateTimeField(auto_now_add=True, help_text="Дата и время создания")
    updatedDate = models.DateTimeField(auto_now=True, help_text="Дата и время создания")
    station = models.ForeignKey(Station, on_delete=PROTECT, verbose_name="Станция", help_text="Укажите станцию, на которой был проделан ремонт")
    pump = models.ForeignKey(Pump, on_delete=PROTECT, verbose_name="Насос", help_text="Укажите насос, на которой был проделан ремонт")
    repairType = models.CharField(max_length=100, choices=TYPE_CHOICES, verbose_name="Вид ТО", help_text="Укажите вид ремонт,который был проделан")
    repairDateStart = models.DateTimeField(verbose_name="Начало", help_text="Укажите дату и время начала ремонта")
    repairDateEnd = models.DateTimeField(verbose_name="Конец", help_text="Укажите дату и время конца ремонта")
    failure = models.BooleanField(default=False, verbose_name="Ремонт связанный с отказом оборудования")
    def __str__(self):
        return str(self.pk) + str(self.station) + str(self.pump) + str(self.repairType)


class RepairWorkTypes(models.Model):
    WORK_CHOICES = (
        ('bearing', 'Замена подшипника (двухрядного шарикового; роликового)'),
        ('wheel', 'Замена рабочего колеса'),
        ('shaft', 'Замена вала'),
        ('rotor', 'Замена ротора')
    )
    BEARING_ELEMENT_CHOICES = (
        ('element1', 'Подшипниковый узел насоса'),
        ('element2', 'Электродвигатель')
    )
    BEARING_TYPE_CHOICES = (
        ('type1', 'Шариковый'),
        ('type2', 'Роликовый')
    )
    BEARING_MODEL_CHOICES = (
        ('model1', 'NUP 313ECJ'),
        ('model2', 'NUP 317ECJ'),
        ('model3', '7314 BECBM'),
        ('model4', '7318 BECBM'),
        ('model5', '6322С3'),
        ('model6', '6316С3')
    )
    WHEEL_MODEL_CHOICES = (
        ('model1', '400,00 мм'),
        ('model2', '565,00 мм')
    )
    SHAFT_MODEL_CHOICES = (
        ('model1', 'D60'),
        ('model2', 'D75')
    )
    workPerformed = models.CharField(max_length=100, choices=WORK_CHOICES, verbose_name="Выберите выполненную работу", help_text="Укажите ремонт, которая была выполнена")
    bearingElement = models.CharField(max_length=100, choices=BEARING_ELEMENT_CHOICES, null=True, verbose_name="Элемент подшипника", help_text="Укажите элемент подшипник, который был заменен")
    bearingType = models.CharField(max_length=100, choices=BEARING_TYPE_CHOICES, null=True, verbose_name="Тип подшипника", help_text="Укажите тип подшипника, который был заменен")
    bearingModel = models.CharField(max_length=100, choices=BEARING_MODEL_CHOICES, null=True, verbose_name="Модель подшипника", help_text="Укажите модель подшипника, который был заменен")
    wheelModel = models.CharField(max_length=100, choices=WHEEL_MODEL_CHOICES, null=True, verbose_name="Модель колеса", help_text="Укажите работы, которое было заменено")
    shaftModel = models.CharField(max_length=100, choices=SHAFT_MODEL_CHOICES, null=True, verbose_name="Модель вала", help_text="Укажите модель вала, который был заменен")
    datePerformed = models.DateTimeField(verbose_name="Выберите дату и время работы", help_text="Укажите дату и время работы, которая была выполнена")
    mttf = models.IntegerField()
    repair = models.ForeignKey(Repair, on_delete=CASCADE)

    def __str__(self):
        return str(self.pk) + str(self.repair.pk) + str(self.workPerformed)

    def bearingElement_verbose(self):
        return dict(RepairWorkTypes.BEARING_ELEMENT_CHOICES)[self.bearingElement]

    def bearingModel_verbose(self):
        return dict(RepairWorkTypes.BEARING_MODEL_CHOICES)[self.bearingModel]
    
    def bearingType_verbose(self):
        return dict(RepairWorkTypes.BEARING_TYPE_CHOICES)[self.bearingType]

    def wheelModel_verbose(self):
        return dict(RepairWorkTypes.WHEEL_MODEL_CHOICES)[self.wheelModel]

    def shaftModel_verbose(self):
        return dict(RepairWorkTypes.SHAFT_MODEL_CHOICES)[self.shaftModel]


class Prediction(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    pump = models.ForeignKey(Pump, on_delete=models.CASCADE, null=True)
    prediction = models.JSONField(max_length=100000, null=True)
    status = models.JSONField(max_length=10000, null=True)

class  Max_prediction(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    prediction = models.CharField(max_length=100000)



