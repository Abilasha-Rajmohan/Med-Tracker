#!/bin/bash

# Project Path and Container names
DB_PATH="./Database"
SERVER_PATH="./Server"

DB_CONTAINER_NAME="postgres_db"
SERVER_CONTAINER_NAME="python_server"

# Building and starting the Database container
echo "Building and starting the database container..."
docker build -t postgres_image "$DB_PATH" -f "$DB_PATH/Dockerfile"
docker run -d --name $DB_CONTAINER_NAME postgres_image

# Wait for the database to be ready
echo "Waiting for the database to initialize..."
until docker exec -it $DB_CONTAINER_NAME pg_isready > /dev/null 2>&1; do
    sleep 1
done
echo "Database is ready!"

# Step 2: Build and start the Server container
echo "Building and starting the server container..."
docker build -t python_image "$SERVER_PATH" -f "$SERVER_PATH/Dockerfile"
docker run -d --name $SERVER_CONTAINER_NAME --link $DB_CONTAINER_NAME:db python_image

echo "Both containers are up and running."
