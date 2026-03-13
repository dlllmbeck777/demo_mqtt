from org.apache.commons.io import IOUtils
from java.nio.charset import StandardCharsets
from org.apache.nifi.processor.io import StreamCallback
import json
import datetime

def convert_fqn_format(data):
    fqn_format = {
        'header': data['header'],
        'payload': data['payload'],
        'DiffInHours': data['DiffInHours'],
        'step-status': data['step-status'],
    }
    return fqn_format


def add_veriable(data, data_timestamp):
    id_split = data['id'].split('.')
    data['date'] = datetime.datetime.fromtimestamp(data_timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S.%f')
    data['q'] = 192
    data['layer'] = 'Inkai'
    data['version'] = 1
    data['step-status'] = 'formatting'
    data['message_type'] = 'raw-data'
    data['createdTime'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
    data['asset'] = id_split[2]
    data['tag_name'] = data['id']
    data['createdTime'] = str(datetime.datetime.now())
    del data['id']
    return data


def time_difference(time, present):
    time = datetime.datetime.strptime(time, '%Y-%m-%d %H:%M:%S.%f')
    present = datetime.datetime.strptime(present, '%Y-%m-%d %H:%M:%S.%f')
    difference = present - time
    seconds = difference.total_seconds()
    hours_dif = seconds / (60 * 60)
    return hours_dif


def message_type_specify(message_type, time_diff):
    if time_diff > 96:
        message_type = 'inkai-backfill-data'
    else:
        message_type = 'inkai-live-data'
    return message_type

# Define a subclass of StreamCallback for use in session.write()
class PyStreamCallback(StreamCallback):
    def _init_(self):
        pass

    def process(self, inputStream, outputStream):
        text = IOUtils.toString(inputStream, StandardCharsets.UTF_8)
        incoming_data = json.loads(text)
        sent_data = []
        for data in incoming_data['values']:
            add_veriable(data, incoming_data['timestamp'])
            data['DiffInHours'] = time_difference(data['date'], data['createdTime'])
            data['message_type'] = message_type_specify(data['message_type'], data['DiffInHours'])
            data['date'] = str(data['date'])
            data['createdTime'] = str(data['createdTime'])
            data['header'] = {
                'version': data['version'],
                'createdTime': data['createdTime'],
                'message_Type': data['message_type'],
                'layer': data['layer'],
                'asset': data['asset'],
            }
            data['payload'] = {
                'insert': [
                    {
                        'fqn': data['tag_name'],
                        'vqt': [
                            {
                                'v': data['v'],
                                'q': data['q'],
                                't': data['t'],
                            }
                        ],
                    }
                ]
            }
            data = convert_fqn_format(data)
            sent_data.append(data)
        sent_data_str = json.dumps(incoming_data)
        outputStream.write(bytearray(sent_data_str.encode('utf-8')))

flowFile = session.get()
if flowFile is not None:
    flowFile = session.write(flowFile, PyStreamCallback())

session.transfer(flowFile, REL_SUCCESS)