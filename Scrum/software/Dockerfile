FROM postgres:latest

COPY ./server/db/pg_hba.conf /etc/postgresql/13/main/pg_hba.conf

COPY ./server/db/schema.sql /docker-entrypoint-initdb.d/

