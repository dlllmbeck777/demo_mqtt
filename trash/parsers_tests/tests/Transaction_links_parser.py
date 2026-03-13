import xml.etree.ElementTree as ET
import os.path
from Add_to_file import Add_to_init

tree = ET.parse("C:/Users/ZNurpapa/GitHub/dbmodel/dbparser/OG_STD.xml")
root = tree.getroot()
ls = []
cs = []
rs = []
name_list = []
type_dict = {}
type_ref_dict = {}
domain_dict = {}
name_list = []

for child in root.findall('.//LayerDefType'):
    name = child.get('Type')
    type_class_name = child.get('TypeClass')

    if type_class_name == 'TRANSACTION':

        ls.append(child.attrib)
        name_list.append(name)
        domain_dict[name] = ls
        ls = []
        for sub in child.findall('.//LayerDefTypeProperty'):
            attributes = sub.get('Type')

            cs.append(sub.attrib)
        type_dict[name] = cs

        cs = []
        for sub2 in child.findall('.//LayerDefTypeRef'):
            attributes2 = sub2.get('Type')
            rs.append(sub2.attrib)

        type_ref_dict[name] = rs
        rs = []
    name = ""
# print(type_ref_dict)
# print(name_list)
# print(domain_dict)
mapping_ref_props = {'PropertyName': 'id_type', 'ValidType': 'fk'}
mapping_model_keys = {'PropertyName': 'id_type', 'IsKey': 'key'}
mapping_domains = {'BaseType': 'domain_class'}


def Mapping(source_dict, mappping_dict):
    list_of_new_dict = []

    modified_type_dict3 = {}
    new_dict = {}
    for key in source_dict.keys():
        for z in range(len(source_dict[key])):
            for key1 in source_dict[key][z].keys():
                for key2, val2 in mappping_dict.items():
                    if key2 == key1:
                        new_dict[val2] = source_dict[key][z][key1]
                        # print(new_dict)
            if ('blank' in new_dict):
                if (new_dict['blank'] == 'True'):
                    new_dict['blank'] = 'False'
                elif (new_dict['blank'] == 'False'):
                    new_dict['blank'] = 'True'
            else:
                pass
            list_of_new_dict.append(new_dict)

            new_dict = {}
        modified_type_dict3[key] = list_of_new_dict
        list_of_new_dict = []
    return modified_type_dict3


# mapping_props = {'Mandatory': 'blank', 'Length': 'max_digits', 'Decimals': 'decimal_places',
#                  'PropertyName': 'db_column', 'PropertyType': 'PropertyType'}
mapping_props = {'Mandatory': 'blank', 'PropertyName': 'db_column', 'PropertyType': 'PropertyType'}

new_type_ref_dict = Mapping(type_ref_dict, mapping_ref_props)
# print(new_type_ref_dict)
capitalized_dict = {}
capitalized_list = []
capitalized_ref_dict = {}
for key1 in new_type_ref_dict.keys():
    for i in range(len(new_type_ref_dict[key1])):
        for key, val in new_type_ref_dict[key1][i].items():
            capitalized_dict[key] = new_type_ref_dict[key1][i][key].lower()
            if (key == 'fk'):
                capitalized_dict[key] = new_type_ref_dict[key1][i][key].capitalize()

        capitalized_list.append(capitalized_dict)
        capitalized_dict = {}
    capitalized_ref_dict[key1] = capitalized_list
    capitalized_list = []

