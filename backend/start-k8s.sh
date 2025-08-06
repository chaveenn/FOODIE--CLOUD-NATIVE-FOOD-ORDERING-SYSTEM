#!/bin/bash

echo "🚀 Starting Minikube with Docker driver..."
minikube start --driver=docker

echo "🔁 Setting Docker env for Minikube..."
eval $(minikube docker-env)

echo "🐳 Building Docker images..."
docker build -t user-management-service ./user-management-service
docker build -t restaurant-service ./restaurant-service
docker build -t order-service ./order-service
docker build -t api-gateway ./api-gateway

echo " Re-generating Kubernetes manifests using Kompose..."
rm -f *.yaml
kompose convert

echo " Applying Kubernetes deployments and services..."
kubectl apply -f .

echo " Checking pod status..."
kubectl get pods

echo " Creating tunnel for api-gateway service..."
minikube service api-gateway
