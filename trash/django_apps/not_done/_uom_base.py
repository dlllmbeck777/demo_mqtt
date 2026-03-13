from django.db import models
import uuid
from django.conf import settings

class UOM_Base(models.Model):
    METRIC_SYSTEM = (
        ('IMPERIAL', 'Imperial'),
        ('METRIC', 'Metric')
    )

    CONVERSION_TYPE = (
        ('FACTOR', 'Factor'),
        ('FRACTION', 'Fraction')
    )

    property = models.ForeignKey('uom_property', on_delete=models.CASCADE, blank=True, null=True, verbose_name='Property Class')
    code_id = models.CharField(db_column='code_id', max_length=100, blank=False, unique=True, verbose_name='Code ID')
    code_name = models.CharField(db_column='code_name', max_length=100, null=True, blank=False, unique=False, verbose_name='Code Name')    
    dimension = models.CharField(db_column='base_uom_id', max_length=100, blank=False, verbose_name='Dimension Class')
    layer = models.CharField(db_column='dimension_class', default="SYSTEM_UOM", max_length=100, null=True, blank=False, unique=False, verbose_name='Layer')
    catalog_name = models.CharField(db_column='catalog_name', default="POSC", max_length=100, blank=True, unique=False, verbose_name='Catalog Name')
    metric_system = models.CharField(db_column='metric_system', max_length=100, blank=True, unique=False, null=True, verbose_name='Metric System', choices = METRIC_SYSTEM)
    conversion_type = models.CharField(db_column='conversion_type', max_length=100, blank=True, null=True, unique=False, verbose_name='Conversion Type', choices = CONVERSION_TYPE)

    A = models.DecimalField(db_column='A', max_digits=1000, decimal_places=100, null=True, blank=True)
    B = models.DecimalField(db_column='B', max_digits=1000, decimal_places=100, null=True, blank=True)
    C = models.DecimalField(db_column='C', max_digits=1000, decimal_places=100, null=True, blank=True)
    D = models.DecimalField(db_column='D', max_digits=1000, decimal_places=100, null=True, blank=True)

    last_updt_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, editable=False, null=True, verbose_name='Last Update User')
    last_updt_date = models.DateTimeField(auto_now=True, blank=True, editable=False, null=True, verbose_name='Last Update Date')
    row_id = models.UUIDField(db_column='row_id', primary_key=False, default=uuid.uuid4, editable=False, null=True, verbose_name='Row ID')
    create_source = models.CharField(db_column='create_source', max_length=100, blank=True, editable=False, null=True, verbose_name='Create Source')
    update_source = models.CharField(db_column='update_source', max_length=100, blank=True, editable=False, null=True, verbose_name='Update Source')
    version = models.CharField(db_column='version', max_length=100, blank=True, editable=False, null=True, verbose_name='Version')

    def __str__(self):
        if self.code_id:
            return self.code_id
        elif self.code_name:
            return self.code_name
        elif self.property_class:
            return self.property_class
        elif self.base_uom_id:
            return self.base_uom_id

    # def __str__(self):
    #     full_path = [self.code_name]
    #     k = self.parent
    #     while k is not None:
    #         full_path.append(k.code_name)
    #         k = k.parent
    #     return ' / '.join(full_path[::-1])


class Meta:
    db_table = 'UOM_Base'
    order_insertion_by = ["code_id"]
    verbose_name = "Base_UOM"
    verbose_name_plural = "Base_UOMs"
