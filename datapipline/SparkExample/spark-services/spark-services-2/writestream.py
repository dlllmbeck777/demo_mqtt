from dataframe import *

query = (
    df2.selectExpr("to_json(struct(*)) AS value")
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