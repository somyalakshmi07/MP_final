# Azure DevOps CI/CD Deployment Guide

Complete step-by-step guide for deploying the e-commerce platform to Azure AKS using Azure DevOps.

## Quick Start Checklist

- [ ] Azure resources created (AKS, ACR, Application Gateway)
- [ ] GitHub repository with code pushed
- [ ] Azure DevOps organization and project created
- [ ] Service connections configured
- [ ] Environment created in Azure DevOps
- [ ] JWT secret created in AKS
- [ ] Pipeline created and configured
- [ ] First deployment successful

## Detailed Steps

### 1. Azure Resources Setup

Ensure you have these resources in Azure:

```bash
Resource Group: rg-ecommerce-secure
- AKS Cluster: aks-private-ecommerce
- ACR: acrecomsecure
- Application Gateway: agw-ecommerce
```

### 2. Azure DevOps Setup

#### Create Organization & Project
1. Visit https://dev.azure.com
2. Create organization: `my-ecommerce-org`
3. Create project: `ECommerce-Secure`

#### Import Repository
1. Go to **Repos** → **Import repository**
2. Enter your GitHub repository URL
3. Import

### 3. Service Connections

#### Azure Resource Manager Connection
- Name: `azure-rm-secure`
- Type: Azure Resource Manager
- Subscription: Your Azure subscription
- Resource Group: `rg-ecommerce-secure`
- Grant access to all pipelines: ✅

#### Docker Registry Connection
- Name: `acr-secure-connection`
- Type: Docker Registry
- Registry: Azure Container Registry
- Registry: `acrecomsecure`
- Subscription: Your Azure subscription

### 4. Environment Setup

1. Go to **Pipelines** → **Environments**
2. Create environment: `production-secure`
3. (Optional) Add approval gates

### 5. Pre-Deployment: Create JWT Secret

Before first deployment, create the JWT secret in AKS:

```bash
# Connect to AKS
az aks get-credentials \
  --resource-group rg-ecommerce-secure \
  --name aks-private-ecommerce

# Create namespace
kubectl create namespace backend

# Create secret
kubectl create secret generic jwt-secret \
  --from-literal=secret=your-super-secret-jwt-key-change-in-production \
  -n backend
```

### 6. Pipeline Configuration

The pipeline file `azure-pipelines.yml` is already configured. Verify these variables match your setup:

```yaml
variables:
  acrName: acrecomsecure              # Your ACR name
  acrConnection: acr-secure-connection # Service connection name
  aksCluster: aks-private-ecommerce   # Your AKS cluster name
  resourceGroup: rg-ecommerce-secure  # Your resource group
  helmChartPath: helm                 # Path to Helm chart
```

### 7. Helm Chart Configuration

Update `helm/values.yaml`:

```yaml
image:
  repository: acrecomsecure.azurecr.io  # Your ACR
  tag: latest

namespace: backend

mongodb:
  uri: "mongodb+srv://..."  # Your MongoDB Atlas URI
```

### 8. Create and Run Pipeline

1. Go to **Pipelines** → **New pipeline**
2. Select **Azure Repos Git**
3. Select your repository
4. Choose **Existing Azure Pipelines YAML file**
5. Path: `/azure-pipelines.yml`
6. Review and **Run**

### 9. Verify Deployment

#### Check Pipeline Status
- Go to **Pipelines** → View your pipeline run
- Wait for Build and Deploy stages to complete (5-8 minutes)

#### Verify in AKS
```bash
# Check pods
kubectl get pods -n backend

# Check services
kubectl get services -n backend

# Check ingress
kubectl get ingress -n backend
```

#### Access Application
1. Azure Portal → Application Gateway → `agw-ecommerce`
2. Copy **Public IP**
3. Open in browser

## Pipeline Stages

### Stage 1: Build
- Builds 8 Docker images:
  - frontend
  - gateway-service
  - auth-service
  - catalog-service
  - cart-service
  - order-service
  - payment-service
  - admin-service
- Pushes to ACR with build ID tag

### Stage 2: Deploy
- Installs Helm (if needed)
- Configures kubectl for AKS
- Deploys via Helm chart
- Updates Application Gateway via AGIC

## Troubleshooting

### Pipeline Fails at Build
**Issue**: Docker build fails
- Check Dockerfile paths in pipeline match folder structure
- Verify service connection has ACR access
- Check build logs for specific errors

### Pipeline Fails at Deploy
**Issue**: Helm deployment fails
- Verify JWT secret exists: `kubectl get secret jwt-secret -n backend`
- Check AKS connection: `az aks get-credentials --resource-group rg-ecommerce-secure --name aks-private-ecommerce`
- Verify namespace exists: `kubectl get namespace backend`
- Check Helm chart syntax: `helm lint ./helm`

### Application Gateway Not Routing
**Issue**: Can't access application via public IP
- Verify AGIC is installed: `kubectl get pods -n kube-system | grep ingress`
- Check ingress resource: `kubectl describe ingress ecommerce-ingress -n backend`
- Verify Application Gateway backend pools in Azure Portal
- Check Application Gateway health probes

### Services Not Starting
**Issue**: Pods in CrashLoopBackOff
- Check pod logs: `kubectl logs -n backend deployment/SERVICE_NAME`
- Verify environment variables in Helm values
- Check MongoDB connection string
- Verify Redis service is running: `kubectl get svc redis -n backend`

## Manual Deployment (Alternative)

If you need to deploy manually without CI/CD:

```bash
# Build and push images
docker build -t acrecomsecure.azurecr.io/frontend:latest ./frontend
docker push acrecomsecure.azurecr.io/frontend:latest
# Repeat for all services...

# Deploy with Helm
helm upgrade --install ecommerce-secure ./helm \
  --namespace backend \
  --create-namespace \
  -f helm/values.yaml \
  --set image.tag=latest
```

## Updating the Application

### Automatic (Recommended)
1. Make code changes
2. Commit and push to `main` branch
3. Pipeline automatically builds and deploys
4. Wait 5-8 minutes
5. Application updated!

### Manual
1. Update code
2. Build new images
3. Push to ACR
4. Update Helm values with new tag
5. Run `helm upgrade`

## Security Best Practices

- ✅ Use Azure Key Vault for secrets (instead of Kubernetes secrets)
- ✅ Enable WAF rules on Application Gateway
- ✅ Use private AKS cluster
- ✅ Enable network policies
- ✅ Regular security updates
- ✅ Monitor with Azure Security Center

## Cost Optimization

- Use Azure for Students subscription
- Right-size pod resource requests/limits
- Use managed identity instead of service principals
- Enable auto-scaling for services
- Use Azure Spot instances for non-critical workloads

## Support

For issues:
1. Check pipeline logs in Azure DevOps
2. Check pod logs in AKS
3. Review Application Gateway logs
4. Check Azure Monitor for metrics

## Next Steps

After successful deployment:
- [ ] Set up monitoring and alerts
- [ ] Configure auto-scaling
- [ ] Set up backup strategy
- [ ] Configure custom domain
- [ ] Enable SSL/TLS certificates
- [ ] Set up staging environment
- [ ] Configure blue-green deployments

