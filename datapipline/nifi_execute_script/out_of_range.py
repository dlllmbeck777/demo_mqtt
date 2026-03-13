from org.apache.commons.io import IOUtils
from java.nio.charset import StandardCharsets
from org.apache.nifi.processor.io import StreamCallback
import json
import datetime
# from request import req

def tag_name_check(data_tag_name, incoming_tag_name):
    min_max_values = []
    for i in range(len(incoming_tag_name)):
        if data_tag_name == incoming_tag_name[i]["NAME"]:
            min_max_values.append(incoming_tag_name[i]["NORMAL_MINIMUM"])
            min_max_values.append(incoming_tag_name[i]["NORMAL_MAXIMUM"])
            return min_max_values


def data_range_check(data, min_max_values):
    # try:
    quality = data["payload"]["insert"][0]["vqt"][0]["q"]
    data_value = float(data["payload"]["insert"][0]["vqt"][0]["v"])
    min_values = 50.0  # float(min_max_values[0])
    max_values = 100.0  # float(min_max_values[1])
    print(max_values)
    print(min_values)
    if data_value < min_values:
        quality = quality - 127
    elif data_value > max_values:
        quality = quality - 126
    data["payload"]["insert"][0]["vqt"][0]["q"] = quality
    # except:
    #     data["payload"]["insert"][0]["fqn"] = "no such tag value found"
    return data

class PyStreamCallback(StreamCallback):
    def _init_(self):
        pass

    def process(self, inputStream, outputStream):
        text = IOUtils.toString(inputStream, StandardCharsets.UTF_8)
        incoming_data = json.loads(text)
        sent_data = []
        for data in incoming_data:
            # r = requests.get(req)
            # incoming_tag_name = r.json()
            # df2 = dict(data)
            # if data["payload"]["insert"][0]["vqt"][0]["q"] == 192:
            #     data_range_check(data, tag_name_check(data["payload"]["insert"][0]["fqn"], incoming_tag_name))
            # key = data["header"]["asset"].encode("utf-8")
            # del data["step-status"]
            sent_data.append(data)
        sent_data_str = json.dumps(sent_data)
        outputStream.write(bytearray(sent_data_str.encode('utf-8')))

flowFile = session.get()
if flowFile is not None:
    flowFile = session.write(flowFile, PyStreamCallback())

session.transfer(flowFile, REL_SUCCESS)