import uuid

from django.db import models
from django.utils import timezone


class type_uom(models.Model): 
	PROPERTY_CLASS=models.CharField(max_length=100,primary_key=True,null=False,)
	UOM=models.CharField(max_length=50,null=False,)
	LENGTH=models.DecimalField(max_digits=28,decimal_places=12,null=False,)
	DECIMALS=models.DecimalField(max_digits=28,decimal_places=12,null=False,)
	LAYER_NAME=models.CharField(max_length=50,null=False,)
	ROW_ID=models.CharField(max_length=32,default=uuid.uuid4,null=False,db_index=True,)
	LAST_UPDT_USER=models.CharField(max_length=100,null=True,)
	LAST_UPDT_DATE=models.DateField(default=timezone.now,null=True,)
	VERSION=models.CharField(max_length=32,default=uuid.uuid4,null=False,)
	DB_ID=models.CharField(max_length=32,null=True,)
	STATUS=models.CharField(max_length=10,null=True,)
	REV_GRP_ID=models.CharField(max_length=32,null=True,)
