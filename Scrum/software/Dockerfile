FROM postgres:latest

COPY ./server/db/schema.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=userpassword
ENV POSTGRES_DB=users_db

EXPOSE 5432
