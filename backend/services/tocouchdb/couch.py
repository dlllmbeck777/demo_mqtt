# import couchdb
# import json
# import environ

# # will be made dynamic according to the structure to be created.
# env = environ.Env(DEBUG=(bool, False))
# user = env("COUCHDB_USER")
# password = env("COUCHDB_PASSWORD")
# couchserver = couchdb.Server("http://%s:%s@ligeiaai-couchserver-1:5984/" % (user, password))
# print(user)

# def create_to_couchdb():
#     modelName = ['type','TYPE_PROPERTY']
#     for model in modelName:
#         model = model.lower()
#         jsonpath = '/django/backend/apps/'+model+'/'+model+'.json'
#         db = couchserver.create(model)
#         db = couchserver[model]

#         file = open(jsonpath)
#         json_obj = json.load(file)
#         db.save(json_obj)

# create_to_couchdb()


from kafka import KafkaProducer

# Set up Kafka producer
bootstrap_servers = "192.168.1.88:9092"  # Replace with your Kafka bootstrap servers
topic_name = "inkai-anomaly"  # Replace with your Kafka topic name

producer = KafkaProducer(
    bootstrap_servers=bootstrap_servers,
    value_serializer=lambda v: str(v).encode("utf-8"),  # Convert values to bytes
)

# Send a message to the Kafka topic
message = {"test": "test1"}
producer.send(topic_name, value=message)

# Close the producer
producer.close()
