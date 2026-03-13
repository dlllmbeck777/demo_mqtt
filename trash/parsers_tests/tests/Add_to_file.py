import os
import xml.etree.ElementTree as ET
import os.path
from itertools import chain


class Add_to_init():
    text = ""
    f = ""

    def __init__(self, path_to_init, list_name):
        self.path_to_init = path_to_init
        self.list_name = list_name

    def Reading_from_init(self):
        with open(self.path_to_init, 'r') as f:  # 'r' is a reading mode
            text = f.read()
        x = text.split("from pgdbmodel.models.")
        y = [z.split("import") for z in x]
        q = [r[0:][0].strip() for r in y]
        l = []
        t = []
        for i in range(len(q)):
            for j in range(len(self.list_name)):
                if q[i] == self.list_name[j]:
                    l.append(self.list_name[j])
        for i in range(len(l)):
            for j in range(len(self.list_name)):
                if l[i] == self.list_name[j]:
                    t.append(j)
        for i in l:
            self.list_name.remove(i)
        return self.list_name

    def Writing_to_init(self):
        list_to_write = self.Reading_from_init()
        list_text = ["\nfrom pgdbmodel.models.{} import {}".format(list_to_write[i].capitalize(), list_to_write[i].capitalize()) for i in range(len(list_to_write))]
        print(str(list_text))
        list_text_ready = (''.join([str(elem) for elem in list_text]))
        with open(self.path_to_init, 'a') as file:
            file.write(str(list_text_ready))


# sss=Add_to_init('C:/Users/ZNurpapa/github/dbmodel/dbparser/models/__init__.py', new_name)
# sss.Writing_to_init()

