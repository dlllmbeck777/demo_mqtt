import findspark

findspark.init()
import os

os.environ[
    "PYSPARK_SUBMIT_ARGS"
] = "--packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.3.1 pyspark-shell"
from pyspark.sql import SparkSession
from pyspark.sql.types import *
from pyspark.sql.functions import *


appName = "PySpark Example - JSON file to Spark Data Frame"
master = "local"
time_format = "yyyy-mm-dd HH:mm:ss"

spark = (
    SparkSession.builder.appName("Spark Kafka Streaming").master(master).getOrCreate()
)

spark.sparkContext.setLogLevel("ERROR")

schema = StructType(
    [
        StructField("id", IntegerType(), True),
        StructField("tarih", StringType(), True),
        StructField("time", TimestampType(), True),
        StructField("temperature", FloatType(), True),
        StructField("pressure", FloatType(), True),
        StructField("vibration_x", FloatType(), True),
        StructField("vibration_y", FloatType(), True),
        StructField("vibration_motor", FloatType(), True),
    ]
)

lines = (
    spark.readStream.option("multiLine", True)
    .format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "raw-data")
    .option("startingOffsets", "earliest")
    .load()
    .select(from_json(col("value").cast("string"), schema).alias("parsed_value"))
    .select(col("parsed_value.*"))
)
df = lines.select("*")

df2 = (
    df.withColumn("org_unit4", split(col("tarih"), ",").getItem(0))
    .withColumn("asset", split(col("tarih"), ",").getItem(1))
    .drop("tarih")
    .withColumn("timee", date_format(col("time"), time_format))
    .withColumn("date", split(col("time"), " ").getItem(0))
    .withColumn("timee", split(col("time"), " ").getItem(1))
    .drop("time")
    .select(
        "id",
        "org_unit4",
        "asset",
        "date",
        "timee",
        "temperature",
        "pressure",
        "vibration_x",
        "vibration_y",
        "vibration_motor",
    )
)

query = (
    df2.selectExpr("CAST(id AS STRING) AS key", "to_json(struct(*)) AS value")
    .writeStream.format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("topic", "live_data")
    .option(
        "checkpointLocation",
        "C:\\Users\\alper\\OneDrive\\Masaüstü\\Nordal Proje\\atılacaklar\\spark-read-stream-reel\\checkpoint",
    )
    .start()
)

query.awaitTermination()
