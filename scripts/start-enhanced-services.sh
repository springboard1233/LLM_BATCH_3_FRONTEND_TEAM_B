#!/bin/bash

# Enhanced Fraud Dashboard Services Startup Script

set -e

echo "🚀 Starting Enhanced Fraud Dashboard Services..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p LLM_BATCH_3_BACKEND_TEAM_B/logs
mkdir -p LLM_BATCH_3_BACKEND_TEAM_B/models
mkdir -p data/redis
mkdir -p data/influxdb
mkdir -p data/elasticsearch

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    print_warning ".env file not found. Copying from .env.example..."
    cp .env.example .env
    print_warning "Please update the .env file with your configuration before proceeding."
    read -p "Press Enter to continue after updating .env file..."
fi

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.enhanced.yml down --remove-orphans

# Pull latest images
print_status "Pulling latest Docker images..."
docker-compose -f docker-compose.enhanced.yml pull

# Build custom images
print_status "Building custom images..."
docker-compose -f docker-compose.enhanced.yml build

# Start infrastructure services first
print_status "Starting infrastructure services (Redis, InfluxDB, Elasticsearch)..."
docker-compose -f docker-compose.enhanced.yml up -d redis influxdb elasticsearch

# Wait for services to be ready
print_status "Waiting for infrastructure services to be ready..."
sleep 30

# Check if Redis is ready
print_status "Checking Redis connection..."
if docker-compose -f docker-compose.enhanced.yml exec -T redis redis-cli ping | grep -q PONG; then
    print_success "Redis is ready"
else
    print_error "Redis is not responding"
    exit 1
fi

# Check if InfluxDB is ready
print_status "Checking InfluxDB connection..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:8086/health | grep -q '"status":"pass"'; then
        print_success "InfluxDB is ready"
        break
    fi
    if [ $attempt -eq $max_attempts ]; then
        print_error "InfluxDB is not responding after $max_attempts attempts"
        exit 1
    fi
    print_status "Waiting for InfluxDB... (attempt $attempt/$max_attempts)"
    sleep 5
    ((attempt++))
done

# Check if Elasticsearch is ready
print_status "Checking Elasticsearch connection..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:9200/_cluster/health | grep -q '"status":"green\|yellow"'; then
        print_success "Elasticsearch is ready"
        break
    fi
    if [ $attempt -eq $max_attempts ]; then
        print_error "Elasticsearch is not responding after $max_attempts attempts"
        exit 1
    fi
    print_status "Waiting for Elasticsearch... (attempt $attempt/$max_attempts)"
    sleep 5
    ((attempt++))
done

# Start application services
print_status "Starting application services (Celery, Nginx)..."
docker-compose -f docker-compose.enhanced.yml up -d celery-worker celery-beat nginx

# Wait for application services
sleep 10

# Check service status
print_status "Checking service status..."
docker-compose -f docker-compose.enhanced.yml ps

# Display service URLs
print_success "Enhanced Fraud Dashboard Services Started Successfully!"
echo ""
echo "📊 Service URLs:"
echo "   Frontend (via Nginx): http://localhost"
echo "   Backend API (via Nginx): http://localhost/api"
echo "   InfluxDB UI: http://localhost:8086"
echo "   Elasticsearch: http://localhost:9200"
echo "   Redis: localhost:6379"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose -f docker-compose.enhanced.yml logs -f [service_name]"
echo "   Stop services: docker-compose -f docker-compose.enhanced.yml down"
echo "   Restart service: docker-compose -f docker-compose.enhanced.yml restart [service_name]"
echo ""
echo "📝 Next Steps:"
echo "   1. Update your frontend to connect to the new backend features"
echo "   2. Configure alert thresholds and notification channels"
echo "   3. Set up ML model deployment pipeline"
echo "   4. Configure compliance reporting schedules"
echo ""

# Optional: Run health check
read -p "Would you like to run a health check? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Running health check..."
    # This would call a health check endpoint once it's implemented
    curl -s http://localhost/api/health || print_warning "Health check endpoint not yet implemented"
fi

print_success "Setup complete! Your enhanced fraud dashboard is ready to use."