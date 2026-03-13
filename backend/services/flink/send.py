from kafka import KafkaProducer

# Kafka üreticiyi yapılandırma
producer = KafkaProducer(bootstrap_servers="broker:29092")

# Mesajı göndermek istediğiniz topik adı
topic = "test-topic2"

# Gönderilecek mesaj içeriği
message = {{"id": 1, "name": "example", "value": 10.5}}
import time

# Mesajı Kafka topiğine gönderme
while True:
    producer.send(topic, message.encode("utf-8"))
    time.sleep(5)


# Kafka üreticiyi kapatma
producer.close()
