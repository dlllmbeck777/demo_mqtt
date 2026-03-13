from services1 import *

lines = spark \
    .readStream \
    .option('multiLine', True) \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "deneme25") \
    .option("startingOffsets", "earliest") \
    .option("includeHeaders", "true") \
    .option("failOnDataLoss", False)\
    .load()\

df = lines.select('*')