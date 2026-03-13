import adapter
from xmlInfo import IxmlInfo
import os
import environ

settingspath = '/django/backend/settings/localapp.py'
xmlpath = '/django/backend/services/parsers/config/resources/xml/'
modeltypelist = ['TYPE_REF']

for item in modeltypelist:
    xmlinfo = IxmlInfo(item,'Columns','DbInfo.xml','Tables',xmlpath,settingspath)
    adapter.create_database_model(xmlinfo)
    #os.chdir('/django/backend/apps/scripts')




