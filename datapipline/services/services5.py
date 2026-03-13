# PRINT THE LATEST VERSION OF DATA IN KAFKA TOPIC
from services3 import *
from services4 import *

# DF3 --> BACKFILL DATA --> WRITE CASSANDRA 'backfill_data'
query = df3.selectExpr("CAST(id AS STRING) AS key","to_json(struct(*)) AS value") \
    .writeStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("topic", "backfill_data") \
    .option("checkpointLocation", "C:\\Users\\alper\\OneDrive\\Masaüstü\\Nordal Proje\\atılacaklar\\spark-read-stream-reel\\checkpoint")\
    .start()
# DF5 --> REAL TIME DATA --> WRITE REDIS 'live_data'
query2 = df5.selectExpr("CAST(id AS STRING) AS key","to_json(struct(*)) AS value") \
    .writeStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("topic", "live_data") \
    .option("checkpointLocation", "C:\\Users\\alper\\OneDrive\\Masaüstü\\Nordal Proje\\atılacaklar\\spark-read-stream-reel\\checkpoint2")\
    .start()

query.awaitTermination()

