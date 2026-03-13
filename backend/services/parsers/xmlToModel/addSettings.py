import adapter
from xmlInfo import IxmlInfo
import os
import time

xmlpath = '/django/backend/services/parsers/config/resources/xml/'
settingspath = '/django/backend/settings/localapp.py'
modeltypelist = ['CODE_LIST','ITEM','ITEM_LINK','TYPE_PROPERTY','TYPE_LINK','ITEM_PROPERTY','TYPE','resources_types','TYPE_UOM','ITEM_VERSION',]


for item in modeltypelist:
    xmlinfo = IxmlInfo(item,'Columns','DbInfo.xml','Tables',xmlpath,settingspath)
    adapter.add_settings(xmlinfo)


os.chdir('/django/backend')
os.system('python manage.py makemigrations')
time.sleep(2)
os.system('python manage.py migrate')