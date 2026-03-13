import xmlToDict
import cliHelper


def _class_write(txt,file):
    file.write('\t'+txt+'\n')

def _create_class(appname,file):
    file.write('from django.db import models \n')
    file.write('import uuid \n')
    file.write('from django.utils import timezone \n')
    file.write('class '+ appname +'(models.Model): \n' )

def _validate(value):
    if value == 'NumericData':
        value = 'models.DecimalField'
    elif value == 'Date':
        value = 'models.DateField'
    else:
        value = 'models.CharField'
    return value


def _create_django_app(appname):
    filePath = cliHelper.get_apps_dir() + '/' + appname.lower()
    cliHelper.create_new_django_app(appname.lower())
    return filePath

def _validate_indexes(appname,indexesList,deneme):
    if appname in indexesList:
        deneme ='db_index=True,'
        return deneme
    else:
        return None
    

def _write_models(modelDict,file,xmlInfo):
    indexesList = xmlToDict.get_indexes_model(xmlInfo)
    for i in range(len(modelDict)):
        param = ""
        deneme = ""
        for keys,value in modelDict[i].items():
            if keys == 'Name':
                name = value
            elif keys == 'valueType':
                field = _validate(value)
            else:
                if keys is not None:
                    deneme = _validate_indexes(name,indexesList,deneme)
                    param = param + str(keys) + '=' + str(value) +","
        if deneme is not None:
            txt = name + "=" + field + "(" + param +deneme +  ")"
        else:
            txt = name + "=" + field + "(" + param +  ")"

        _class_write(txt,file)




def _create_meta_class(xmlInfo,file):
    _class_write('class Meta:',file)
    indexesList = xmlToDict.get_indexes_model(xmlInfo)
    file.write('\t\t indexes = [ \n')
    for item in indexesList:
        file.write('\t\t')
        file.write('models.Index(fields=['+'"'+item+'"'+']), \n')
    file.write(']')
        
def regulation_apps(xmlInfo,appsfile):
    appsfile.write('from django.apps import AppConfig\n\n\n')
    appsfile.write('class CodeListConfig(AppConfig):\n')
    txt = "default_auto_field = 'django.db.models.BigAutoField'"
    _class_write(txt,appsfile)
    appname = 'apps.'+xmlInfo.findDbTable.lower()
    txt = "name ="+"'"+appname+"'"
    _class_write(txt,appsfile)

def create_database_model(xmlInfo):
    FilePath = _create_django_app(xmlInfo.findDbTable)
    modelpath = FilePath + '/models.py'
    appspath =FilePath + '/apps.py'
    file = open(modelpath, "w",encoding="utf-8")
    appsFile = open(appspath,"w")
    _create_class(xmlInfo.findDbTable.lower(),file)
    modelDict = xmlToDict.get_xml_to_model_dict(xmlInfo) 
    _write_models(modelDict,file,xmlInfo)
   # _create_meta_class(xmlInfo,file)
    regulation_apps(xmlInfo,appsFile)

# for i in range(len(modelDict)):
    #     name = modelDict[i].get('Name')
    #     model = validate(modelDict[i].get('valueType'))

    #     txt = name + ' = ' + model + '('
    #     class_write(txt,file)
    #     print(name)

def add_settings(xmlInfo):

    file = open(xmlInfo.settingPath,'r')
    data = file.read()
    data = data.replace(']',"")
    file.close()
    file = open(xmlInfo.settingPath,'w')
    txt = 'apps.'+ xmlInfo.findDbTable.lower()
    txt = data + "'" +txt+"'"+',' + ']'
    file.write(txt)
