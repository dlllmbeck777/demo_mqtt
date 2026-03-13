import redis
import os

Redis_Db_Name = os.environ.get("Redis_Db_Name")

r = redis.Redis(host=Redis_Db_Name, port=6379, db=2)

memory_usage = r.execute_command('MEMORY', 'USAGE', '#')
print(memory_usage)

memory_usage_gb = memory_usage / (1024 * 1024 * 1024)

print("database memory usage (GB):", memory_usage_gb)