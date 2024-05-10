#!/bin/bash

NETWORK_NAME="swipa-network"

# Install packages using npm
npm install

# Check if the network already exists
if ! docker network inspect $NETWORK_NAME >/dev/null 2>&1; then
    echo "Creating network: $NETWORK_NAME"
    docker network create $NETWORK_NAME
fi

# Build and start Docker containers in detached mode
docker-compose --env-file .env --file docker-compose.yml up -d
