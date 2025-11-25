# --- CONFIGURATION ---
$ACR="acrecomsecure12345.azurecr.io"

$services=@(
    "admin-service",
    "auth-service",
    "cart-service",
    "catalog-service",
    "gateway-service",
    "order-service",
    "payment-service",
    "frontend"
)

Write-Host "Logging into Azure Container Registry..." -ForegroundColor Cyan
az acr login --name acrecomsecure12345

foreach ($service in $services) {

    Write-Host "---------------------------------------------" -ForegroundColor Yellow
    Write-Host "Building image for: $service" -ForegroundColor Yellow

    $image="$ACR/$service:latest"

    docker build -t $image "./$service"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build successful. Pushing image..." -ForegroundColor Green
        docker push $image
    } else {
        Write-Host "Build FAILED. Skipping push for $service" -ForegroundColor Red
    }
}

Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host "All services processed. Verify images in Azure Portal > ACR > Repositories." -ForegroundColor Green
