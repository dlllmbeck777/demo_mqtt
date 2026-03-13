KAFKA_TOPIC_NAME = "inkai-data"
KAFKA_BOOTSTRAP_SERVER = "broker:29092"
import os

from pyspark.sql import SparkSession
import findspark

findspark.init()
import os

from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *
from pyspark.sql.functions import *

spark = (
    SparkSession.builder.appName("KafkaIntegration")
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.4.0")
    .getOrCreate()
)
kafka_df = (
    spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVER)
    .option("subscribe", KAFKA_TOPIC_NAME)
    .load()