ref_dict_text = {}
ref_dict_from_text = {}
ref_meta_dict = {}
reference_list = []
reference_from_list = []
reference_meta_list = []
for key in capitalized_ref_dict.keys():
    for i in range(len(capitalized_ref_dict[key])):
        if (capitalized_ref_dict[key][i]['fk'].lower() == 'network' or capitalized_ref_dict[key][i]['fk'].lower() == 'route' or capitalized_ref_dict[key][i]['fk'].lower() == 'subsystem'):
            ref_text = ""
            ref_from_text = ""
        else:

            ref_text = "\n    {}_id = models.ForeignKey({}, on_delete=models.CASCADE)".format(
                capitalized_ref_dict[key][i]['fk'].lower(), capitalized_ref_dict[key][i]['fk'])
            ref_from_text = "\nfrom pgdbmodel.models.{} import {}".format(capitalized_ref_dict[key][i]['fk'],
                                                         capitalized_ref_dict[key][i]['fk'])

            reference_list.append(ref_text)

            reference_meta_list.append(capitalized_ref_dict[key][i]['fk'].lower())
            reference_from_list.append(ref_from_text)
    ref_dict_text[key] = reference_list
    ref_dict_from_text[key] = reference_from_list
    # meta_text=(",".join([str(elem) for elem in reference_meta_list]))
    ref_meta_dict[key] = reference_meta_list
    reference_meta_list = []
    reference_list = []
    reference_from_list = []
# print(ref_meta_dict['TICKET'])
modified_type_dict = Mapping(type_dict, mapping_props)

models_class_keys = Mapping(type_dict, mapping_model_keys)

key_list = []
key_dict = {}
for key, key_meta in zip(models_class_keys.keys(), ref_meta_dict.keys()):
    for z in range(len(models_class_keys[key])):
        if ('key' in models_class_keys[key][z].keys()):
            if (models_class_keys[key][z]['key'] == "True"):
                if (key_meta == key and models_class_keys[key][z]['id_type'] == 'ITEM_ID'):
                    # print(models_class_keys[key][z]['id_type'])
                    for x in ref_meta_dict[key_meta]:
                        key_list.append(x + "_id")
                else:
                    key_list.append(models_class_keys[key][z]['id_type'].lower())

    key_dict[key] = key_list

    key_list = []
# print(key_dict2)
# print(models_class_keys)


p = []
m = []
n = {}
K = []

# print(modified_type_dict)
to_string_dict = {}
to_string_list = []
for key in modified_type_dict.keys():
    foreign_k = (''.join([str(elem) for elem in ref_dict_text[key]]))
    m.append(foreign_k)
    foreign_k = ""
    for q in range(len(modified_type_dict[key])):
        if (modified_type_dict[key][q]['PropertyType'] == 'ITEM'):
            m.append("")
        elif (modified_type_dict[key][q]['PropertyType'] == 'GUID'):
            m.append(
                "\n    {}= models.UUIDField( db_column='{}', primary_key = False, default = uuid.uuid4, editable = False)".format(
                    modified_type_dict[key][q]['db_column'].lower(), modified_type_dict[key][q]['db_column']))
        else:
            if (modified_type_dict[key][q]['PropertyType'] == 'TEXT' or modified_type_dict[key][q][
                'PropertyType'] == 'CODE'):
                K.append("\n    {}= models.CharField(db_column='{}', max_length=15".format(modified_type_dict[key][q]['db_column'].lower(),modified_type_dict[key][q]['db_column'].lower()))
                to_string_list.append(modified_type_dict[key][q]['db_column'].lower())
            elif (modified_type_dict[key][q]['PropertyType'] == 'NUMBER' or modified_type_dict[key][q][
                'PropertyType'] == 'DURATION' or modified_type_dict[key][q]['PropertyType'] == 'PERCENT' or
                  modified_type_dict[key][q]['PropertyType'] == 'INT'):
                K.append("\n    {}= models.DecimalField(db_column='{}', max_digits=12, decimal_places=8".format(modified_type_dict[key][q]['db_column'].lower(),modified_type_dict[key][q]['db_column'].lower()))
            elif (modified_type_dict[key][q]['PropertyType'] == 'DATETIME'):
                K.append("\n    {}= models.DateTimeField(db_column='{}',auto_now=False, auto_now_add=False".format(modified_type_dict[key][q]['db_column'].lower(),modified_type_dict[key][q]['db_column'].lower()))
            elif (modified_type_dict[key][q]['PropertyType'] == 'BOOL'):
                K.append("\n    {}= models.BooleanField(db_column='{}'".format(modified_type_dict[key][q]['db_column'].lower(),modified_type_dict[key][q]['db_column'].lower()))

            del modified_type_dict[key][q]["PropertyType"]
            del modified_type_dict[key][q]["db_column"]
            for k, v in modified_type_dict[key][q].items():

                Z1 = ",{}={}".format(k, modified_type_dict[key][q][k])
                p.append(Z1)
                Z1 = ""

            # t = p[0].replace(",", "")
            # p[0] = t
            list_to_string = ''.join([str(elem) for elem in p])
            list_to_string_k = ''.join([str(elem) for elem in K])

            m.append(list_to_string_k + list_to_string + ")")
            p = []
            K = []
            list_to_string = ""
            list_to_string_k = ""
    to_string_dict[key] = to_string_list
    to_string_list = []

    n[key] = m
    m = []
