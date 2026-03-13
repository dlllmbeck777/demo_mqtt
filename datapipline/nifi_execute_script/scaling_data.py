from org.apache.commons.io import IOUtils
from java.nio.charset import StandardCharsets
from org.apache.nifi.processor.io import StreamCallback
import json
import datetime


def scale_data(data):
    scaled_data = float(data["payload"]["insert"][0]["vqt"][0]["v"])
    data["payload"]["insert"][0]["vqt"][0]["v"] = scaled_data * 1
    return data["payload"]["insert"][0]["vqt"][0]["v"]

class PyStreamCallback(StreamCallback):
    def __init__(self):
        pass

    def process(self, inputStream, outputStream):
        text = IOUtils.toString(inputStream, StandardCharsets.UTF_8)
        incoming_data = json.loads(text)
        sent_data = []
        for data in incoming_data:
            scale_data(data)
            sent_data.append(data)
        sent_data_str = json.dumps(sent_data)
        outputStream.write(bytearray(sent_data_str.encode('utf-8')))

flowFile = session.get()
if flowFile is not None:
    flowFile = session.write(flowFile, PyStreamCallback())

session.transfer(flowFile, REL_SUCCESS)