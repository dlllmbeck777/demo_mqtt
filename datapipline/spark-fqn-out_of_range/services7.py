from services5 import *
df12 = dflive\
    .select(concat_ws('.',df6.company,df6.org_unit4,df6.asset,df6.value).alias("fqn"),"message_Type1","id","insert","temperature","pressure","vibration_x","vibration_y","vibration_motor","id","date","time","topic","timestamp","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',df7.message_Type1).alias("message_Type"),"message_Type1","id","fqn","insert","temperature","pressure","vibration_x","vibration_y","vibration_motor","id","date","time","timestamp","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',df6.timestamp).alias("createdTime"),"message_Type1","id","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","vibration_motor","id","created_by","timestamp","version","quality","date","time1")\
    .select(concat_ws(' ',df6.temperature,df6.pressure,df6.vibration_x,df6.vibration_y,df6.vibration_motor).alias("v"),"message_Type1","id","createdTime","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","timestamp","vibration_motor","id","created_by","version","quality","date","time1")\
    .select(concat_ws(' ',dflive.date,dflive.time1).alias("t"),"message_Type1","v","id","createdTime","message_Type","insert","fqn","temperature","pressure","vibration_x","vibration_y","time","timestamp","vibration_motor","id","created_by","version","quality","date","time1")\
    .withColumnRenamed("quality","q")

df13 = df12\
    .withColumn("header",F.struct(F.col("version"),F.col("created_by"),F.col("createdTime"),F.col("message_Type")))\
    .withColumn("vqts",F.struct(F.col("q"),F.col("t"),F.col("v"),F.col("id")))\
    .withColumn("insert",F.struct(F.col("fqn"),F.col("vqts")))\
    .withColumn("payload",F.struct(F.col("insert")))\
    .select("header","payload")

df14 = df13\
    .select(df13.payload.insert.vqts.id,df13.header.version,df13.header.created_by,df13.header.createdTime,df13.header.message_Type,df13.payload.insert.fqn,df13.payload.insert.vqts.t,df13.payload.insert.vqts.q,df13.payload.insert.vqts.v)

df15= df14\
    .withColumnRenamed("payload.insert.vqts.id","id")\
    .withColumnRenamed("header.version","version")\
    .withColumnRenamed("header.created_by","created_by")\
    .withColumnRenamed("header.createdTime","createdTime")\
    .withColumnRenamed("header.message_Type","message_Type")\
    .withColumnRenamed("payload.insert.fqn","fqn")\
    .withColumnRenamed("payload.insert.vqts.t","timestamp")\
    .withColumnRenamed("payload.insert.vqts.q","quality")\
    .withColumnRenamed("payload.insert.vqts.v","value")