# print(n['NET_STAT'])
mapped_domain_dict = Mapping(domain_dict, mapping_domains)
# print(mapped_domain_dict)
# print(to_string_dict)
list_to_string2 = ""
final_dict = {}
for key in n.keys():
    final_dict[key] = (''.join([str(elem) for elem in n[key]]))
# print(final_dict)
#final_dict['TOTALS']=(''.join([str(elem) for elem in n['TOTALS']]) )
c = "import uuid \nfrom django.db import models"
path = 'C:/Users/ZNurpapa/GitHub/bishop/pgdbmodel/models'
cm = "\nclass Meta:"

for key, value in final_dict.items():
    for key1 in mapped_domain_dict.keys():
        if (key1 == key):
            if ('domain_class' in mapped_domain_dict[key1][0]):
                if (mapped_domain_dict[key1][0]['domain_class'].capitalize() == "Network"):
                    cl = "\nclass {}(models.Model):".format(key.capitalize())
                    ct = ""
                else:
                    cl = "\nclass {}({}):".format(key.capitalize(),
                                                  mapped_domain_dict[key1][0]['domain_class'].capitalize())
                    ct = "\nfrom pgdbmodel.models.{} import {}".format(mapped_domain_dict[key1][0]['domain_class'].capitalize(),
                                                      mapped_domain_dict[key1][0]['domain_class'].capitalize())

            else:
                cl = "\nclass {}(models.Model):".format(key.capitalize())
                ct = ""
            cn = "{}.py".format(key.capitalize())

            completeName = os.path.join(path, cn)
            f = open(completeName, "w+")

            list_to_string_from = (''.join([str(elem) for elem in ref_dict_from_text[key]]))
            f.write(c + list_to_string_from + ct + cl)
            list_to_string2 = (''.join([str(elem) for elem in n[key]]))
            if (list_to_string2 == ""):
                list_to_string2 = "\n     pass"
            else:
                pass
            f.write(list_to_string2)

    for key_str in to_string_dict.keys():
        if (key == key_str and to_string_dict[key_str] != []):
            c_str = "\n    def __str__(self):"
            to_string_text_list = ["\n        if self.{}:\n           return self.{}".format(to_string_dict[key_str][i], to_string_dict[key_str][i]) for i in range(len(to_string_dict[key_str]))]
            to_string_text = (''.join([str(elem) for elem in to_string_text_list]))
            f.write(c_str + to_string_text)
            to_string_text_list = []
    completeName = ""
    for key2 in key_dict.keys():
        if (key == key2):
            key_val = ("','".join([str(elem) for elem in key_dict[key2]]))
            key_class_name = "\n      db_table = '{}'".format(key2.capitalize())
            if(key_val==''):
                key_class_prop=""
            else:
                key_class_prop = "\n      unique_together=(('{}'),)".format(key_val)
    f.write(cm + key_class_name + key_class_prop)
    f.close()
new_name = [a for a in final_dict.keys()]
# print(new_name)
# print(new_name)
sss = Add_to_init('C:/Users/ZNurpapa/GitHub/bishop/pgdbmodel/models/__init__.py', new_name)
sss.Writing_to_init()
print(to_string_dict)
