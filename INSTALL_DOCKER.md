# Installing Docker on Windows

## Step 1: Install Docker Desktop

1. **Download Docker Desktop for Windows:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - The installer will be downloaded (Docker Desktop Installer.exe)

2. **Run the Installer:**
   - Double-click the downloaded installer
   - Follow the installation wizard
   - Make sure "Use WSL 2 instead of Hyper-V" is checked (recommended for Windows 10/11)
   - Click "OK" when prompted

3. **Restart Your Computer:**
   - Docker Desktop requires a restart to complete installation
   - Restart your computer when prompted

4. **Start Docker Desktop:**
   - After restart, launch Docker Desktop from the Start menu
   - Wait for Docker to start (you'll see a whale icon in the system tray)
   - Docker Desktop may take a minute or two to fully start

## Step 2: Verify Installation

Open PowerShell and run:

```powershell
# Check Docker version
docker --version

# Check Docker Compose version (new syntax)
docker compose version

# Or check old syntax (if available)
docker-compose --version
```

## Step 3: Build and Run Your Application

Once Docker is installed and running, navigate to your project directory:

```powershell
cd C:\Users\Akash\OneDrive\Desktop\infsys\LLM_BATCH_3_FRONTEND_TEAM_B

# Build and run with Docker Compose (new syntax)
docker compose up -d

# Or if you have the old docker-compose installed
docker-compose up -d
```

## Alternative: Using Docker Directly

If you prefer not to use Docker Compose:

```powershell
# Build the image
docker build -t fraud-dashboard-frontend .

# Run the container
docker run -d -p 3000:80 --name fraud-dashboard-frontend fraud-dashboard-frontend
```

## Troubleshooting

### Docker Desktop won't start
- Make sure virtualization is enabled in your BIOS
- Check Windows Features: Enable "Virtual Machine Platform" and "Windows Subsystem for Linux"
- Restart your computer

### WSL 2 not found
- Install WSL 2: Open PowerShell as Administrator and run:
  ```powershell
  wsl --install
  ```
- Restart your computer after installation

### Port already in use
- If port 3000 is already in use, change it in `docker-compose.yml`:
  ```yaml
  ports:
    - "8080:80"  # Use port 8080 instead
  ```

## System Requirements

- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
- Windows 11 64-bit: Home or Pro version 21H2 or higher
- WSL 2 feature enabled
- Virtualization enabled in BIOS

## Quick Commands Reference

```powershell
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f frontend

# Rebuild and restart
docker compose up -d --build

# Remove everything
docker compose down -v
```

