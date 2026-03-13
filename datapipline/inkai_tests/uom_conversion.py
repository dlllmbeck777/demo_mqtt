from kafka import KafkaProducer
import json
from kafka import KafkaConsumer, TopicPartition
from pprint import pprint
import os
import pandas as pd
from ast import literal_eval
import json

host = os.environ.get("Kafka_Host_DP")
topic = "uom_conversion"
consumer = KafkaConsumer(
    group_id=topic,
    bootstrap_servers=host,
    enable_auto_commit=False,
    auto_offset_reset="earliest",
)

producer = KafkaProducer(
    bootstrap_servers=host,
    value_serializer=lambda v: json.dumps(v).encode("ascii"),
)

tp = TopicPartition(topic, 0)
consumer.assign([tp])
consumer.poll()
consumer.seek_to_end()


def findTagName(tag_name, incomin_tag_name):
    for tags in incomin_tag_name:
        if tag_name == tags.get("NAME"):
            return tags


def matchUomSymbol(data, formules):
    for tag_uom in formules:
        if data["payload"]["insert"][0]["vqts"][0]["v"] == tag_uom.get(
            "CATALOG_SYMBOL"
        ):
            formule = tag_uom.get("RESULT")
            A = float(tag_uom.get("A"))
            B = float(tag_uom.get("B"))
            C = float(tag_uom.get("C"))
            D = float(tag_uom.get("D"))
            X = data["payload"]["insert"][0]["vqts"][0]["v"]
            result = eval(formule)
            print(result, "--------->")
            return result
        else:
            print("girmedi")


def matchUomAndTagUom(data, tags, formules):
    print(data["payload"]["insert"][0]["vqts"][0]["s"], "------->", tags.get("UOM"))
    if data["payload"]["insert"][0]["vqts"][0]["v"] != tags.get("UOM"):
        return matchUomSymbol(data, formules)


for message in consumer:
    df = message.value
    data = literal_eval(df.decode("utf8"))
    #  incoming_tag_name = request.getTagNameData()
    # # print(data)
    # tags = findTagName(data["payload"]["insert"][0]["fqn"], incoming_tag_name)
    # formules = request.getFormule(tags.get("UOM_QUANTITY_TYPE"))
    # new_value = matchUomAndTagUom(data, tags, formules)
    # if new_value:
    #     data["payload"]["insert"][0]["vqts"][0]["v"] = new_value
    # df2 = dict(data)
    # print(data["payload"]["insert"][0]["vqts"][0]["v"], new_value)
    producer.send("out_of_range", value=data)
    producer.flush()
