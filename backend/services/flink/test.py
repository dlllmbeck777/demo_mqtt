import os
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.connectors import NiFiSource

env = StreamExecutionEnvironment.get_execution_environment()
nifi_api_url = os.environ.get("NIFI_API_URL", "http://localhost:8082/nifi-api")
nifi_port_name = os.environ.get("FLINK_NIFI_PORT_NAME", "output")
nifi_content_type = os.environ.get("FLINK_NIFI_CONTENT_TYPE", "application/json")

nifi_source = NiFiSource.create(
    env, nifi_api_url, nifi_port_name, nifi_content_type
)

data_stream = env.add_source(nifi_source)

data_stream.print()

env.execute("NiFi DataStream Example")
