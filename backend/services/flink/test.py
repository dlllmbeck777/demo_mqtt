from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.connectors import NiFiSource

env = StreamExecutionEnvironment.get_execution_environment()

nifi_source = NiFiSource.create(
    env, "http://192.168.1.88:8082/nifi-api", "output", "application/json"
)

data_stream = env.add_source(nifi_source)

data_stream.print()

env.execute("NiFi DataStream Example")
