# CREATING SPARKSESSİON AND SETTING THE SCHEMA
import findspark
findspark.init()
import os
os.environ['PYSPARK_SUBMIT_ARGS'] = '--packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.3.1 pyspark-shell'
from pyspark.sql import SparkSession
from pyspark.sql.types import *
from pyspark.sql.functions import *


appName = "PySpark Datapipline KAFKA-CASANNDRA-REDIS"
master = "local"

# SCHEMA OF INCOMING DATA
schema = StructType([
    StructField('id', IntegerType(), True),
    StructField('tarih', StringType(), True),
    StructField('time', StringType(), True),
    StructField('temperature', FloatType(), True),
    StructField('pressure', FloatType(), True),
    StructField('vibration_x', FloatType(), True),
    StructField('vibration_y', FloatType(), True),
    StructField('vibration_motor', FloatType(), True)
])

spark = SparkSession \
    .builder \
    .appName(appName) \
    .master(master) \
    .getOrCreate()

spark.sparkContext.setLogLevel("ERROR")