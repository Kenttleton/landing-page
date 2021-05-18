FROM node:10-alpine
EXPOSE 80 443
WORKDIR /app
RUN mkdir /data