import xml.etree.ElementTree as ET
import os.path
from itertools import chain
from Add_to_file import Add_to_init

tree = ET.parse("C:/Users/ZNurpapa/GitHub/bishop-1/xmlparser/OG_STD.xml")

root = tree.getroot()

ls = []
cs = []
name_list = []
type_dict = {}
name_list = []
domain_dict = {}
type_link_dict = {}
cl = []
for child in root.findall('.//LayerDefType'):
    name = child.get('Type')
    type_class_name = child.get('TypeClass')

    if type_class_name == 'ITEM':

        ls.append(child.attrib)
        domain_dict[name] = ls
        ls = []
        # print(name, child.attrib)
        for sub in child.findall('.//LayerDefTypeProperty'):
            attributes = sub.get('Type')
            cs.append(sub.attrib)
        type_dict[name] = cs
        name = ""
        cs = []
    elif (type_class_name == 'LINK'):
        for sub2 in child.findall('.//LayerDefTypeLink'):
            attributes2 = sub.get('Type')
            cl.append(sub2.attrib)

new_dict = {}
mapping_props = {'Mandatory': 'blank', 'PropertyName': 'db_column', 'PropertyType': 'PropertyType'}
mapping_domains = {'BaseType': 'domain_class'}
mapping_many_to_many = {'ToType': 'to_class', 'Type': 'joining_class'}
mapping_model_keys = {'PropertyName': 'id_type', 'IsKey': 'key'}


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


mapped_domain_dict = Mapping(domain_dict, mapping_domains)

modified_type_dict = Mapping(type_dict, mapping_props)
models_class_keys = Mapping(type_dict, mapping_model_keys)
# print(models_class_keys)


item_link_dict = {}
item_link_list = []

for key in modified_type_dict.keys():
    for i in range(len(cl)):
        if ('FromCardinality' in cl[i]):
            if (key == cl[i]['FromType'] and cl[i]['FromCardinality'] == '*' and cl[i]['FromTypeClass'] == 'ITEM' and
                    cl[i]['ToTypeClass'] == 'ITEM' and cl[i]['ToCardinality'] == '1' and key != cl[i]['ToType'] and
                    cl[i]['ToType'] != 'DATABASE'):
                item_link_list.append(cl[i]['ToType'])

            elif (key == cl[i]['ToType'] and cl[i]['ToCardinality'] == '*' and cl[i]['FromTypeClass'] == 'ITEM' and
                  cl[i]['ToTypeClass'] == 'ITEM' and cl[i]['FromCardinality'] == '1' and key != cl[i]['FromType'] and
                  cl[i]['FromType'] != 'DATABASE'):
                item_link_list.append(cl[i]['FromType'])
    item_link_list = list(dict.fromkeys(item_link_list))
    item_link_dict[key] = item_link_list
    item_link_list = []


# print(item_link_dict)


def Relation_to_text(main_to_text_dict, key_type):
    main_dict_text = {}
    main_dict_from_text = {}
    main_from_list = []
    main_list = []
    for key in main_to_text_dict.keys():
        if (key_type == 'Many'):
            for i in range(len(main_to_text_dict[key])):
                if (main_to_text_dict[key][i]['ToType'].lower() == 'network'):
                    main_text = ""
                else:
                    main_text = "\n    {}_many_id = models.ManyToManyField('pgdbmodel.{}', through='pgdbmodel.{}_{}')".format(
                        main_to_text_dict[key][i]['ToType'].lower(), main_to_text_dict[key][i]['ToType'].capitalize(),
                        main_to_text_dict[key][i]['Type'].capitalize(),item_class_list_many[i]['ToType'].capitalize())
                    main_list.append(main_text)
                    main_text = ""
                    main_from_text1 = "\nfrom {} import {}".format(main_to_text_dict[key][i]['ToType'].capitalize(),
                                                                   main_to_text_dict[key][i]['ToType'].capitalize())
                    main_from_list.append(main_from_text1)
                    main_from_text1 = ""
            main_dict_text[key] = main_list
            main_list = []
            main_dict_from_text[key] = main_from_list
            main_from_list = []
        elif (key_type == 'One'):
            for i in range(len(main_to_text_dict[key])):
                if (main_to_text_dict[key][i].lower() == 'network'):
                    main_text = ""
                else:
                    main_text = "\n    {}_id = models.ForeignKey('pgdbmodel.{}', on_delete=models.CASCADE)".format(
                        main_to_text_dict[key][i].lower(), main_to_text_dict[key][i].capitalize())
                    main_list.append(main_text)
                    main_text = ""
                    main_from_textt = "\nfrom {} import {}".format(main_to_text_dict[key][i].capitalize(),
                                                                   main_to_text_dict[key][i].capitalize())

                    main_from_list.append(main_from_textt)
                    main_from_textt = ""
            main_dict_text[key] = main_list
            main_list = []
            main_dict_from_text[key] = main_from_list
            main_from_list = []
    return main_dict_text, main_dict_from_text


