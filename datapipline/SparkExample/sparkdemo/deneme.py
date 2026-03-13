import findspark
findspark.init()
import os
os.environ['PYSPARK_SUBMIT_ARGS'] = '--packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.3.1 pyspark-shell'
from pyspark.sql import SparkSession
from pyspark.sql.types import *
from pyspark.sql.functions import *


appName = "PySpark Example - JSON file to Spark Data Frame"
master = "local"

# Create Spark session
spark = SparkSession.builder \
    .master("local") \
    .appName(appName) \
    .master(master) \
    .getOrCreate()

# Create a schema for the dataframe
schema = StructType([
    StructField('date1', StringType(), True),
    StructField('Temperature:', StringType(), True),
    StructField('Pressure:', StringType(), True),
    StructField('Vibration_X', StringType(), True),
    StructField('Vibration_Y', StringType(), True),
    StructField('Vibration_motor', StringType(), True)
])


# Create data frame
json_file_path = 'C:\dataset\data_file.json'
df = spark.read.json(json_file_path, schema, multiLine=True)
df = df.na.drop()
df.show()

df2 = df.select('date1',
                 concat(
                 col('Temperature:'), lit(","),
                 col('Pressure:'), lit(","),
                 col('Vibration_X'), lit(","),
                 col('Vibration_Y'), lit(","),
                 col('Vibration_motor')
                 ).alias("value")

)
df2.show(2)

df2 \
.write \
.format("kafka") \
.option("kafka.bootstrap.servers", "localhost:9092") \
.option("topic", "deneme") \
.save()