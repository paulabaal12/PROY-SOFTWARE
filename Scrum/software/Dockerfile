FROM postgres:latest

COPY ./server/db/schema.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=users_db

EXPOSE 5432
