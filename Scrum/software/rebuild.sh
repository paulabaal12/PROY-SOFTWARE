#!/bin/bash

#ENV
POD_NAME="meteorpod"
DB_CONTAINER="meteor_postgresdb"
APP_CONTAINER="meteor_app"

#DIR
DB_DIR="server/PostgreSQL/db"
APP_DIR="."

printf "Deteniendo contenedores"
podman stop $DB_CONTAINER $APP_CONTAINER

printf "Eliminando contenedores"
podman rm -f $DB_CONTAINER $APP_CONTAINER

printf "Reconstruyendo APP"
podman build -t $APP_CONTAINER -f $APP_DIR/Dockerfile $APP_DIR

printf "Reconstruyendo DB"
podman build -t $DB_CONTAINER -f $DB_DIR/Dockerfile $DB_DIR

if ! podman pod exists $POD_NAME; then
	printf "Creando pod $POD_NAME..."
	podman pod create --name $POD_NAME -p 3000:3000 -p 5433:5432
fi

printf "Levantando contenedores"
podman run -d --replace --name $DB_CONTAINER --pod $POD_NAME --env-file .env meteor_postgresdb
podman run -d --replace --name $APP_CONTAINER --pod $POD_NAME meteor_app
