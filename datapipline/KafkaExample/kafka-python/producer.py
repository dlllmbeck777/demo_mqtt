from kafka import KafkaProducer
import json
bootstrap_servers = ['broker:29092','20.230.239.209:9092']

producer = KafkaProducer(
 bootstrap_servers=bootstrap_servers,
 value_serializer=lambda v: json.dumps(v).encode('ascii')
)

producer.send(
 'deneme1',
 value="data"
)
producer.flush()

