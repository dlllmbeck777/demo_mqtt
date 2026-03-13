import json
from pyexpat import model
import modeltodict
from pathInfo import pathInfo

modelName = 'type_property'
Path='/django/backend/apps/'
modelpath = pathInfo(modelName,Path)
maindict = modeltodict.parse_model('username',modelpath)
jsonFileName = '/django/backend/apps/'+modelName+'/'+modelName+'.json'
with open(jsonFileName, 'w') as fp:
    json.dump(maindict, fp,indent=2)