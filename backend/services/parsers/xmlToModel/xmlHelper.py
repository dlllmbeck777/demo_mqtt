from re import X
import xml.etree.ElementTree as ET

from xmlInfo import IxmlInfo
import os


def get_tree(xmlInfo):
    os.chdir(xmlInfo.xmlpath)
    mytree = ET.parse(xmlInfo.filename)
    return mytree

def get_root(xmlInfo):
    myroot = get_tree(xmlInfo).getroot()
    return myroot

def get_tables(xmlInfo):
    for child_root in get_root(xmlInfo):
        if xmlInfo.tables == child_root.tag:
            return child_root

def get_db_table(xmlInfo):
    for child in get_tables(xmlInfo):
        for subchild in child.attrib.values():
            if xmlInfo.findDbTable == subchild:
                return child

def get_columns(xmlInfo):
    for child in get_db_table(xmlInfo):
        if xmlInfo.tag == child.tag:
            return child 

def get_db_columns_child_list(xmlInfo):
    childList = []
    for child in get_columns(xmlInfo):
        childList.append(child)
    return childList

def get_db_column(xmlInfo):
    dictList = []
    for child in get_columns(xmlInfo):
        dictList.append(child.attrib)
    return dictList



def get_indexes_column(xmlInfo):
    xmlInfo.tag = 'Indexes'
    childList = get_db_columns_child_list(xmlInfo)
    indexesList = []
    for child in childList:
        for subchild in child:
            for inner_subchild in subchild:
                indexesList.append(inner_subchild.text)
    return indexesList
    
    
    # if len(data) == 1:
    #     item = data[0]
    #     value = item[0]
    #     for index in value:
    #         print(index.text)

def set_findDbTable(value):
    findDbTable = value

def set_tag(value):
    tag = value


#print(get_db_table('ITEM'))
# for subchild in child[0]:
#     print(subchild)