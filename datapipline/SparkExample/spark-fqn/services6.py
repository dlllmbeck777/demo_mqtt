from services4 import *
df8 = dfback2\
    .select(concat_ws('.',df6.company,df6.org_unit4,df6.asset,df6.value).alias("fqn"),"message_Type1","id","insert","temperature","pressure","vibration_x","vibration_y","vibration_motor","id","date","time","topic","timestamp","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',df7.message_Type1).alias("message_Type"),"id","fqn","insert","temperature","pressure","vibration_x","vibration_y","vibration_motor","id","date","time","timestamp","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',df6.timestamp).alias("createdTime"),"id","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","vibration_motor","id","created_by","timestamp","version","quality","date","time1")\
    .select(concat_ws(' ',df6.temperature,df6.pressure,df6.vibration_x,df6.vibration_y,df6.vibration_motor).alias("v"),"id","createdTime","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","timestamp","vibration_motor","id","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',dfback2.date,dfback2.time1).alias("t"),"v","id","createdTime","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","timestamp","vibration_motor","id","created_by","version","quality","date","time1")\
    .withColumnRenamed("quality","q")

df9 = df8\
    .withColumn("header",F.struct(F.col("version"),F.col("created_by"),F.col("createdTime"),F.col("message_Type")))\
    .withColumn("vqts",F.struct(F.col("q"),F.col("t"),F.col("v"),F.col("id")))\
    .withColumn("insert",F.struct(F.col("fqn"),F.col("vqts")))\
    .withColumn("payload",F.struct(F.col("insert")))\
    .select("header","payload")

df10 = df9\
    .select(df9.payload.insert.vqts.id,df9.header.version,df9.header.created_by,df9.header.createdTime,df9.header.message_Type,df9.payload.insert.fqn,df9.payload.insert.vqts.t,df9.payload.insert.vqts.q,df9.payload.insert.vqts.v)

df11= df10\
    .withColumnRenamed("payload.insert.vqts.id","id")\
    .withColumnRenamed("header.version","version")\
    .withColumnRenamed("header.created_by","created_by")\
    .withColumnRenamed("header.createdTime","createdTime")\
    .withColumnRenamed("header.message_Type","message_Type")\
    .withColumnRenamed("payload.insert.fqn","fqn")\
    .withColumnRenamed("payload.insert.vqts.t","timestamp")\
    .withColumnRenamed("payload.insert.vqts.q","quality")\
    .withColumnRenamed("payload.insert.vqts.v","value")
