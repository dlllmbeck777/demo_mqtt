FROM node:18-alpine
WORKDIR /frontend

RUN apk update && apk add bash

COPY ./frontend /frontend
RUN npm config set legacy-peer-deps true
RUN npm ci --no-audit --no-fund

COPY /entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint



ENTRYPOINT [ "/entrypoint" ]
