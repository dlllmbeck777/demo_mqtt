import os
import logging
from venv import create
from kafka import KafkaProducer
import json
from datetime import datetime
import uuid
from services.logging.logs_helper import send_logs
import time


class KafkaLogger:
    # def __init__(self):
    #     self.producer = None
    #     self.loggingTemplates =dict()
    #     self.json_message = {
    #         "Datetime":str(datetime.now()),
    #         "Message":"",
    #         "Level":"No Level",
    #         "User":"None",
    #     }
    #     self.key = uuid.uuid4().hex
    #     self.key = self.key.encode('utf-8')

    # def _update_json(self,message=None,request=None,level=None):

    #     self.json_message['Level'] = level
    #     self.json_message['Message'] = message
    #     self.json_message['Path'] = str(request.path)
    #     self.json_message['Data'] = str(request.data)
    #     self.json_message['Method'] = str(request.method)
    #     if str(request.user) == "AnonymousUser":
    #         request.user = request.data.get('email')
    #     self.json_message['User'] = str(request.user)
    #     return self.json_message

    # def _base_logger(self,message,request,level):
    #     self.producer = KafkaProducer(bootstrap_servers=os.environ.get('Kafka_Host'),
    #                                   value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    #                                 linger_ms=10)

    #     self.json_message = self._update_json(message,request,level)

    # def _logging_template(self,message,request,level,logType):
    #     self._base_logger(message=message,request = request,level=level)
    #     self.loggingTemplates ={
    #         "alarms_type":logType,
    #         "CONTENTS":self.json_message
    #     }

    def info(self, message=None, request=None, logType="logging"):
        current_time = time.time()
        timestamp = int(current_time * 1000)
        kwargs = {
            "alarms_type": "Info",
            "error_message": message,
            "source": str(request.path),
            "layer_name": "inkai",
            "category": "logs",
            "topic": "logs",
            "timestamp": timestamp,
            "state": "None",
            "user": str(request.user),
        }
        send_logs(**kwargs)
        # try:
        #     self._logging_template(message:message,request = request,level="INFO",logType = logType)
        # except Exception as e:
        #     self.json_message['ERROR'] = e

        # self.producer.send(os.environ.get('Kafka_Topic'), value = self.loggingTemplates,key =self.key )

    def warning(self, message=None, request=None, warning=None, logType="logging"):
        current_time = time.time()
        timestamp = int(current_time * 1000)
        kwargs = {
            "alarms_type": "Alarms",
            "error_message": "Out Of The Range Data Alarms",
            "source": "out of the range scripts",
            "layer_name": "inkai",
            "topic": "logs",
            "category": "logs",
            "timestamp": timestamp,
            "state": "None",
            "is_read": False,
            "user": str(request.user),
        }
        send_logs(**kwargs)

    def debug(self, message=None, request=None, debug=None, logType="FAULTS"):
        current_time = time.time()
        timestamp = int(current_time * 1000)
        kwargs = {
            "alarms_type": "Info",
            "error_message": message,
            "source": str(request.path),
            "layer_name": "inkai",
            "topic": "logs",
            "category": "logs",
            "timestamp": timestamp,
            "state": "None",
            "user": str(request.user),
        }
        send_logs(**kwargs)

    def error(self, message=None, request=None, error=None, logType="FAULTS"):
        current_time = time.time()
        timestamp = int(current_time * 1000)
        kwargs = {
            "alarms_type": "Alarms",
            "error_message": message,
            "source": str(request.path),
            "layer_name": "inkai",
            "topic": "logs",
            "category": "logs",
            "timestamp": timestamp,
            "state": "None",
            "user": str(request.user),
        }
        send_logs(**kwargs)
