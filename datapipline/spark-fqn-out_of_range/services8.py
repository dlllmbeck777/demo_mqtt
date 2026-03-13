from services6 import *
from services7 import *


df17.printSchema()
df19.printSchema()

query = (
    df17.writeStream.format("json")
    .option("path", "C:\\Users\\alper\\OneDrive\\Masaüstü\\spark-fqn-out_of_range\\fqn")
    .option(
        "checkpointLocation",
        "C:\\Users\\alper\\OneDrive\\Masaüstü\\spark-fqn-out_of_range\\fqn",
    )
    .option("maxRecordsPerFile", 1)
    .start()
)

query2 = (
    df11.selectExpr("CAST(id AS STRING) AS key", "to_json(struct(*)) AS value")
    .writeStream.format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("topic", "backfill_data")
    .option(
        "checkpointLocation",
        "C:\\Users\\alper\\OneDrive\\Masaüstü\\spark-fqn-out_of_range\\checkpoint",
    )
    .start()
)

query3 = (
    df15.selectExpr("CAST(id AS STRING) AS key", "to_json(struct(*)) AS value")
    .writeStream.format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("topic", "live_data")
    .option(
        "checkpointLocation",
        "C:\\Users\\alper\\OneDrive\\Masaüstü\\spark-fqn-out_of_range\\checkpoint2",
    )
    .start()
)

query4 = (
    df6.writeStream.option("truncate", False)
    .outputMode("Append")
    .format("console")
    .start()
)

query.awaitTermination()
