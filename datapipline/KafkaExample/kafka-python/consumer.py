from kafka import KafkaConsumer
import json
bootstrap_servers = ['broker:29092','20.230.239.209:9092']
consumer = KafkaConsumer(
bootstrap_servers=bootstrap_servers,
value_deserializer = lambda v: json.loads(v.decode('ascii')),
)

consumer.subscribe(topics='deneme1')
for message in consumer:
  print ("%d:%d: v=%s" % (message.partition,
                          message.offset,
                          message.value))

