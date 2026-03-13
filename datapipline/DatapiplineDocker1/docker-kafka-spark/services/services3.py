from services2 import *
query2 = (
    df3.selectExpr("to_json(struct(*)) AS value")
    .writeStream.format("kafka")
    .option("kafka.bootstrap.servers", "broker:29092")
    .option("topic", "backorlive")
    .option(
        "checkpointLocation",
        "app/check2",
    )
    .start()
)

query4 = (
    df3.writeStream.option("truncate", False)
    .outputMode("update")
    .format("console")
    .start()
)

query2.awaitTermination()
