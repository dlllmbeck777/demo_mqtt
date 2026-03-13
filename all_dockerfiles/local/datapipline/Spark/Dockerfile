FROM ubuntu:20.04

ENV DEBIAN_FRONTEND noninteractive
ENV PATH=$PATH:/usr/spark-2.4.1/bin
RUN apt-get update -y
RUN apt-get remove -y python3.8
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:deadsnakes/ppa
RUN apt-get update -y
RUN apt-get install -y python3.6
RUN apt-get install -y python3-pip
RUN apt-get install -y python3.6-distutils
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.6 1
ENV PATH /usr/local/bin:$PATH
RUN ln -s /usr/bin/python3.6 /usr/local/bin/python3
RUN apt-get install -y tzdata
RUN apt-get install -y wget
RUN apt-get install -y openjdk-8-jdk
RUN update-alternatives --config java
RUN python3 -m pip install --upgrade pyspark
RUN python3 -m pip install findspark
RUN python3 -m pip install pymongo

# Download Spark
RUN wget https://archive.apache.org/dist/spark/spark-2.4.5/spark-2.4.5-bin-hadoop2.7.tgz

# Extract Spark
RUN tar -xf spark-2.4.5-bin-hadoop2.7.tgz
ENV PYTHON_VERSION=3.6.8
# Set Spark Home
ENV SPARK_HOME /spark-2.4.5-bin-hadoop2.7

# Add Spark to PATH
ENV PATH $SPARK_HOME/bin:$PATH
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64

COPY ./all_dockerfiles/local/datapipline/Spark/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

ENTRYPOINT [ "/entrypoint" ]