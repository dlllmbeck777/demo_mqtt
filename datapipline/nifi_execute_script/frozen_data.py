from org.apache.commons.io import IOUtils
from java.nio.charset import StandardCharsets
from org.apache.nifi.processor.io import StreamCallback
import json
import datetime

tag_name_dict = {}


def add_data(tag_name, tag_value):
    if tag_name not in tag_name_dict:
        tag_name_dict[tag_name] = []
    tag_name_dict[tag_name].append(tag_value)


def check_repeated_values(tag_name):
    values = tag_name_dict[tag_name][-3:]
    torfalse = all(x == values[0] for x in values)
    if len(values) >= 3 and torfalse:
        # print(
        #     f"{tag_name}: {values[0]} The same value data came for the 3rd time in a row!"
        # )
        if data["payload"]["insert"][0]["vqt"][0]["q"] == 192:
            data["payload"]["insert"][0]["vqt"][0]["q"] -= 125

    if len(values) >= 3 and values[-1] != values[-2]:
        del tag_name_dict[tag_name[:]]

# Define a subclass of StreamCallback for use in session.write()
class PyStreamCallback(StreamCallback):
    def _init_(self):
        pass

    def process(self, inputStream, outputStream):
        text = IOUtils.toString(inputStream, StandardCharsets.UTF_8)
        incoming_data = json.loads(text)
        sent_data = []
        for data in incoming_data['values']:
            add_data(
                data["payload"]["insert"][0]["fqn"],
                data["payload"]["insert"][0]["vqt"][0]["v"],
            )
            check_repeated_values(data["payload"]["insert"][0]["fqn"])
            data["step-status"] = "frozen-data"
            sent_data.append(data)
        sent_data_str = json.dumps(sent_data)
        outputStream.write(bytearray(sent_data_str.encode('utf-8')))

flowFile = session.get()
if flowFile is not None:
    flowFile = session.write(flowFile, PyStreamCallback())

session.transfer(flowFile, REL_SUCCESS)