from services3 import *

dflive1 = df7\
    .filter(col('DiffInHours')<5)

dflive = dflive1\
    .withColumn("date",split(col("time")," ").getItem(0))\
    .withColumn("time1",split(col("time")," ").getItem(1))