import uuid
from django.db import models
from django.conf import settings
import django.db.models.options as options
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey

class UOM_Set(MPTTModel):
    METRIC_SYSTEM = (
        ('IMPERIAL', 'Imperial'),
        ('METRIC', 'Metric')
    )

    CONVERSION_TYPE = (
        ('FACTOR', 'Factor'),
        ('FRACTION', 'Fraction')
    )

    code = models.CharField(db_column='code', max_length=100, blank=False, unique=True, verbose_name='Code')
    code_text = models.CharField(db_column='code_text', max_length=100, blank=False, unique=True, verbose_name='Code Name')
    # property = models.ForeignKey('uom_property', on_delete=models.CASCADE, blank=True, null=True, verbose_name='Property Class')
    parent = TreeForeignKey('self', blank=True, null=True, related_name='children', on_delete=models.CASCADE, verbose_name='Parent')
    # property_class_id = models.ForeignKey('uom_property',  on_delete=models.CASCADE)
    # property = models.ForeignKey(UOM_Property,  on_delete=models.CASCADE)
    # uombase = ChainedForeignKey(
    #     UOM_Base,
    #     chained_field="property",
    #     chained_model_field="property",
    #     show_all=False,
    #     auto_choose=True,
    #     sort=True)
    layer = models.CharField(db_column='dimension_class', default="SYSTEM_UOM", max_length=100, null=True, blank=False, unique=False, verbose_name='Layer')
    catalog_name = models.CharField(db_column='catalog_name', default="POSC", max_length=100, blank=True, unique=False, verbose_name='Catalog Name')
    metric_system = models.CharField(db_column='metric_system', max_length=100, blank=True, unique=False, null=True, verbose_name='Metric System', choices = METRIC_SYSTEM)
    conversion_type = models.CharField(db_column='conversion_type', max_length=100, blank=True, null=True, unique=False, verbose_name='Conversion Type', choices = CONVERSION_TYPE)

    A = models.DecimalField(db_column='A', max_digits=1000, decimal_places=100, null=True, blank=True)
    B = models.DecimalField(db_column='B', max_digits=1000, decimal_places=100, null=True, blank=True)
    C = models.DecimalField(db_column='C', max_digits=1000, decimal_places=100, null=True, blank=True)
    D = models.DecimalField(db_column='D', max_digits=1000, decimal_places=100, null=True, blank=True)

    # last_updt_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, editable=False, null=True, verbose_name='Last Update User')
    last_updt_date = models.DateTimeField(auto_now=True, blank=True, editable=False, null=True, verbose_name='Last Update Date')
    row_id = models.UUIDField(db_column='row_id', primary_key=False, default=uuid.uuid4, editable=False, null=True, verbose_name='Row ID')
    create_source = models.CharField(db_column='create_source', max_length=100, blank=True, editable=False, null=True, verbose_name='Create Source')
    update_source = models.CharField(db_column='update_source', max_length=100, blank=True, editable=False, null=True, verbose_name='Update Source')
    version = models.CharField(db_column='version', max_length=100, blank=True, editable=False, null=True, verbose_name='Version')

    def __str__(self):
        if self.code:
            return self.code
        elif self.code_text:
            return self.code_text
        elif self.metric_system:
            return self.metric_system

    def __str__(self):
        full_path = [self.code_text]
        k = self.parent
        while k is not None:
            full_path.append(k.code_text)
            k = k.parent
        return ' / '.join(full_path[::-1])

class MPTTMeta:
    ordering = ["name"]
    verbose_name = _("uom_set")
    verbose_name_plural = _("uom_sets")
