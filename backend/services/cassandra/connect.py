
import environ
import prometheus_client as prom
import random
import time
from prometheus_client import start_http_server
# Create a metric to track time spent and requests made.
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider


env = environ.Env(DEBUG=(bool, False))
cassandra_host = "34.70.46.54"
cassandra_port = 9092

counter = prom.Counter('python_my_counter', 'This is my counter')
gauge = prom.Gauge('python_my_gauge', 'This is my gauge')
histogram = prom.Histogram('python_my_histogram', 'This is my histogram')
summary = prom.Summary('python_my_summary', 'This is my summary')

auth_provider = PlainTextAuthProvider(username ='cassandra', password='cassandra')
cluster=Cluster(['cassandra'], auth_provider=auth_provider)
session = cluster.connect('backfilldata')
rows = session.execute('SELECT * FROM backfilldata')
for row in rows:
    histogram.observe(row.quality)
    print([row.id,row.created_by,row.createdtime,row.fqn,row.message_type,row.quality,row.timestamp,row.value,row.version])
