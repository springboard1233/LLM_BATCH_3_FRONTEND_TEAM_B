@echo off
REM Enhanced Fraud Dashboard Services Startup Script for Windows

echo 🚀 Starting Enhanced Fraud Dashboard Services...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] docker-compose is not installed. Please install docker-compose first.
    pause
    exit /b 1
)

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist "nginx\ssl" mkdir "nginx\ssl"
if not exist "LLM_BATCH_3_BACKEND_TEAM_B\logs" mkdir "LLM_BATCH_3_BACKEND_TEAM_B\logs"
if not exist "LLM_BATCH_3_BACKEND_TEAM_B\models" mkdir "LLM_BATCH_3_BACKEND_TEAM_B\models"
if not exist "data\redis" mkdir "data\redis"
if not exist "data\influxdb" mkdir "data\influxdb"
if not exist "data\elasticsearch" mkdir "data\elasticsearch"

REM Copy environment file if it doesn't exist
if not exist ".env" (
    echo [WARNING] .env file not found. Copying from .env.example...
    copy ".env.example" ".env"
    echo [WARNING] Please update the .env file with your configuration before proceeding.
    pause
)

REM Stop any existing containers
echo [INFO] Stopping existing containers...
docker-compose -f docker-compose.enhanced.yml down --remove-orphans

REM Pull latest images
echo [INFO] Pulling latest Docker images...
docker-compose -f docker-compose.enhanced.yml pull

REM Build custom images
echo [INFO] Building custom images...
docker-compose -f docker-compose.enhanced.yml build

REM Start infrastructure services first
echo [INFO] Starting infrastructure services (Redis, InfluxDB, Elasticsearch)...
docker-compose -f docker-compose.enhanced.yml up -d redis influxdb elasticsearch

REM Wait for services to be ready
echo [INFO] Waiting for infrastructure services to be ready...
timeout /t 30 /nobreak >nul

REM Check if Redis is ready
echo [INFO] Checking Redis connection...
docker-compose -f docker-compose.enhanced.yml exec -T redis redis-cli ping | findstr "PONG" >nul
if errorlevel 1 (
    echo [ERROR] Redis is not responding
    pause
    exit /b 1
) else (
    echo [SUCCESS] Redis is ready
)

REM Start application services
echo [INFO] Starting application services (Celery, Nginx)...
docker-compose -f docker-compose.enhanced.yml up -d celery-worker celery-beat nginx

REM Wait for application services
timeout /t 10 /nobreak >nul

REM Check service status
echo [INFO] Checking service status...
docker-compose -f docker-compose.enhanced.yml ps

REM Display service URLs
echo.
echo [SUCCESS] Enhanced Fraud Dashboard Services Started Successfully!
echo.
echo 📊 Service URLs:
echo    Frontend (via Nginx): http://localhost
echo    Backend API (via Nginx): http://localhost/api
echo    InfluxDB UI: http://localhost:8086
echo    Elasticsearch: http://localhost:9200
echo    Redis: localhost:6379
echo.
echo 🔧 Management Commands:
echo    View logs: docker-compose -f docker-compose.enhanced.yml logs -f [service_name]
echo    Stop services: docker-compose -f docker-compose.enhanced.yml down
echo    Restart service: docker-compose -f docker-compose.enhanced.yml restart [service_name]
echo.
echo 📝 Next Steps:
echo    1. Update your frontend to connect to the new backend features
echo    2. Configure alert thresholds and notification channels
echo    3. Set up ML model deployment pipeline
echo    4. Configure compliance reporting schedules
echo.

echo [SUCCESS] Setup complete! Your enhanced fraud dashboard is ready to use.
pause