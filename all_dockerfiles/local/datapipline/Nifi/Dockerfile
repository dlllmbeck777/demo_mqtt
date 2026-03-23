FROM apache/nifi:1.24.0
USER root

RUN apt-get update 

# Install Python3
RUN apt-get install -y python3 python3-pip
RUN apt install nano
# Install libraries 

RUN pip3 install xlrd

RUN pip3 install unicodecsv \
    && python3 -m pip install pandas\
    && python3 -m pip install kafka-python\
    && python3 -m pip install requests

RUN python3 -m pip install confluent_kafka\
    && python3 -m pip install redis\
    && python3 -m pip install pymongo\
    && python3 -m pip install influxdb_client 

RUN python3 -m pip install paho-mqtt python-etcd
RUN python3 -m pip install kazoo
RUN python3 -m pip install asyncio
RUN python3 -m pip install psycopg2-binary 

RUN apt update && apt install -y docker.io

COPY ./all_dockerfiles/local/datapipline/Nifi/nifi-influx-database-nar-1.24.0.nar /opt/nifi/nifi-current/extensions
COPY ./all_dockerfiles/local/datapipline/Nifi/bootstrap-flow/ /opt/nifi/bootstrap-flow/
COPY ./all_dockerfiles/local/datapipline/Nifi/nifi-entrypoint-with-flow.sh /opt/nifi/scripts/nifi-entrypoint-with-flow.sh
COPY ./all_dockerfiles/local/datapipline/Nifi/normalize_bundled_flow.py /opt/nifi/scripts/normalize_bundled_flow.py
RUN sed -i 's/nifi.content.repository.archive.enabled=true/nifi.content.repository.archive.enabled=false/' /opt/nifi/nifi-current/conf/nifi.properties
RUN chmod +x /opt/nifi/scripts/nifi-entrypoint-with-flow.sh
ENTRYPOINT ["/opt/nifi/scripts/nifi-entrypoint-with-flow.sh"]
# RUN pip3 install <additional library>
