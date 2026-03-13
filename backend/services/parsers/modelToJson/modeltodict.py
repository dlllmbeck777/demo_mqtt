from datetime import datetime
import os


def _get_params(data):
    dictParams = dict()
    params = data.split('=',1)[1].split('(')[1].split(')')[0].split(',')[0:-1]
    for child in params:
        tempt = child.split('=')
        dictParams[tempt[0]]=tempt[1]   
    return dictParams
    

def _get_params_header(data,index):
    return data.split('\t')[1].split('=',1)[index].split('(')[0]

def _get_class_contents(variable):
    dictParams = dict()
    #variable = data[8].split('\t')[1]
    dictParams['ContentsName'] = _get_params_header(variable,0)
    dictParams['ContentsType'] = _get_params_header(variable,1)
    dictParams['ContetsParams'] = _get_params(variable)
    return dictParams
    
    

def _get_class_value(value,index):
    return value.split('class ')[1].split('(')[index].split(')')[0]

def _class_property(value):
    propertyDict = dict()
    propertyDict['className'] = _get_class_value(value,0)
    propertyDict['classType'] =  _get_class_value(value,1)
    return propertyDict

def _create_header(user):
    headerDict = dict()
    headerDict['JsoncreatedBy'] = user
    headerDict['JsoncreatedTime'] = str(datetime.now())
    return headerDict

def _create_body(data):
    isParams = False
    libraysList = []
    bodyDict = dict()
    paramsDict = dict()
    for value in data:
        isClass = value.find('class')
        if isClass == -1 and not isParams:
            libraysList.append(value)
        elif isClass == 0:
            bodyDict['ClassProperty'] = _class_property(value)
            isParams = True
        elif isParams:
            paramsDict[_get_params_header(value,0)] = _get_class_contents(value)

    bodyDict['ClassContents'] = paramsDict
    bodyDict['Librays'] = libraysList     
    return bodyDict

def _read_model(modelName,modelPath='/django/backend/apps/'):
    try:
        modelPath = modelPath+modelName+'/models.py'
        file = open(modelPath,'r')
        data = list(file.readlines())
    except Exception as e:
        print(e)
    return data

def parse_model(user,path):
    data = _read_model(path.modelName,path.modelPath)
    mainDict = dict()
    mainDict['HEADER'] = _create_header(user)
    mainDict['BODY'] = _create_body(data)
    return mainDict