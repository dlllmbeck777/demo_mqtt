import xmlHelper
from xmlInfo import IxmlInfo
paramaterDict = {
    'Name':'Name',
    'Precision':'max_length',
    'IsIdentity':'primary_key',
    'IsNullable':'null',
    'Scale':'decimal_places',
    'DefaultValueType':'default',
    'LogicalDbType':'valueType'
}

valueDict = {
    'Guid':'uuid.uuid4',
    'Now' : 'timezone.now',
    'ChangeInterval':'"ChangeInterval"',
    'EndDatetime': 'timezone.now',
    'SourceType':'"SourceType"',
    'Culture' :'"Culture"',
}


def get_xml_to_model_dict(xmlInfo):
    dbColumn = xmlHelper.get_db_column(xmlInfo)

    dictList = []
    i = 0
    for parser in dbColumn:
        newparamDict = {}
        if parser.get('LogicalDbType') == 'NumericData':
            paramaterDict['Precision'] = 'max_digits'
        else:
            paramaterDict['Precision'] = 'max_length'
        
        for keys,value in parser.items():
            if valueDict.get(value) is not None:
                value = valueDict.get(value)
            newparamDict[paramaterDict.get(keys)] = value
        dictList.append(newparamDict)
    return dictList

def get_indexes_model(xmlinfo):
    return xmlHelper.get_indexes_column(xmlinfo)
    
