import adapter
from xmlInfo import IxmlInfo
import os
import time
xmlpath = '/django/backend/apps/parsers/xml/'
settingspath = '/django/backend/settings/localapp.py'
modeltypelist = ['LAYER']

for item in modeltypelist:
    xmlinfo = IxmlInfo(item,'Columns','DbInfo.xml','Tables',xmlpath,settingspath)
    adapter.add_settings(xmlinfo)


os.chdir('/django/backend')
os.system('python manage.py makemigrations')
time.sleep(2)
os.system('python manage.py migrate')