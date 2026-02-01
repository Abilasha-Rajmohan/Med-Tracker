#!/bin/bash

# Navigate to the health-sync directory
cd health-sync

# Build the Docker image
echo "Building Docker image..."
docker build -t health-sync-app .

# Check if a container named health-sync-container is already running and stop it
if [ "$(docker ps -q -f name=health-sync-container)" ]; then
    echo "Stopping existing container..."
    docker stop health-sync-container
fi

# Remove any stopped containers with the same name
if [ "$(docker ps -a -q -f name=health-sync-container)" ]; then
    echo "Removing existing container..."
    docker rm health-sync-container
fi

# Run the Docker container
echo "Running Docker container..."
docker run -d -p 3000:3000 --name health-sync-container health-sync-app

echo "Server is up and running at http://localhost:3000"
