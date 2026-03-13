from django.db import models
import uuid
from mptt.models import MPTTModel, TreeForeignKey

class Type_pump(MPTTModel):
    # item_id = models.UUIDField(db_column='item_id',primary_key=True, default=uuid.uuid4, editable=False)
    last_updt_user = models.CharField(db_column='last_updt_user', max_length=15, blank=True)
    last_updt_date = models.DateTimeField(auto_now=True, blank=True, null=True, unique=True)   
    row_id = models.UUIDField(db_column='row_id', primary_key = False, default = uuid.uuid4, editable = False)
    update_source = models.CharField(db_column='update_source', max_length=15, blank=True)
    version = models.CharField(db_column='version', max_length=15, blank=True)

    code_text = models.CharField(db_column='code_text', max_length=15, blank=False, unique=True)
    code = models.CharField(db_column='code', max_length=15, blank=False, unique=True)    
    parent = TreeForeignKey('self',blank=True, null=True ,related_name='children', on_delete=models.CASCADE)

    def __str__(self):
        # if self.code:
        #     return str(self.code)
        if self.code_text:
            return str(self.code_text)
    
    def __str__(self):                                                                  
        full_path = [self.code_text]
        k = self.parent
        while k is not None:
            full_path.append(k.code_text)
            k = k.parent
        return ' / '.join(full_path[::-1])
 
class MPTTMeta:
    db_table = 'type_pump'
    order_insertion_by = ["code_text"]
    verbose_name = "pump type"
    verbose_name_plural = "pump types"