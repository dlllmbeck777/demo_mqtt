FROM python:3.11-alpine

RUN pip install --no-cache-dir paho-mqtt==1.6.1

WORKDIR /app

COPY ./all_dockerfiles/local/mqtt-publisher/publisher.py /app/publisher.py

CMD ["python", "/app/publisher.py"]
