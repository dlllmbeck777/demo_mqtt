import os
from kazoo.client import KazooClient
from helper import get_health_status_messages, send_alarm

host = os.environ["ZooKeeper_HOST"]
port = os.environ["ZooKeeper_PORT"]
zk_hosts = f"{host}:{port}"
zk_path = os.environ["ZooKeeper_PATH"]


def check_zookeeper_health(zookeeper_host):
    zk = KazooClient(hosts=zookeeper_host)
    zk.start()
    
    print(zk.exists("/health-check-node"))

    if zk.exists("/health-check-node"):
        zk.stop()
        send_alarm(source="Zookeeper")
    else:
        zk.stop()
        error_message = get_health_status_messages("DOWN", "en-US")
        send_alarm(error_message=error_message, source="Zookeeper", state="Stopped")


check_zookeeper_health(zk_hosts)

# host = os.environ.get("Kafka_Host_DP")
# producer = KafkaProducer(
#     bootstrap_servers=host,
#     value_serializer=lambda v: json.dumps(v).encode("ascii"),
# )
# created_time = datetime.datetime.now()

# try:
#     zk = KazooClient(hosts="zookeeper:2181")
#     zk.start()
#     zk.ensure_path("/")
#     zk.stop()
#     print("ok")
# except Exception as e:
#     error_message = f"ZooKeeper health check failed: {e}"
#     data = {
#         "LOG_TYPE": "Alarm",
#         "date": created_time,
#         "layer_name": "KNOC",
#         "error_message": error_message,
#         "container": "Zookeeper",
#     }
#     producer.send("alarms", value=data)
#     producer.flush()
