#!/bin/bash

# Project Directory paths
DB_PATH="./Database"
SERVER_PATH="./Server"

# Names for the images and containers
DB_IMAGE_NAME="project_db_image"
SERVER_IMAGE_NAME="backend_image"
DB_CONTAINER_NAME="project_db"
SERVER_CONTAINER_NAME="backend_server"
NETWORK_NAME="project_network"  # Name of the custom Docker network

# Help function
function show_help {
    echo "Usage: ./startProject.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -f, --force    Force rebuild of Docker images before starting containers."
    echo "  -h, --help     Display this help message and exit."
    echo ""
    echo "Description:"
    echo "This script builds and starts two Docker containers: a PostgreSQL database container"
    echo "and a Python server container. The containers communicate over a custom Docker network."
    echo ""
    echo "Examples:"
    echo "  ./startProject.sh        Start the containers without rebuilding images if they exist."
    echo "  ./startProject.sh -f     Force rebuild of images and then start the containers."
    echo "  ./startProject.sh --help Display this help message."
}

# Check for the -f flag to force image rebuild
FORCE_REBUILD=false
if [ "$1" == "-f" ] || [ "$1" == "--force" ]; then
    FORCE_REBUILD=true
    echo "Force rebuild enabled. Rebuilding images."
elif [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    show_help
    exit 0
else
    echo "Force rebuild not enabled. Using existing images if available."
fi

# Function to stop and remove an existing container if it exists
function remove_container_if_exists {
    CONTAINER_NAME=$1
    if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
        echo "Stopping and removing existing container: $CONTAINER_NAME"
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
    fi
}

# Step 1 - Create the custom Docker network if it doesn't exist
if ! docker network ls | grep -q $NETWORK_NAME; then
    echo "Creating custom Docker network: $NETWORK_NAME"
    docker network create $NETWORK_NAME
else
    echo "Custom Docker network $NETWORK_NAME already exists."
fi

# Step 2 - Build and start the Database container
remove_container_if_exists $DB_CONTAINER_NAME
if $FORCE_REBUILD || ! docker image inspect $DB_IMAGE_NAME > /dev/null 2>&1; then
    echo "Building the database image..."
    docker build -t $DB_IMAGE_NAME "$DB_PATH" -f "$DB_PATH/Dockerfile"
else
    echo "Database image already exists, skipping build."
fi

echo "Starting the database container..."
docker run -d --name $DB_CONTAINER_NAME --network $NETWORK_NAME -p 5432:5432 $DB_IMAGE_NAME  

# Waiting for the database to be ready before continuing
echo "Waiting for the database to initialize..."
until docker exec -it $DB_CONTAINER_NAME pg_isready > /dev/null 2>&1; do
    sleep 1
done
echo "Database is ready!"

# Step 3 - Build and start the Server container
remove_container_if_exists $SERVER_CONTAINER_NAME
if $FORCE_REBUILD || ! docker image inspect $SERVER_IMAGE_NAME > /dev/null 2>&1; then
    echo "Building the server image..."
    docker build -t $SERVER_IMAGE_NAME "$SERVER_PATH" -f "$SERVER_PATH/Dockerfile"
else
    echo "Server image already exists, skipping build."
fi

echo "Starting the server container..."
docker run -d --name $SERVER_CONTAINER_NAME --network $NETWORK_NAME -p 8000:8000 $SERVER_IMAGE_NAME

echo "CS6440 Project Started."