link_from_text = {}
link_dict_text, link_from_text = Relation_to_text(item_link_dict, 'One')

# print(link_dict_text)

item_link_dict_many = {}
item_link_list_many = []
many_link_dict = {}
many_class_dict = {}
item_class_list_many = []
for key in modified_type_dict.keys():
    for i in range(len(cl)):
        if ('FromCardinality' in cl[i] or 'ToCardinality' in cl[i]):
            if (key == cl[i]['FromType'] and cl[i]['FromCardinality'] == '*' and cl[i]['FromTypeClass'] == 'ITEM' and
                    cl[i]['ToTypeClass'] == 'ITEM' and cl[i]['ToCardinality'] == '*' and key != cl[i]['ToType']):
                many_link_dict['ToType'] = cl[i]['ToType']
                many_link_dict['Type'] = cl[i]['Type']
                item_link_list_many.append(many_link_dict)
                many_link_dict = {}
                many_class_dict['ToType'] = cl[i]['ToType']
                many_class_dict['FromType'] = cl[i]['FromType']
                many_class_dict['Type'] = cl[i]['Type']
                item_class_list_many.append(many_class_dict)
                many_class_dict = {}
            elif (key == cl[i]['ToType'] and cl[i]['FromCardinality'] == '*' and cl[i]['FromTypeClass'] == 'ITEM' and
                  cl[i]['ToTypeClass'] == 'ITEM' and cl[i]['ToCardinality'] == '*' and key != cl[i]['FromType']):
                many_link_dict['ToType'] = cl[i]['FromType']
                many_link_dict['Type'] = cl[i]['Type']
                item_link_list_many.append(many_link_dict)
                many_link_dict = {}
                many_class_dict['ToType'] = cl[i]['ToType']
                many_class_dict['FromType'] = cl[i]['FromType']
                many_class_dict['Type'] = cl[i]['Type']
                item_class_list_many.append(many_class_dict)
                many_class_dict = {}
    item_link_dict_many[key] = item_link_list_many

    item_link_list_many = []
many_link_dict_text, many_link_from_dict_to_type = Relation_to_text(item_link_dict_many, 'Many')


# print(item_link_dict_many)
def Many_from_text(main_dict):
    dict_to_type = {}
    from_to_text_dict = {}
    from_text_list = []
    list_type = []
    list_type2 = []
    for key in main_dict.keys():
        for i in range(len(main_dict[key])):
            list_type.append(main_dict[key][i]['Type'])
        list_type2 = list(set(list_type))
        dict_to_type[key] = list_type2
        list_type2 = []
        list_type = []
    for key in dict_to_type.keys():
        for i in range(len(dict_to_type[key])):
            text = "\nfrom {} import {}".format(dict_to_type[key][i].capitalize(), dict_to_type[key][i].capitalize())
            from_text_list.append(text)
        from_to_text_dict[key] = from_text_list
        from_text_list = []

    return (from_to_text_dict)


many_link_from_dict_type = Many_from_text(item_link_dict_many)
print(many_link_from_dict_type)

key_list = []

key_dict = {}
for key in models_class_keys.keys():
    for z in range(len(models_class_keys[key])):
        if ('key' in models_class_keys[key][z].keys()):
            if (models_class_keys[key][z]['key'] == "True"):
                key_list.append(models_class_keys[key][z]['id_type'].lower())
    key_list.append('item_id')
    key_dict[key] = key_list
    key_list = []
print(key_dict)
p = []
m = []
n = {}
K = []
print(p)

