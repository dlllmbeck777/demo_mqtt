from lines import *

df2 = (
    df.withColumn("org_unit4", split(col("tarih"), ",").getItem(0))
    .withColumn("asset", split(col("tarih"), ",").getItem(1))
    .drop("tarih")
    .withColumn("time", date_format(col("time"), time_format))
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

