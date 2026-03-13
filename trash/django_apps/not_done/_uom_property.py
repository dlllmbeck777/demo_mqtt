from django.db import models
from django.conf import settings
import uuid


class UOM_Property(models.Model):
    code_id = models.CharField(db_column='code_text', max_length=100, blank=False, unique=True, null=True, verbose_name='Code Name')
    code_name = models.CharField(db_column='code', max_length=100, blank=False, unique=True, verbose_name='Code')
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
        elif self.last_updt_user:
            return self.last_updt_user
        elif self.last_updt_date:
            return self.last_updt_date
        else: 
            return f"{self.code_name}, {self.code_id}"

class Meta:
    db_table = 'uom_property'
    # unique_together=(('item_id'),)