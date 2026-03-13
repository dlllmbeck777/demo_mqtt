import adapter
from xmlInfo import IxmlInfo
import os
import environ

xmlpath = '/django/backend/apps/parsers/xml/'
settingspath = '/django/backend/settings/localapp.py'

modeltypelist = ['LAYER']

for item in modeltypelist:
    xmlinfo = IxmlInfo(item,'Columns','DbInfo.xml','Tables',xmlpath,settingspath)
    adapter.create_database_model(xmlinfo)
    os.chdir('/django/backend/apps/scripts')




