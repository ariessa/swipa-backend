#!/bin/bash

# Stop all Docker containers
docker kill $(docker ps -q) || true

# Remove all Docker containers
docker rm $(docker ps -a -q) || true

# Remove all Docker images
docker rmi $(docker images -q) || true

# Delete postgres folder
sudo rm -rf postgres || true

# Check which process is running on port 5432 and kill the process by PID
sudo kill -9 $(sudo lsof -i :5432 | awk 'NR==2{print $2}') || true

# Delete package-lock.json file
sudo rm -f app/package-lock.json || true

# Delete node_modules folder
sudo rm -rf app/node_modules || true
