# from kafka import KafkaConsumer
# import os
# from ast import literal_eval
# from kafka import KafkaProducer
# import json
# import time

# topic = "test112"


# host = os.environ["Kafka_Host_DP"]
# producer = KafkaProducer(
#     bootstrap_servers=host,
#     value_serializer=lambda v: json.dumps(v).encode("ascii"),
# )
# i = 0
# while True:
#     i += 1
#     data = {"id": f"asdas{i}", "value": "umut"}

#     producer.send(topic, value=data)
#     producer.flush()
#     print("Gönderildi ve uykuda")
#     time.sleep(10)
