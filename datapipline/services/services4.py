# BY OPERATING ON DATAFRAME FULFILLING REQUESTS AND LIVEDATA
from services2 import *
df4 = df\
    .withColumn("org_unit4",split(col("tarih"),",").getItem(0))\
    .withColumn("asset",split(col("tarih"),",").getItem(1))\
    .drop("tarih")\
    .withColumn("time", to_timestamp("time","dd/MM/yyyy HH:mm:ss"))\
    .withColumn('now_timestamp', current_timestamp())\
    .withColumn('DiffInSeconds',col("now_timestamp").cast("long") - col('time').cast("long"))\
    .withColumn('DiffInHours',round(col('DiffInSeconds')/3600))\
    .filter(col('DiffInHours')<5)\

df5 = df4\
    .withColumn("date",split(col("time")," ").getItem(0))\
    .withColumn("time",split(col("time")," ").getItem(1))\
    .select("id","org_unit4","asset","time","date","temperature","pressure","vibration_x","vibration_y","vibration_motor")
