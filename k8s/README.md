# Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the e-commerce microservices to Azure AKS.

## Prerequisites

- Azure AKS cluster created
- kubectl configured to connect to your AKS cluster
- Docker images pushed to Azure Container Registry (ACR) or another container registry

## Setup

1. Create the namespace:
```bash
kubectl apply -f namespace.yaml
```

2. Create JWT secret:
```bash
kubectl create secret generic jwt-secret --from-literal=secret=your-super-secret-jwt-key-change-in-production -n ecommerce
```

3. Deploy infrastructure:
```bash
kubectl apply -f mongo.yaml
kubectl apply -f redis.yaml
```

4. Deploy services (update image references to your registry):
```bash
kubectl apply -f auth-service.yaml
kubectl apply -f gateway-service.yaml
# ... apply other service manifests
```

5. Deploy frontend:
```bash
kubectl apply -f frontend.yaml
```

## Notes

- Update image references in deployment files to point to your container registry
- Adjust replica counts based on your needs
- Configure ingress for external access
- Set up persistent volumes for MongoDB in production
- Use Azure Key Vault for secrets in production

