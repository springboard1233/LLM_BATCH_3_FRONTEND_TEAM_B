# Docker Deployment Guide

This guide explains how to build and deploy the Fraud Detection Dashboard frontend using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher) - **Included with Docker Desktop**

> **Note:** If Docker is not installed, see [INSTALL_DOCKER.md](./INSTALL_DOCKER.md) for installation instructions.

## Quick Start

### 1. Build and Run with Docker Compose

**Note:** Modern Docker installations use `docker compose` (space) instead of `docker-compose` (hyphen).

```bash
# Build and start the container (new syntax)
docker compose up -d

# Or use old syntax if available
docker-compose up -d

# View logs
docker compose logs -f frontend

# Stop the container
docker compose down
```

The application will be available at `http://localhost:3000`

### 2. Build and Run with Docker

```bash
# Build the Docker image
docker build -t fraud-dashboard-frontend .

# Run the container
docker run -d -p 3000:80 --name fraud-dashboard-frontend fraud-dashboard-frontend

# View logs
docker logs -f fraud-dashboard-frontend

# Stop the container
docker stop fraud-dashboard-frontend
docker rm fraud-dashboard-frontend
```

## Environment Variables

You can configure the API URL using environment variables:

```bash
# Using docker-compose
VITE_API_URL=http://your-backend-url:8000/api docker-compose up -d

# Using docker run
docker run -d -p 3000:80 \
  -e VITE_API_URL=http://your-backend-url:8000/api \
  --name fraud-dashboard-frontend \
  fraud-dashboard-frontend
```

**Note:** For production builds, environment variables must be set at build time, not runtime. If you need runtime configuration, you'll need to modify the build process or use a configuration service.

## Production Deployment

### Option 1: Standalone Frontend

If your backend is hosted separately:

1. Update `nginx/nginx.prod.conf` to point to your backend URL
2. Build and deploy:

```bash
docker build -t fraud-dashboard-frontend:latest .
docker tag fraud-dashboard-frontend:latest your-registry/fraud-dashboard-frontend:latest
docker push your-registry/fraud-dashboard-frontend:latest
```

### Option 2: Full Stack with Docker Compose

1. Uncomment the backend, MongoDB, and Redis services in `docker-compose.yml`
2. Update the backend service configuration
3. Deploy:

```bash
docker-compose up -d
```

## Building for Production

The Dockerfile uses a multi-stage build:

1. **Builder stage**: Installs dependencies and builds the React app
2. **Production stage**: Serves the built app using nginx

### Build Arguments

You can customize the build with build arguments:

```bash
docker build \
  --build-arg NODE_VERSION=18 \
  --build-arg NGINX_VERSION=alpine \
  -t fraud-dashboard-frontend .
```

## Health Checks

The container includes a health check endpoint at `/health`. You can verify it:

```bash
curl http://localhost:3000/health
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs fraud-dashboard-frontend

# Check if port is already in use
netstat -an | grep 3000
```

### Build fails

```bash
# Clear Docker cache and rebuild
docker builder prune
docker build --no-cache -t fraud-dashboard-frontend .
```

### API connection issues

1. Ensure your backend is accessible
2. Update the `proxy_pass` URL in `nginx/nginx.prod.conf`
3. Rebuild the container

### Static files not loading

1. Check if the build completed successfully
2. Verify files exist in `/usr/share/nginx/html` inside the container:
   ```bash
   docker exec fraud-dashboard-frontend ls -la /usr/share/nginx/html
   ```

## Customization

### Changing the Port

Edit `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 3000 to your desired port
```

### Adding SSL/HTTPS

1. Obtain SSL certificates
2. Update `nginx/nginx.prod.conf` to include SSL configuration
3. Mount certificates as volumes in `docker-compose.yml`

### Custom Nginx Configuration

Modify `nginx/nginx.prod.conf` and rebuild the container.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t fraud-dashboard-frontend .
      - name: Push to registry
        run: |
          docker tag fraud-dashboard-frontend:latest your-registry/fraud-dashboard-frontend:latest
          docker push your-registry/fraud-dashboard-frontend:latest
```

## Performance Optimization

- The nginx configuration includes gzip compression
- Static assets are cached for 1 year
- HTML files are set to no-cache for proper updates

## Security Considerations

- Security headers are included in the nginx configuration
- The container runs as a non-root user (nginx default)
- Only necessary ports are exposed

## Support

For issues or questions, please refer to the main project README or open an issue in the repository.

