from org.apache.commons.io import IOUtils
from java.nio.charset import StandardCharsets
from org.apache.nifi.processor.io import StreamCallback
import json
import datetime
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS

token = "JWWy8AiTrGsHBPJdYx6Fh1vnsX5J8mmeaXk4a2yDivvpN0X2lZdn7I7JkCu4tWFaefbEWS3Q-0ch8L0ogbcj2g=="
url = "http://influxdb1:8086"
org = "nordal"
bucket = "live-data"
def write_influx(data,send_time):
    client = influxdb_client.InfluxDBClient(
        url=url,
        token=token,
        org=org
    )

    write_api = client.write_api(write_options=SYNCHRONOUS)

    p = influxdb_client.Point(data["payload"]["insert"][0]["fqn"]).tag("version", data["header"]["version"]).tag("message_type", "live-data").tag("layer", data["header"]["layer"]).field("quality", data["payload"]["insert"][0]["vqt"][0]["q"]).field("tag_value", data["payload"]["insert"][0]["vqt"][0]["v"]).time(send_time)
    write_api.write(bucket=bucket, org=org, record=p)

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