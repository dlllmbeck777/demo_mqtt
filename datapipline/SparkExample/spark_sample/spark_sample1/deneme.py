from pyspark.sql import SparkSession
from pyspark.sql.types import ArrayType, StructField, StructType, StringType, IntegerType

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
print(df.schema)
df.na.drop().show()