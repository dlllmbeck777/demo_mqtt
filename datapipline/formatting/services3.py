from services2 import *

df2 = df.withColumn("value", col("value").cast(StringType())).select("*")

df3 = df2.select(
    col("value"),
    json_tuple(
        col("value"),
        "completion",
        "tag_value",
        "time",
        "quality",
        "step-status",
        "created_by",
        "version",
        "company",
        "insert",
        "tag_name",
        "uom",
    ),
    "topic",
    "timestamp",
).toDF(
    "value",
    "completion",
    "tag_value",
    "time",
    "quality",
    "step-status",
    "created_by",
    "version",
    "company",
    "insert",
    "tag_name",
    "uom",
    "topic",
    "timestamp",
)
df4 = (
    df3.withColumn("tag_name", df3["tag_name"].cast(StringType()))
    .withColumn("time", to_timestamp("time", "dd/MM/yyyy HH:mm:ss"))
    .withColumn("quality", lit(192))
    .withColumn("step-status", lit("formatting"))
    .withColumn("version", lit(0.1))
    .withColumn("layer", lit("KNOC"))
    .withColumn("asset", lit(df3.completion))
    .withColumn("s", lit(df3.uom))
)
df5 = df4

df6 = df5

df7 = (
    df6.withColumn("now_timestamp", current_timestamp())
    .withColumn(
        "DiffInSeconds", col("now_timestamp").cast("long") - col("time").cast("long")
    )
    .withColumn("DiffInHours", round(col("DiffInSeconds") / 3600))
    .withColumn(
        "message_Type1",
        when(col("DiffInHours") > 5, "backfilldata").otherwise("livedata"),
    )
    .withColumn("date", split(col("time"), " ").getItem(0))
    .withColumn("time1", split(col("time"), " ").getItem(1))
)

df15 = df7

df16 = (
    df15.select(
        concat_ws(".", df6.tag_name).alias("fqn"),
        "message_Type1",
        "layer",
        "completion",
        "tag_value",
        "asset",
        "s",
        "insert",
        "date",
        "time",
        "topic",
        "timestamp",
        "created_by",
        "version",
        "quality",
        "step-status",
        "date",
        "time1",
        "DiffInHours",
        "tag_name",
        "uom",
    )
    .select(
        concat_ws(" ", df7.message_Type1).alias("message_type"),
        "completion",
        "tag_value",
        "layer",
        "asset",
        "s",
        "fqn",
        "insert",
        "date",
        "time",
        "timestamp",
        "created_by",
        "version",
        "quality",
        "step-status",
        "date",
        "time1",
        "DiffInHours",
        "tag_name",
        "uom",
    )
    .select(
        concat_ws(" ", df6.timestamp).alias("createdtime"),
        "completion",
        "layer",
        "asset",
        "s",
        "tag_value",
        "message_type",
        "insert",
        "fqn",
        "time",
        "created_by",
        "timestamp",
        "version",
        "quality",
        "step-status",
        "date",
        "time1",
        "DiffInHours",
        "tag_name",
        "uom",
    )
    .select(
        concat_ws(
            " ",
            df6.tag_value,
        ).alias("v"),
        "completion",
        "tag_value",
        "layer",
        "createdtime",
        "asset",
        "s",
        "message_type",
        "insert",
        "fqn",
        "time",
        "timestamp",
        "created_by",
        "version",
        "quality",
        "step-status",
        "date",
        "time1",
        "DiffInHours",
        "tag_name",
        "uom",
    )
    .select(
        concat_ws(" ", df15.date, df15.time1).alias("t"),
        "v",
        "completion",
        "tag_value",
        "layer",
        "createdtime",
        "message_type",
        "insert",
        "fqn",
        "asset",
        "s",
        "time",
        "timestamp",
        "created_by",
        "version",
        "quality",
        "step-status",
        "date",
        "time1",
        "DiffInHours",
        "tag_name",
        "uom",
    )
    .withColumnRenamed("quality", "q")
)


df17 = (
    df16.withColumn(
        "header",
        F.struct(
            F.col("version"),
            F.col("created_by"),
            F.col("createdtime"),
            F.col("message_type"),
            F.col("layer"),
            F.col("asset"),
        ),
    )
    .withColumn("vqts", F.struct(F.col("q"), F.col("t"), F.col("v"), F.col("s")))
    .withColumn("insert", F.struct(F.col("fqn"), F.col("vqts")))
    .withColumn("payload", F.struct(F.col("insert")))
    .select(
        "header",
        "completion",
        "tag_value",
        "payload",
        "DiffInHours",
        "step-status",
        "tag_name",
        "uom",
    )
)

dffqn = df17.select("header", "payload")

df18 = df17.select(
    "DiffInHours",
    "step-status",
    "tag_name",
    "uom",
    "completion",
    "tag_value",
    df17.header.version,
    df17.header.created_by,
    df17.header.createdtime,
    df17.header.message_type,
    df17.payload.insert.fqn,
    df17.payload.insert.vqts.t,
    df17.payload.insert.vqts.q,
    df17.payload.insert.vqts.v,
    df17.payload.insert.vqts.s,
)

df19 = (
    df18.withColumnRenamed("header.version", "version")
    .withColumnRenamed("header.created_by", "created_by")
    .withColumnRenamed("header.createdtime", "createdtime")
    .withColumnRenamed("header.message_type", "message_type")
    .withColumnRenamed("payload.insert.fqn", "fqn")
    .withColumnRenamed("payload.insert.vqts.t", "timestamp")
    .withColumnRenamed("payload.insert.vqts.q", "quality")
    .select(
        "completion",
        "tag_value",
        "version",
        "created_by",
        "createdtime",
        "message_type",
        "fqn",
        "timestamp",
        "quality",
        "step-status",
        "DiffInHours",
        "tag_name",
        "uom",
    )
)
df19.printSchema()

df20 = df19
