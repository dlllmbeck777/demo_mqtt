from services1 import *

lines = (
    spark.readStream.option("multiLine", True)
    .format("kafka")
    .option("kafka.bootstrap.servers", "broker:29092")
    .option("subscribe", "test1212")
    .load()
)
df = lines.select("*")

df2 = df.withColumn("value", col("value").cast(StringType())).select("*")

df3 = df2.select(
    col("value"),
    json_tuple(
        col("value"),
        "measurement",
        "tag_value",
        "asset",
        "layer",
        "tag_quality",
        "time"
    ),
    "topic",
    "timestamp",
).toDF(
    "value",
    "measurement",
    "tag_value",
    "asset",
    "layer",
    "tag_quality",
    "time",
    "topic",
    "timestamp",
)
df3 = df3.select(
    "measurement",
    "tag_value",
    "asset",
    "layer",
    "tag_quality",
    "time",
    "topic",
    "timestamp",
)