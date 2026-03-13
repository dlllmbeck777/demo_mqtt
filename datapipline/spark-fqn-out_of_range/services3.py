from services2 import *

df2 = df\
    .withColumn("value",col("value").cast(StringType()))\
    .select("*")

df3 = df2.select(col("value"),json_tuple(col("value"),"id","tarih","time","quality","temperature","pressure","vibration_x","vibration_y","vibration_motor","created_by","version","company","insert"),"topic","timestamp")\
    .toDF("value","id","tarih","time","quality","temperature","pressure","vibration_x","vibration_y","vibration_motor","created_by","version","company","insert","topic","timestamp") \
    
df4 = df3\
    .withColumn("temperature",df3["temperature"].cast(FloatType()))\
    .withColumn("pressure",df3["pressure"].cast(FloatType()))\
    .withColumn("vibration_x",df3["vibration_x"].cast(FloatType()))\
    .withColumn("vibration_y",df3["vibration_y"].cast(FloatType()))\
    .withColumn("vibration_motor",df3["vibration_motor"].cast(FloatType()))\
    .withColumn("time", to_timestamp("time","dd/MM/yyyy HH:mm:ss"))\
    .withColumn("quality", lit(196)) \
    
df5 = df4\
    .withColumn("value",when(col("temperature")> 0 ,"temperature").otherwise(when(col("pressure")> 0 ,"pressure").otherwise(when(col("vibration_x")> 0 ,"vibration_x").otherwise(when(col("vibration_y")> 0 ,"vibration_y").when(col("vibration_motor")> 0 ,"vibration_motor").otherwise(None)))))\
    .withColumn("quality", when((col("temperature")< 15) | (col("temperature")>70), col("quality")-50).otherwise(col("quality")))\
    .withColumn("quality", when((col("pressure")< 15) | (col("pressure")>70), col("quality")-50).otherwise(col("quality")))\
    .withColumn("quality", when((col("vibration_x")< 15) | (col("vibration_x")>70), col("quality")-50).otherwise(col("quality")))\
    .withColumn("quality", when((col("vibration_y")< 15) | (col("vibration_y")>70), col("quality")-50).otherwise(col("quality")))\
    .withColumn("quality", when((col("vibration_motor")< 15) | (col("vibration_motor")>70), col("quality")-50).otherwise(col("quality")))\

df6 = df5\
    .withColumn("org_unit4",split(col("tarih"),",").getItem(0))\
    .withColumn("asset",split(col("tarih"),",").getItem(1))\
    .drop("tarih")

df7 = df6\
    .withColumn('now_timestamp', current_timestamp())\
    .withColumn('DiffInSeconds',col("now_timestamp").cast("long") - col('time').cast("long"))\
    .withColumn('DiffInHours',round(col('DiffInSeconds')/3600))\
    .withColumn("message_Type1",when(col("DiffInHours")>5,"backfilldata").otherwise("livedata"))


df15 = df7\
    .withColumn("date",split(col("time")," ").getItem(0))\
    .withColumn("time1",split(col("time")," ").getItem(1))

df16 = df15\
    .select(concat_ws('.',df6.company,df6.org_unit4,df6.asset,df6.value).alias("fqn"),"message_Type1","id","insert","temperature","pressure","vibration_x","vibration_y","vibration_motor","id","date","time","topic","timestamp","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',df7.message_Type1).alias("message_Type"),"id","fqn","insert","temperature","pressure","vibration_x","vibration_y","vibration_motor","id","date","time","timestamp","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',df6.timestamp).alias("createdTime"),"id","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","vibration_motor","id","created_by","timestamp","version","quality","date","time1")\
    .select(concat_ws(' ',df6.temperature,df6.pressure,df6.vibration_x,df6.vibration_y,df6.vibration_motor).alias("v"),"id","createdTime","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","timestamp","vibration_motor","id","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',df15.date,df15.time1).alias("t"),"v","id","createdTime","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","timestamp","vibration_motor","id","created_by","version","quality","date","time1")\
    .withColumnRenamed("quality","q")

df17=df16\
    .withColumn("header",F.struct(F.col("version"),F.col("created_by"),F.col("createdTime"),F.col("message_Type")))\
    .withColumn("vqts",F.struct(F.col("q"),F.col("t"),F.col("v"),F.col("id")))\
    .withColumn("insert",F.struct(F.col("fqn"),F.col("vqts")))\
    .withColumn("payload",F.struct(F.col("insert")))\
    .select("header","payload")

df18 = df17\
    .select(df17.payload.insert.vqts.id,df17.header.version,df17.header.created_by,df17.header.createdTime,df17.header.message_Type,df17.payload.insert.fqn,df17.payload.insert.vqts.t,df17.payload.insert.vqts.q,df17.payload.insert.vqts.v)

df19 = df18\
    .withColumnRenamed("payload.insert.vqts.id","id")\
    .withColumnRenamed("header.version","version")\
    .withColumnRenamed("header.created_by","created_by")\
    .withColumnRenamed("header.createdTime","createdTime")\
    .withColumnRenamed("header.message_Type","message_Type")\
    .withColumnRenamed("payload.insert.fqn","fqn")\
    .withColumnRenamed("payload.insert.vqts.t","timestamp")\
    .withColumnRenamed("payload.insert.vqts.q","quality")\
    .withColumnRenamed("payload.insert.vqts.v","value")