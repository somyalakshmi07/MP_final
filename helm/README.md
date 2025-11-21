# Helm Chart for E-Commerce Microservices

This Helm chart deploys the complete e-commerce microservices platform to Azure AKS.

## Chart Structure

```
helm/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration values
└── templates/          # Kubernetes manifest templates
    ├── _helpers.tpl     # Template helpers
    ├── namespace.yaml
    ├── redis.yaml
    ├── gateway-service.yaml
    ├── auth-service.yaml
    ├── catalog-service.yaml
    ├── cart-service.yaml
    ├── order-service.yaml
    ├── payment-service.yaml
    ├── admin-service.yaml
    ├── frontend-service.yaml
    └── ingress.yaml
```

## Prerequisites

- Kubernetes cluster (Azure AKS)
- Helm 3.x installed
- kubectl configured to access your cluster
- JWT secret created in the target namespace

## Installation

### 1. Create JWT Secret

```bash
kubectl create secret generic jwt-secret \
  --from-literal=secret=your-super-secret-jwt-key-change-in-production \
  -n backend
```

### 2. Update values.yaml

Edit `helm/values.yaml` to match your environment:

- Update `image.repository` to your ACR name
- Update `mongodb.uri` with your MongoDB Atlas connection string
- Adjust replica counts as needed
- Configure ingress settings for Application Gateway

### 3. Deploy with Helm

```bash
# Install the chart
helm install ecommerce-secure ./helm \
  --namespace backend \
  --create-namespace \
  -f helm/values.yaml

# Or upgrade existing deployment
helm upgrade ecommerce-secure ./helm \
  --namespace backend \
  -f helm/values.yaml
```

## Configuration

Key configuration values in `values.yaml`:

### Image Configuration
```yaml
image:
  repository: acrecomsecure.azurecr.io
  tag: latest
```

### MongoDB Atlas
```yaml
mongodb:
  uri: "mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce-app"
```

### Service Replicas
```yaml
services:
  gateway:
    replicas: 2
  auth:
    replicas: 2
  # ... etc
```

### Ingress (Application Gateway)
```yaml
ingress:
  enabled: true
  className: azure/application-gateway
  hosts:
    - host: "*"
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: frontend-service
              port:
                number: 80
```

## Upgrading

To upgrade the deployment with new images:

```bash
helm upgrade ecommerce-secure ./helm \
  --namespace backend \
  --set image.tag=NEW_TAG \
  -f helm/values.yaml
```

## Uninstalling

```bash
helm uninstall ecommerce-secure --namespace backend
```

## Health Checks

All services include:
- **Liveness probes**: Restart unhealthy containers
- **Readiness probes**: Only route traffic to ready pods

## Resource Limits

Each service has resource requests and limits configured:
- Requests: Minimum resources guaranteed
- Limits: Maximum resources allowed

Adjust in `values.yaml` or individual service templates as needed.

## Troubleshooting

### Check deployment status
```bash
kubectl get deployments -n backend
kubectl get pods -n backend
kubectl get services -n backend
```

### View logs
```bash
kubectl logs -n backend deployment/gateway-service
kubectl logs -n backend deployment/auth-service
# ... etc
```

### Check ingress
```bash
kubectl get ingress -n backend
kubectl describe ingress ecommerce-ingress -n backend
```

### Verify Application Gateway integration
```bash
# Check if AGIC pod is running
kubectl get pods -n kube-system | grep ingress

# Check Application Gateway backend pools in Azure Portal
```

## Notes

- The chart uses MongoDB Atlas (external), so no MongoDB deployment is included
- Redis is deployed as part of the chart (can be disabled in values.yaml)
- All services use the same JWT secret
- Ingress is configured for Azure Application Gateway with AGIC
- Namespace is created automatically if it doesn't exist

