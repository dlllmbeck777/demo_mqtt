from spark_write import *

bootstrapserver = "localhost:9092"
topic = "raw-data"

lines = (
    spark.readStream.option("multiLine", True)
    .format("kafka")
    .option("kafka.bootstrap.servers", bootstrapserver)
    .option("subscribe", topic)
    .option("startingOffsets", "earliest")
    .load()
    .select(from_json(col("value").cast("string"), schema).alias("parsed_value"))
    .select(col("parsed_value.*"))
)
df = lines.select("*")