to_string_dict = {}
to_string_list = []
for key in modified_type_dict.keys():
    #m.append("\n    item_id = models.UUIDField(db_column='item_id',primary_key=True, default=uuid.uuid4, editable=False) ")
    for key_f in link_dict_text.keys():
        if (key_f == key):
            foreign_k = (''.join([str(elem) for elem in link_dict_text[key_f]]))
    m.append(foreign_k)
    foreign_k = ""
    for key_m in many_link_dict_text.keys():
         if (key_m == key):
             many_k = (''.join([str(elem) for elem in many_link_dict_text[key]]))
    m.append(many_k)
    for q in range(len(modified_type_dict[key])):

        if (modified_type_dict[key][q]['PropertyType'] == 'TEXT' or modified_type_dict[key][q][
            'PropertyType'] == 'CODE'):

            K.append("\n    {}= models.CharField(db_column='{}', max_length=15  ".format(modified_type_dict[key][q]['db_column'].lower(),modified_type_dict[key][q]['db_column'].lower()))
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
            Z1 = ",{}={}".format(k, modified_type_dict[key][q][k].capitalize())
            p.append(Z1)
            Z1 = ""
        #
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
# print(n)
list_to_string2 = ""
final_dict = {}
# print(mapped_domain_dict)
for key in n.keys():
   final_dict[key] = (''.join([str(elem) for elem in n[key]]))
# print(final_dict)
# final_dict['DOMAIN_BASE']=(''.join([str(elem) for elem in n['DOMAIN_BASE']]) )
c = "from django.db import models"
path = 'C:/Users/ZNurpapa/GitHub/bishop/pgdbmodel/models'
cm = "\nclass Meta:"
c_str = ""
for (key, value) in final_dict.items():
    for key1, val1 in mapped_domain_dict.items():
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
            # from_text1 = (''.join([str(elem) for elem in link_from_text[key]]))
            # from_text2 = (''.join([str(elem) for elem in many_link_from_dict_to_type[key]]))
            # from_text3 = (''.join([str(elem) for elem in many_link_from_dict_type[key]]))

           # f.write(c + from_text1 + from_text2 + from_text3 + ct + cl)
            f.write(c  + ct + cl)
            list_to_string2 = (''.join([str(elem) for elem in n[key]]))
            if (list_to_string2 == ""):
                list_to_string2 = "\n     pass"
            else:
                pass
            f.write(list_to_string2)
    for key_str in to_string_dict.keys():
        if (key == key_str and to_string_dict[key_str] != []):
            c_str = "\n    def __str__(self):"
            to_string_text_list = ["\n        if self.{}:\n           return self.{}".format(to_string_dict[key_str][i],to_string_dict[key_str][i]) for i in range(len(to_string_dict[key_str]))]
            to_string_text = (''.join([str(elem) for elem in to_string_text_list]))
            f.write(c_str + to_string_text)
            to_string_text_list = []
    for key2 in key_dict.keys():
        if (key == key2):
            key_val = ("','".join([str(elem) for elem in key_dict[key2]]))
            key_class_name = "\n      db_table = '{}'".format(key2.capitalize())
            #if(key_val==''):
            key_class_prop=""
            # else:
            #     key_class_prop = "\n      unique_together=(('{}'),)".format(key_val)
    f.write(cm + key_class_name + key_class_prop)
    f = ""
    cn = ""
    cl = ""
    list_to_string2 = ""
    completeName = ""

for i in range(len(item_class_list_many)):
    cl_many = "\nclass {}_{}(models.Model):".format(item_class_list_many[i]['Type'].capitalize(), item_class_list_many[i]['ToType'].capitalize())
    cl_many_1 = "\n    {}_many=models.ForeignKey('pgdbmodel.{}', on_delete=models.CASCADE)".format(
        item_class_list_many[i]['ToType'].lower(), item_class_list_many[i]['ToType'].capitalize())
    cl_many_2 = "\n    {}_many=models.ForeignKey('pgdbmodel.{}', on_delete=models.CASCADE)".format(
        item_class_list_many[i]['FromType'].lower(), item_class_list_many[i]['FromType'].capitalize())
    # cl_f1 = "\nfrom {} import {}".format(item_class_list_many[i]['ToType'].capitalize(),
    #                                      item_class_list_many[i]['ToType'].capitalize())
    # cl_f2 = "\nfrom {} import {}".format(item_class_list_many[i]['FromType'].capitalize(),
    #                                      item_class_list_many[i]['FromType'].capitalize())
    cn_many = "{}_{}.py".format(item_class_list_many[i]['Type'].capitalize(),item_class_list_many[i]['ToType'].capitalize())
    completeName2 = os.path.join(path, cn_many)
    f2 = open(completeName2, "w+")
    f2.write(c +  cl_many + cl_many_1 + cl_many_2)
    f2 = ""
    completeName2 = ""
    cl_f1 = ""
    cl_f2 = ""

new_name = [a for a in final_dict.keys()]
print(new_name)

sss = Add_to_init('C:/Users/ZNurpapa/GitHub/bishop/pgdbmodel/models/__init__.py', new_name)
sss.Writing_to_init()
print(item_class_list_many)