# PureFit Customs — Server Startup Guide

This guide describes how to run the complete local environment (MongoDB, Backend, and Frontend) for the **PureFit Customs** application.

---

## 1. Prerequisites Setup

Before starting the services, we set up local Python virtual environments and installed Node packages.

### Backend Virtual Environment & Dependencies
```bash
# Create a virtual environment for the Python backend
python3 -m venv backend/venv

# Activate the virtual environment
source backend/venv/bin/activate

# Install the backend requirements (excluding environment-specific helper packages)
pip install -r backend/requirements.txt
```

### Frontend Dependencies
```bash
# Install frontend dependencies (with legacy peer dependency resolution)
cd frontend
npm install --legacy-peer-deps
npm install ajv --legacy-peer-deps
cd ..
```

---

## 2. Startup Commands

Always start the services in the following order:

### Step 1: Start MongoDB
Because rootless Podman/Docker requires advanced user namespace configuration, we run a standalone MongoDB instance in user space:
```bash
# Create a local data directory for MongoDB
mkdir -p mongodb/data

# Start MongoDB on default port 27017
./mongodb/bin/mongod --dbpath ./mongodb/data --port 27017
```
*(Leave this running in a terminal or run with `&` in the background).*

### Step 2: Start the FastAPI Backend Server
Ensure that the `backend/.env` file is created with the database configuration before launching:
```bash
# Navigate to the backend directory
cd backend

# Start the FastAPI server on port 8000 using Uvicorn
../backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```
*(Leave this running in a terminal).*

### Step 3: Start the React Frontend Dev Server
Start the frontend development server and link it to the local backend port:
```bash
# Navigate to the frontend directory
cd frontend

# Run the frontend server on port 3000 without automatically opening a browser
BROWSER=none REACT_APP_BACKEND_URL=http://localhost:8000 npm start
```

---

## 3. Active Local Ports

Once all servers are running, the following services are active:
*   **MongoDB Database**: `mongodb://localhost:27017`
*   **FastAPI Backend**: `http://localhost:8000` (API routes under `/api`)
*   **React Frontend**: `http://localhost:3000`
