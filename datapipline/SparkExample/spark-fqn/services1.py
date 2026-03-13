import findspark
findspark.init()
import os
os.environ['PYSPARK_SUBMIT_ARGS'] = '--packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.3.1 pyspark-shell'
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *
from pyspark.sql.functions import *

time_format = "dd/MM/yyyy HH:mm:ss"
appName = "PySpark Datapipline KAFKA-CASANNDRA-REDIS"
master = "local"

spark = SparkSession \
    .builder \
    .appName(appName) \
    .master(master) \
    .getOrCreate()

spark.sparkContext.setLogLevel("ERROR")