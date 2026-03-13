import sys
from kafka import KafkaConsumer, TopicPartition
from kafka import KafkaProducer
import json
import datetime
from ast import literal_eval
import os
from kafka import KafkaProducer

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

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

def process_data(data):
    data = literal_eval(data)
    for i in range(len(data)):
        #  incoming_tag_name = request.getTagNameData()
        # # print(data)
        # tags = findTagName(data["payload"]["insert"][0]["fqn"], incoming_tag_name)
        # formules = request.getFormule(tags.get("UOM_QUANTITY_TYPE"))
        # new_value = matchUomAndTagUom(data, tags, formules)
        # if new_value:
        #     data["payload"]["insert"][0]["vqt"][0]["v"] = new_value
        # df2 = dict(data)
        # print(data["payload"]["insert"][0]["vqt"][0]["v"], new_value)
        data[i]["step-status"] = "uom-conversion"
    producer.send('out-of-range2', value=data)
    producer.flush()
    return data

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)