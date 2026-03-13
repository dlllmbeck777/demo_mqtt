FROM confluentinc/cp-kafka-connect-base:5.3.1
RUN  confluent-hub install --no-prompt confluentinc/kafka-connect-rabbitmq:1.1.1
RUN  confluent-hub install --no-prompt confluentinc/kafka-connect-mqtt:latest
RUN  confluent-hub install --no-prompt microsoft/kafka-connect-iothub:0.6