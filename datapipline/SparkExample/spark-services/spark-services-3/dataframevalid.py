from spark_write import *

df3 = (
    df2.withColumn("time", date_format(col("time"), time_format))
    .select(
        "id",
        "org_unit4",
        "asset",
        "time",
        "temperature",
        "pressure",
        "vibration_x",
        "vibration_y",
        "vibration_motor",
    )
)
query = (
    df3.selectExpr("to_json(struct(*)) AS value")
    .writeStream.format("kafka")
    .option("kafka.bootstrap.servers", bootstrapserver)
    .option("topic", "live_data")
    .option(
        "checkpointLocation",
        "C:\\Users\\alper\\OneDrive\\Masaüstü\\Nordal Proje\\atılacaklar\\spark_read_and_write_newtopic\\checkpoint",
    )
    .start()
)

query.awaitTermination()
