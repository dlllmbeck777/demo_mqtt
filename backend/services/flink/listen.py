from kafka import KafkaConsumer

# Kafka sunucusu ve konfigürasyonu
kafka_servers = "broker:29092"
topic = "test-topic2"

# Kafka tüketiciyi oluştur
consumer = KafkaConsumer(topic, bootstrap_servers=kafka_servers)

# Mesajları tüket
for message in consumer:
    print(f"Received message: {message.value.decode('utf-8')}")

# Tüketiciyi kapat
consumer.close()
