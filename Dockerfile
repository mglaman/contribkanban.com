FROM busybox:1
RUN mkdir /app
WORKDIR /app
COPY ./bin bin
COPY ./config config
COPY ./vendor vendor
COPY ./web web
COPY ./RoboFile.php RoboFile.php
VOLUME /app

