from org.apache.commons.io import IOUtils
from java.nio.charset import StandardCharsets
from org.apache.nifi.processor.io import StreamCallback
import json
import datetime

def findTagName(tag_name, incomin_tag_name):
    for tags in incomin_tag_name:
        if tag_name == tags.get("NAME"):
            return tags


def matchUomSymbol(data, formules):
    for tag_uom in formules:
        if data["payload"]["insert"][0]["vqt"][0]["v"] == tag_uom.get(
            "CATALOG_SYMBOL"
        ):
            formule = tag_uom.get("RESULT")
            A = float(tag_uom.get("A"))
            B = float(tag_uom.get("B"))
            C = float(tag_uom.get("C"))
            D = float(tag_uom.get("D"))
            X = data["payload"]["insert"][0]["vqt"][0]["v"]
            result = eval(formule)
            print(result, "--------->")
            return result
        else:
            print("girmedi")


def matchUomAndTagUom(data, tags, formules):
    print(data["payload"]["insert"][0]["vqt"][0]["s"], "------->", tags.get("UOM"))
    if data["payload"]["insert"][0]["vqt"][0]["v"] != tags.get("UOM"):
        return matchUomSymbol(data, formules)

class PyStreamCallback(StreamCallback):
    def _init_(self):
        pass

    def process(self, inputStream, outputStream):
        text = IOUtils.toString(inputStream, StandardCharsets.UTF_8)
        incoming_data = json.loads(text)
        sent_data = []
        for data in incoming_data:
            #  incoming_tag_name = request.getTagNameData()
            # # print(data)
            # tags = findTagName(data["payload"]["insert"][0]["fqn"], incoming_tag_name)
            # formules = request.getFormule(tags.get("UOM_QUANTITY_TYPE"))
            # new_value = matchUomAndTagUom(data, tags, formules)
            # if new_value:
            #     data["payload"]["insert"][0]["vqt"][0]["v"] = new_value
            # df2 = dict(data)
            # print(data["payload"]["insert"][0]["vqt"][0]["v"], new_value)
            sent_data.append(data)
        sent_data_str = json.dumps(sent_data)
        outputStream.write(bytearray(sent_data_str.encode('utf-8')))

flowFile = session.get()
if flowFile is not None:
    flowFile = session.write(flowFile, PyStreamCallback())

session.transfer(flowFile, REL_SUCCESS)