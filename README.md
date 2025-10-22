# 🎙️ Gethory | [Site](https://kira14102005.dpdns.org/)


> Real-time WebRTC voice rooms with public/private access

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Gethory is a full-stack web application meticulously designed for seamless, low-latency audio communication, aiming to foster spontaneous and natural conversations online. It offers robust, secure user authentication, customizable user profiles, and a fully containerized environment. This Docker-based setup ensures a consistent, reproducible, and frictionless experience for both developers and production deployments.

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🎨 User Interface](#-user-interface)
- [🏗️ Architecture](#️-architecture)
- [📁 Directory Structure](#-directory-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Prerequisites](#-prerequisites)
- [🚀 Local Development Setup](#-local-development-setup)
- [🌐 Deployment & Branching Strategy](#-deployment--branching-strategy)
- [⚙️ Configuration](#️-configuration)
- [🔒 Security](#-security)
- [📡 API Reference](#-api-reference)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Overview

Gethory allows users to create and join real-time audio chat rooms. The application's architecture is built on three core components:

1. **WebRTC** for efficient, peer-to-peer audio streaming, which ensures low latency by routing audio directly between users.

2. A **Node.js/Express backend** that serves as the central hub for user authentication, room orchestration, API management, and as the crucial signaling server for WebRTC.

3. A **React/Redux frontend** that provides a responsive, dynamic, and interactive user experience for joining, creating, and participating in conversations.

### 🌟 Core Features

| Feature | Description |
|---------|-------------|
| 🎵 **Real-time Audio** | High-quality, low-latency audio communication leveraging peer-to-peer WebRTC connections. This bypasses server bottlenecks, streaming audio directly between clients for maximum clarity and speed. |
| 🔓 **Public and Private Rooms** | Create public rooms for anyone to discover and join, or private (group-based) rooms ideal for friends, teams, or private events. |
| 🔑 **User Authentication** | Secure, token-based user authentication with JWTs (Access & Refresh tokens). Tokens are stored in httpOnly cookies to mitigate XSS attacks. |
| ✉️ **Email Verification** | New users must verify their email address via a one-time code before they can log in, preventing spam accounts and ensuring a valid user base. |
| 👤 **User Profiles** | Customizable user profiles with avatars and personal information, allowing users to express their identity within the application. |
| 🐳 **Dockerized Environment** | The entire application is containerized with Docker. We provide separate, optimized compose files for development (with hot-reloading) and production, ensuring consistent and reproducible builds. |
| 📊 **Optimized Deployment Branches** | The repository includes pre-configured branches for different deployment scales. This showcases adaptability for various infrastructure needs, from hobbyist projects on a t3.micro to larger-scale deployments. |

---

## 🎨 User Interface

Here's a glimpse of the Gethory application:

| 🏠 Home Page | 📋 Room List | 🎤 Active Room |
|:---:|:---:|:---:|
| **Landing Page** for new users | **Browse Rooms** to see all active public conversations | **In a Room** with real-time voice chat |

---

## 🏗️ Architecture

Gethory follows a **client-server architecture** for signaling and API requests, while leveraging **peer-to-peer (P2P) connections** for the actual audio streaming. This hybrid model ensures that while user data and room logic are managed centrally by the server, the heavy lifting of audio streaming is offloaded directly to the clients. This approach is critical for enabling scalability and maintaining low-latency communication.

### 📊 System Architecture Diagram

```
┌─────────────────┐
│  React Client   │◄────REST API────►┌──────────────────┐
│   (Frontend)    │                   │  Backend API     │
└────────┬────────┘                   │ Node.js/Express  │
         │                            └────────┬─────────┘
         │                                     │
         │                                     ▼
         │                            ┌─────────────────┐
         │                            │    MongoDB      │
         │                            │   (Database)    │
         │                            └─────────────────┘
         │
         │WebSocket
         ▼
┌─────────────────┐
│ Signaling Server│
│   (Socket.IO)   │
└─────────────────┘
         │
    P2P Audio
    ◄───────►
   (WebRTC)
```

**Key Components:**
- **⚛️ React Client** - User interface and interaction layer
- **🚀 Backend API (Node.js/Express)** - Authentication, room management, API endpoints
- **🍃 MongoDB** - Persistent data storage for users, rooms, and sessions
- **🔌 Signaling Server (Socket.IO)** - WebRTC connection coordination
- **🎵 P2P Audio Streams** - Direct peer-to-peer audio communication

---

## 🔄 WebRTC Connection Flow

### Step-by-Step Flow Diagram

```
Client A                 Signaling Server              Client B
   │                            │                         │
   │─────1. Join Room──────────►│                         │
   │◄────── Joined ─────────────│                         │
   │                            │◄────1. Join Room────────│
   │                            │──────── Joined ─────────►│
   │                            │                         │
   │◄────2. add-peer───────────│                         │
   │   (ClientB, createOffer)   │                         │
   │                            │─────2. add-peer────────►│
   │                            │   (ClientA, no offer)   │
   │                            │                         │
   │─────3. relay-sdp──────────►│                         │
   │      (Offer)               │                         │
   │                            │────session-description──►│
   │                            │        (Offer)          │
   │                            │                         │
   │                            │◄────4. relay-sdp────────│
   │                            │       (Answer)          │
   │◄───session-description────│                         │
   │        (Answer)            │                         │
   │                            │                         │
   │─────5. relay-ice──────────►│                         │
   │    (ICE Candidate)         │                         │
   │                            │─────ice-candidate──────►│
   │                            │                         │
   │                            │◄────5. relay-ice────────│
   │                            │    (ICE Candidate)      │
   │◄────ice-candidate─────────│                         │
   │                            │                         │
   │◄══════════════════════════════════════════════════►│
   │          P2P Audio Stream Established               │
   │                (Direct Connection)                  │
```

### 🎯 WebRTC Flow Explained

1. **🚀 Initiation:** A user joins a room, which connects them to the Socket.IO signaling server. This establishes the vital "signaling channel" used to coordinate the connection.

2. **📡 Signaling:** The server orchestrates the connections by notifying all other clients in the room that a new peer has joined (`add-peer` event).

3. **🤝 Peer Connection:** The new client and existing clients establish direct WebRTC peer connections:
   - The new client creates an **Offer (SDP)**. The SDP (Session Description Protocol) defines the technical details of the media to be streamed, such as codecs and formats.
   - Existing peers receive this offer and create an **Answer (SDP)**.

4. **🧊 ICE Candidates:** Clients exchange ICE (Interactive Connectivity Establishment) candidates through the signaling server. ICE is a protocol used to find the best and most direct network path between two peers (e.g., a direct connection on the same network, or via a TURN server if both users are behind strict firewalls).

5. **🎵 Audio Stream:** Once P2P connections are established, audio is streamed directly between the users. The audio data bypasses the server entirely, which is the key to achieving minimal latency and reducing server load.

---

## 📁 Directory Structure

```
Gethory/
├── 📂 backend/
│   ├── 📂 @types/                    # TypeScript type definitions
│   └── 📂 src/
│       ├── 📂 config/                # 🔧 Database, Mail configuration
│       ├── 📂 constants/             # 📊 Enums, actions, environment variables
│       ├── 📂 controllers/           # 🎮 Express route handlers
│       ├── 📂 dtos/                  # 📦 Data Transfer Objects
│       ├── 📂 midwares/              # 🛡️ Authentication, error handling middleware
│       ├── 📂 models/                # 🗄️ Mongoose database models
│       ├── 📂 router/                # 🛣️ API route definitions
│       ├── 📂 services/              # ⚙️ Business logic layer
│       ├── 📂 socket/                # 🔌 Socket.IO event handlers
│       ├── 📂 storage/               # 🖼️ Default/uploaded avatars
│       └── 📂 utils/                 # 🛠️ Helper functions (JWT, hash, etc.)
├── 📂 consoleFiles/                  # 🐛 WebRTC debugging logs
├── 📂 deploy/                        # 🚀 Nginx configuration files
└── 📂 frontend/
    ├── 📂 public/                    # Static assets
    └── 📂 src/
        ├── 📂 assets/                # 🎨 Images, styles, fonts
        ├── 📂 components/            # 🧩 React components
        │   └── 📂 shared/            # ♻️ Reusable components (Buttons, Cards)
        ├── 📂 hooks/                 # 🪝 Custom React hooks (useWebRTC)
        ├── 📂 http/                  # 🌐 Axios instance & interceptors
        ├── 📂 pages/                 # 📄 Top-level route components
        ├── 📂 routes/                # 🛣️ Route definitions
        │   └── 📂 protected/         # 🔐 Route guards for auth
        ├── 📂 sockets/               # 🔌 Socket.IO client setup
        └── 📂 store/                 # 🗃️ Redux Toolkit store configuration
```

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-19-61dafb?logo=react) | 19 | UI framework for building interactive interfaces |
| ![Redux](https://img.shields.io/badge/Redux-Toolkit-764abc?logo=redux) | Latest | State management with Redux Toolkit |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript) | 5.0+ | Type-safe JavaScript development |
| ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss) | Latest | Utility-first CSS framework |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs) | 18+ | Server-side JavaScript runtime |
| ![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express) | 4.x | Web application framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript) | 5.0+ | Type-safe server development |

### Database & Storage

| Technology | Version | Purpose |
|------------|---------|---------|
| ![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47a248?logo=mongodb) | 6.0 | NoSQL database for flexible data storage |
| ![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000) | Latest | MongoDB object modeling for Node.js |

### Real-time Communication

| Technology | Version | Purpose |
|------------|---------|---------|
| ![WebRTC](https://img.shields.io/badge/WebRTC-P2P-333333?logo=webrtc) | Native | Peer-to-peer audio streaming |
| ![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?logo=socketdotio) | 4.x | WebSocket library for signaling |

### Authentication & Email

| Technology | Version | Purpose |
|------------|---------|---------|
| ![JWT](https://img.shields.io/badge/JWT-Tokens-000000?logo=jsonwebtokens) | Latest | Secure token-based authentication |
| ![Mailjet](https://img.shields.io/badge/Mailjet-API-f47920) | API | Email service provider |
| Resend | API | Alternative email service |

### DevOps & Deployment

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker) | Latest | Application containerization |
| ![Nginx](https://img.shields.io/badge/Nginx-1.x-009639?logo=nginx) | 1.x | Reverse proxy and static file serving |
| ![AWS](https://img.shields.io/badge/AWS-EC2-ff9900?logo=amazonaws) | - | Cloud hosting infrastructure |

---

## 📦 Prerequisites

Ensure you have the following installed on your development machine:

### Required Software

```bash
✅ Node.js (v18 or higher)
✅ npm (v8 or higher)
✅ Docker
✅ Docker Compose
```

### Verify Your Installation

Check your versions with these commands:

```bash
# Check Node.js version (should be v18.x.x or higher)
node --version

# Check npm version (should be 8.x.x or higher)
npm --version

# Check Docker installation
docker --version

# Check Docker Compose installation
docker-compose --version
```

### Expected Output Example

```
node --version
v18.17.0

npm --version
9.6.7

docker --version
Docker version 24.0.5, build ced0996

docker-compose --version
Docker Compose version v2.20.2
```

---

## 🚀 Local Development Setup

This project is configured to run in a containerized development environment with **hot-reloading** for both the frontend and backend. This provides a fast, iterative development experience where code changes are reflected live without needing to manually rebuild containers.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kira14102005/gethory.git
cd gethory
```

### 2️⃣ Set Up Environment Files

You must create two `.env` files for development. These files provide the necessary secrets and configuration for the services to run correctly without hard-coding sensitive data into the source code.

#### 🔧 A) Backend Environment Configuration

Create a file named `backend/.env.dev`. You can copy from the example:

```bash
cp backend/.env.dev.example backend/.env.dev
```

Then, edit `backend/.env.dev` and set your secrets (especially for JWT and email). **Note:** The `DB_URI` points to `mongodb`, which is the service name defined in `docker-compose.dev.yml`.

```bash
# backend/.env.dev

# ═══════════════════════════════════════════════════════════
# 🗄️  DATABASE CONFIGURATION
# ═══════════════════════════════════════════════════════════
# Connects to the 'mongodb' service in docker-compose.dev.yml
DB_URI="mongodb://mongodb:27017/gethory"

# ═══════════════════════════════════════════════════════════
# 🔑  JWT SECRETS
# ═══════════════════════════════════════════════════════════
# IMPORTANT: Use strong, random secrets in production
JWT_SECRET="your_very_strong_jwt_secret"
JWT_REFRESH_SECRET="your_other_strong_jwt_refresh_secret"
ACCESS_TOKEN_EXPIRY="15m"

# ═══════════════════════════════════════════════════════════
# ⚙️  SERVER CONFIGURATION
# ═══════════════════════════════════════════════════════════
PORT=3000
NODE_ENV="development"
APP_ORIGIN="http://localhost:5173"
BACKEND_URL="http://localhost:3000"

# ═══════════════════════════════════════════════════════════
# 📧  EMAIL CONFIGURATION (Mailjet)
# ═══════════════════════════════════════════════════════════
# Get your API keys from: https://app.mailjet.com/account/api_keys
MJ_APIKEY_PUBLIC='your-mailjet-public-key'
MJ_APIKEY_PRIVATE='your-mailjet-private-key'
EMAIL_SENDER="your-verified-mailjet-email@example.com"

# ═══════════════════════════════════════════════════════════
# 🖼️  AVATAR CONFIGURATION
# ═══════════════════════════════════════════════════════════
DEFAULT_AVATAR="profile.png"
```

#### 🎨 B) Frontend Environment Configuration

Create a file named `frontend/.env.dev`. You can copy from the example:

```bash
cp frontend/.env.dev.example frontend/.env.dev
```

The contents should point to your local backend and socket server. **The `VITE_` prefix is required by Vite** to expose these variables to the client-side application.

```bash
# frontend/.env.dev

# ═══════════════════════════════════════════════════════════
# 🌐  BACKEND API CONFIGURATION
# ═══════════════════════════════════════════════════════════
# API endpoint for REST requests
VITE_BACKEND_URL='http://localhost:3000/api'

# Full backend URL for Socket.IO connections
VITE_FULL_BACKEND_URL='http://localhost:3000'
```

### 3️⃣ Run with Docker Compose (Development)

Use the `-f` flag to specify the `docker-compose.dev.yml` file. This specific compose file is configured to **mount your local source code directories directly into the running containers**, which is what enables the hot-reloading magic.

```bash
# 🚀 Start all services in development mode with hot-reloading
docker-compose -f docker-compose.dev.yml up --build
```

**What happens when you run this command:**
1. Docker builds the frontend and backend images
2. Starts MongoDB container
3. Starts backend container with volume mounts for live code reloading
4. Starts frontend container with Vite dev server
5. All services are connected via Docker network

### 🎉 Services Available

Once all containers are running, the services will be available at:

| Service | URL | Description | Status Check |
|---------|-----|-------------|--------------|
| 🎨 **Frontend** | http://localhost:5173 | Vite development server with HMR | Open in browser |
| ⚡ **Backend API** | http://localhost:3000 | Express REST API server | Visit `/api` |
| 🗄️ **MongoDB** | mongodb://localhost:27017 | Database instance | Use MongoDB Compass |

### 🔍 Verify Everything is Working

```bash
# Check if all containers are running
docker ps

# View logs from all services
docker-compose -f docker-compose.dev.yml logs -f

# View logs from a specific service
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f backend
```

### 🛑 Stop Development Environment

```bash
# Stop all containers (keeps data)
docker-compose -f docker-compose.dev.yml down

# Stop and remove all data (fresh start)
docker-compose -f docker-compose.dev.yml down -v
```

---

## 🌐 Deployment & Branching Strategy

This repository is structured with two main branches for different deployment targets. This strategy allows for flexible deployments catering to different hardware capabilities and resource constraints.

### 📊 Branch Comparison

| Branch | Target Server | Build Method | RAM Required | Use Case |
|--------|---------------|--------------|--------------|----------|
| 🌟 **main** | Standard (t2.medium+) | Multi-stage Dockerfile | 4GB+ | Production, CI/CD pipelines |
| ☁️ **@aws** | Low-resource (t3.micro) | Pre-built dist folder | 1GB | Free-tier, hobbyist projects |

### 🌟 main Branch: Standard Deployment

**Target:** Standard servers (e.g., AWS EC2 t2.medium or larger)

**Method:** Uses a multi-stage `Dockerfile.prod` that builds the React frontend from source *inside* the container. This is the standard, most robust build method, as the build pipeline is self-contained.

**Files:**
- `docker-compose.prod.yml` - Production Docker Compose configuration
- `Dockerfile.prod` - Multi-stage frontend Dockerfile
- `backend/Dockerfile.prod` - Backend production Dockerfile

**Use Case:** Ideal for CI/CD pipelines and servers with enough resources (CPU/RAM) to run the `npm run build` command without issues.

#### 🚀 Deployment Steps (main branch)

```bash
# ──────────────────────────────────────────────────────────
# 1️⃣  CHECKOUT MAIN BRANCH
# ──────────────────────────────────────────────────────────
git checkout main

# ──────────────────────────────────────────────────────────
# 2️⃣  PREPARE PRODUCTION ENVIRONMENT FILES
# ──────────────────────────────────────────────────────────
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your production values

# Frontend environment
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your production values

# ──────────────────────────────────────────────────────────
# 3️⃣  BUILD AND RUN PRODUCTION CONTAINERS
# ──────────────────────────────────────────────────────────
docker-compose -f docker-compose.prod.yml up --build -d

# ──────────────────────────────────────────────────────────
# 4️⃣  VERIFY DEPLOYMENT
# ──────────────────────────────────────────────────────────
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### ☁️ @aws Branch: Low-Resource Deployment (t3.micro)

**Target:** Resource-constrained servers like AWS EC2 t3.micro (1GB RAM)

**Method:** To save RAM/CPU on the small instance, this branch **does not** build the frontend in the container. Instead, it uses a simple Nginx container and expects a **pre-built `dist` folder**. This is a key optimization for hobbyist deployments on free-tier or low-cost cloud instances where build resources are minimal.

**Why this matters:** The `npm run build` command for a React application can consume 1.5-2GB of RAM during the build process. On a t3.micro with only 1GB RAM, this causes an "Out of Memory" error and deployment failure. By building locally and deploying only the static files, we bypass this limitation entirely.

**Files:**
- `docker-compose.prod.yml` (modified for nginx-only frontend)
- `Dockerfile.prod` (Simple Nginx configuration)
- Backend uses same `backend/Dockerfile.prod`

#### 🚀 Deployment Steps (@aws branch)

```bash
# ──────────────────────────────────────────────────────────
# 1️⃣  CHECKOUT @AWS BRANCH
# ──────────────────────────────────────────────────────────
git checkout @aws

# ──────────────────────────────────────────────────────────
# 2️⃣  BUILD FRONTEND LOCALLY (On your development machine)
# ──────────────────────────────────────────────────────────
cd frontend

# Install dependencies
npm install

# Build production-ready static files
# This creates the ./frontend/dist folder with optimized assets
npm run build

# Return to project root
cd ..

# ──────────────────────────────────────────────────────────
# 3️⃣  PREPARE PRODUCTION ENVIRONMENT FILES
# ──────────────────────────────────────────────────────────
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with production values:
#   - Update DB_URI to production MongoDB
#   - Set strong JWT secrets
#   - Configure production email credentials
#   - Set APP_ORIGIN to your domain

# Frontend environment
cp frontend/.env.example frontend/.env
# Edit frontend/.env with production values:
#   - Set VITE_BACKEND_URL to your API domain
#   - Set VITE_FULL_BACKEND_URL to your backend domain

# ──────────────────────────────────────────────────────────
# 4️⃣  TRANSFER FILES TO SERVER
# ──────────────────────────────────────────────────────────
# Option A: Using rsync
rsync -avz --exclude 'node_modules' \
  ./ user@your-server:/path/to/gethory

# Option B: Using scp
scp -r ./ user@your-server:/path/to/gethory

# ──────────────────────────────────────────────────────────
# 5️⃣  DEPLOY ON SERVER
# ──────────────────────────────────────────────────────────
# SSH into your t3.micro instance
ssh user@your-server

# Navigate to project directory
cd /path/to/gethory

# Build and start containers
# This uses the pre-built frontend/dist folder
# Nginx will serve static files, backend handles API
docker-compose -f docker-compose.prod.yml up --build -d

# ──────────────────────────────────────────────────────────
# 6️⃣  VERIFY DEPLOYMENT
# ──────────────────────────────────────────────────────────
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Test the application
curl http://localhost
```

### 🔄 Branch Switching Workflow

```bash
# Switch to standard deployment
git checkout main
git pull origin main

# Switch to low-resource deployment
git checkout @aws
git pull origin @aws
```

---

## ⚙️ Configuration

All configuration is managed via environment variables. This follows the [Twelve-Factor App](https://12factor.net/config) methodology, allowing the same Docker image to be used across different environments (dev, staging, prod) simply by changing the environment context.

### 🔧 Backend Environment Variables (`backend/.env`)

| Variable | Type | Description | Example | Required |
|----------|------|-------------|---------|----------|
| `DB_URI` | String | MongoDB connection string | `mongodb://mongodb:27017/gethory` | ✅ Yes |
| `JWT_SECRET` | String | Secret key for signing JWT access tokens | `your_strong_secret_123` | ✅ Yes |
| `JWT_REFRESH_SECRET` | String | Secret key for signing JWT refresh tokens | `your_refresh_secret_456` | ✅ Yes |
| `ACCESS_TOKEN_EXPIRY` | String | Expiry time for access tokens. Short expiry (15m) is crucial for security | `15m`, `1h` | ✅ Yes |
| `PORT` | Number | Port the backend server will run on | `3000` | ✅ Yes |
| `NODE_ENV` | String | Node environment mode | `development`, `production` | ✅ Yes |
| `APP_ORIGIN` | String | Frontend URL for CORS configuration | `http://localhost:5173` | ✅ Yes |
| `BACKEND_URL` | String | Public-facing URL of the backend (used in email links) | `http://localhost:3000` | ✅ Yes |
| `MJ_APIKEY_PUBLIC` | String | Mailjet Public API Key | `abc123...` | ✅ Yes |
| `MJ_APIKEY_PRIVATE` | String | Mailjet Private API Key (keep secret!) | `xyz789...` | ✅ Yes |
| `EMAIL_SENDER` | String | "From" email address verified with Mailjet | `noreply@yourdomain.com` | ✅ Yes |
| `DEFAULT_AVATAR` | String | Filename of default avatar in `src/storage` | `profile.png` | ✅ Yes |

#### 🔒 Security Best Practices for Backend Config

```bash
# ❌ NEVER use these in production
JWT_SECRET="secret"
JWT_REFRESH_SECRET="refresh"

# ✅ ALWAYS use strong, random secrets
JWT_SECRET="a8f7d6e5c4b3a2918f7e6d5c4b3a2918"
JWT_REFRESH_SECRET="9z8y7x6w5v4u3t2s1r9z8y7x6w5v4u3t"

# Generate strong secrets with:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 🎨 Frontend Environment Variables (`frontend/.env`)

| Variable | Type | Description | Example | Required |
|----------|------|-------------|---------|----------|
| `VITE_BACKEND_URL` | String | Full URL to the backend API (includes `/api` path) | `https://yourdomain.com/api` | ✅ Yes |
| `VITE_FULL_BACKEND_URL` | String | Full URL to the backend Socket.IO server | `https://yourdomain.com` | ✅ Yes |

#### 📝 Environment-Specific Examples

**Development:**
```bash
VITE_BACKEND_URL='http://localhost:3000/api'
VITE_FULL_BACKEND_URL='http://localhost:3000'
```

**Production:**
```bash
VITE_BACKEND_URL='https://api.yourdomain.com/api'
VITE_FULL_BACKEND_URL='https://api.yourdomain.com'
```

**Production with Nginx Reverse Proxy:**
```bash
VITE_BACKEND_URL='https://yourdomain.com/api'
VITE_FULL_BACKEND_URL='https://yourdomain.com'
```

---

## 🔒 Security

Security is a top priority in Gethory. The application implements multiple layers of security to protect user data and ensure safe communication.

### 🛡️ Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Security Layers                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔐 Authentication Layer                                │
│  ├── JWT Access Tokens (15 minutes)                    │
│  ├── JWT Refresh Tokens (30 days)                      │
│  └── httpOnly, Secure Cookies                          │
│                                                         │
│  🍪 Cookie Security                                     │
│  ├── httpOnly flag (prevents XSS access)               │
│  ├── Secure flag (HTTPS only in production)            │
│  └── SameSite attribute (CSRF protection)              │
│                                                         │
│  ✉️ Email Verification                                  │
│  ├── One-time verification codes                       │
│  ├── Code expiration (24 hours)                        │
│  └── Login blocked until verified                      │
│                                                         │
│  🔄 Token Refresh Mechanism                             │
│  ├── Automatic 401 handling                            │
│  ├── Seamless token renewal                            │
│  └── Axios interceptor integration                     │
│                                                         │
│  🌐 CORS Protection                                     │
│  ├── Whitelist specific origins                        │
│  ├── Credential support enabled                        │
│  └── Controlled via APP_ORIGIN env var                 │
│                                                         │
│  🛣️ Route Authorization                                 │
│  ├── Middleware-protected endpoints                    │
│  ├── User identity verification                        │
│  └── Role-based access control                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🔑 Authentication Flow

#### Token-Based Authentication

Gethory uses a **dual-token system** with Access and Refresh tokens:

1. **Access Token (Short-lived):**
   - Expires after 15 minutes
   - Used for API requests
   - Stored in httpOnly cookie
   - Minimal exposure window if compromised

2. **Refresh Token (Long-lived):**
   - Expires after 30 days
   - Used only to obtain new access tokens
   - Stored in separate httpOnly cookie
   - Rotated on each refresh

#### Authentication Workflow

```
User Login
    ↓
┌───────────────────────────────────────┐
│  1. User submits credentials          │
│     POST /api/auth/login              │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│  2. Server validates credentials      │
│     - Check email/password            │
│     - Verify email confirmation       │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│  3. Generate JWT tokens               │
│     - Access Token (15m)              │
│     - Refresh Token (30d)             │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│  4. Set httpOnly cookies              │
│     Set-Cookie: accessToken=...       │
│     Set-Cookie: refreshToken=...      │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│  5. Client makes API requests         │
│     Authorization: Bearer <token>     │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│  6. Access token expires (401)        │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│  7. Axios interceptor triggers        │
│     GET /api/auth/refresh             │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│  8. New access token issued           │
│     Request retried automatically     │
└───────────────────────────────────────┘
```

### 🍪 Cookie Security

All authentication tokens are stored in **httpOnly cookies** with the following security flags:

```javascript
// Cookie configuration
{
  httpOnly: true,      // Prevents JavaScript access (XSS protection)
  secure: true,        // HTTPS only in production
  sameSite: 'strict',  // CSRF protection
  maxAge: 900000,      // 15 minutes for access token
  path: '/'            // Cookie scope
}
```

**Why httpOnly cookies?**
- **XSS Protection:** JavaScript cannot access the token, preventing XSS attacks from stealing credentials
- **Automatic Inclusion:** Browser automatically includes cookies in requests
- **Secure Transmission:** Tokens never exposed to client-side code

### ✉️ Email Verification System

New users must verify their email before accessing the application:

1. **Registration Process:**
   ```
   User Registers → Verification Email Sent → User Blocked from Login
   ```

2. **Verification Code:**
   - 6-digit one-time code
   - Expires after 24 hours
   - Hashed before storage
   - Single-use only

3. **Benefits:**
   - Prevents spam accounts
   - Ensures valid email addresses
   - Enables password recovery
   - Improves user quality

### 🔄 Token Refresh Mechanism

The frontend uses an Axios interceptor to handle token expiration automatically:

```javascript
// Simplified example of the refresh flow
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Access token expired, refresh it
      const { data } = await axios.get('/api/auth/refresh');
      
      // Retry the original request with new token
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);
```

**Benefits:**
- Seamless user experience (no forced re-login)
- Automatic token renewal
- No interruption to user workflow
- Maintains security with short-lived access tokens

### 🌐 CORS (Cross-Origin Resource Sharing)

The backend implements strict CORS policies:

```javascript
// CORS configuration
{
  origin: process.env.APP_ORIGIN,  // Only allow frontend domain
  credentials: true,                // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

**Production CORS setup:**
```bash
# Only allow requests from your production domain
APP_ORIGIN="https://yourdomain.com"
```

### 🛡️ Route Protection

Backend routes are protected with authentication middleware:

```javascript
// Protected route example
router.get('/api/user', authMiddleware, userController.getProfile);
```

**Middleware checks:**
1. Verify access token exists
2. Validate token signature
3. Check token expiration
4. Extract user identity
5. Attach user to request object

### 🔐 Password Security

- **Hashing:** All passwords are hashed using bcrypt with salt rounds
- **No Plain Text:** Passwords never stored in plain text
- **Strength Requirements:** Enforced on the frontend
- **No Password in Logs:** Sensitive data excluded from logging

### 📊 Security Best Practices Implemented

| Practice | Implementation | Status |
|----------|----------------|--------|
| 🔑 Strong JWT Secrets | Random 256-bit secrets | ✅ Implemented |
| ⏱️ Short Token Expiry | 15-minute access tokens | ✅ Implemented |
| 🍪 httpOnly Cookies | XSS-proof token storage | ✅ Implemented |
| ✉️ Email Verification | One-time codes | ✅ Implemented |
| 🌐 CORS Restrictions | Origin whitelist | ✅ Implemented |
| 🔒 HTTPS in Production | TLS/SSL encryption | ✅ Recommended |
| 🛡️ Input Validation | Server-side validation | ✅ Implemented |
| 🚫 SQL Injection Protection | MongoDB parameterized queries | ✅ Implemented |
| 📝 Security Headers | Helmet.js integration | ✅ Implemented |
| 🔍 Rate Limiting | API request throttling | 🟡 Recommended |

---

## 📡 API Reference

### 🌐 REST API Endpoints

#### 🔐 Authentication Endpoints

##### Register New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "isVerified": false
  }
}
```

---

##### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "johndoe",
    "avatar": "https://example.com/avatars/user_123.png"
  }
}
```

**Response (401 Unauthorized - Unverified):**
```json
{
  "success": false,
  "message": "Please verify your email before logging in"
}
```

---

##### Logout User

```http
GET /api/auth/logout
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

##### Refresh Access Token

```http
GET /api/auth/refresh
Cookie: refreshToken=<refresh_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "accessToken": "new_access_token_here"
}
```

---

##### Verify Email

```http
POST /api/auth/email/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

##### Resend Verification Email

```http
POST /api/auth/email/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

---

#### 👤 User Management Endpoints

##### Get Current User Profile

```http
GET /api/user
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": "https://example.com/avatars/user_123.png",
    "isVerified": true,
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

##### Update User Profile

```http
PUT /api/user/update_profile
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "username": "johndoe",
  "avatar": <file>
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "username": "johndoe",
    "avatar": "https://example.com/avatars/user_123.png"
  }
}
```

---

#### 🎤 Room Management Endpoints

##### Create New Room

```http
POST /api/room/create
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Tech Talk",
  "description": "Discussing latest tech trends",
  "isPrivate": false,
  "maxParticipants": 10
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "room": {
    "id": "room_456",
    "name": "Tech Talk",
    "description": "Discussing latest tech trends",
    "isPrivate": false,
    "maxParticipants": 10,
    "currentParticipants": 0,
    "creator": "user_123",
    "createdAt": "2025-01-15T11:00:00Z"
  }
}
```

---

##### Get All Public Rooms

```http
GET /api/room/fetchall
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "rooms": [
    {
      "id": "room_456",
      "name": "Tech Talk",
      "description": "Discussing latest tech trends",
      "currentParticipants": 5,
      "maxParticipants": 10,
      "creator": {
        "username": "johndoe",
        "avatar": "https://example.com/avatars/user_123.png"
      },
      "createdAt": "2025-01-15T11:00:00Z"
    },
    {
      "id": "room_789",
      "name": "Music Lovers",
      "description": "Share your favorite tracks",
      "currentParticipants": 3,
      "maxParticipants": 15,
      "creator": {
        "username": "musicfan",
        "avatar": "https://example.com/avatars/user_456.png"
      },
      "createdAt": "2025-01-15T10:45:00Z"
    }
  ]
}
```

---

##### Get Room Details

```http
GET /api/room/getroom/:id
Authorization: Bearer <access_token>
```

**Example Request:**
```http
GET /api/room/getroom/room_456
```

**Response (200 OK):**
```json
{
  "success": true,
  "room": {
    "id": "room_456",
    "name": "Tech Talk",
    "description": "Discussing latest tech trends",
    "isPrivate": false,
    "maxParticipants": 10,
    "participants": [
      {
        "id": "user_123",
        "username": "johndoe",
        "avatar": "https://example.com/avatars/user_123.png",
        "isMuted": false
      },
      {
        "id": "user_456",
        "username": "janedoe",
        "avatar": "https://example.com/avatars/user_456.png",
        "isMuted": true
      }
    ],
    "creator": "user_123",
    "createdAt": "2025-01-15T11:00:00Z"
  }
}
```

---

### 🔌 Socket.IO Events Reference

#### 📤 Client to Server Events

##### Join Room

**Event:** `join`

**Payload:**
```javascript
{
  roomId: "room_456",
  user: {
    id: "user_123",
    username: "johndoe",
    avatar: "https://example.com/avatars/user_123.png"
  }
}
```

**Description:** User joins a voice room and initiates WebRTC connection setup.

---

##### Leave Room

**Event:** `leave`

**Payload:**
```javascript
{
  roomId: "room_456"
}
```

**Description:** User explicitly leaves the room, triggering cleanup of WebRTC connections.

---

##### Relay ICE Candidate

**Event:** `relay-ice`

**Payload:**
```javascript
{
  peerId: "socket_789",
  icecandidate: {
    candidate: "candidate:1 1 UDP 2130706431 192.168.1.100 54321 typ host",
    sdpMLineIndex: 0,
    sdpMid: "0"
  }
}
```

**Description:** Relay an ICE candidate to a specific peer for NAT traversal and optimal routing.

---

##### Relay SDP (Offer/Answer)

**Event:** `relay-sdp`

**Payload:**
```javascript
{
  peerId: "socket_789",
  sessionDescription: {
    type: "offer",  // or "answer"
    sdp: "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\n..."
  }
}
```

**Description:** Relay SDP offer or answer to establish media capabilities between peers.

---

##### Mute Microphone

**Event:** `mute`

**Payload:**
```javascript
{
  roomId: "room_456",
  userId: "user_123"
}
```

**Description:** Notify all participants that the user has muted their microphone.

---

##### Unmute Microphone

**Event:** `unmute`

**Payload:**
```javascript
{
  roomId: "room_456",
  userId: "user_123"
}
```

**Description:** Notify all participants that the user has unmuted their microphone.

---

##### Share Mute Status

**Event:** `mute-info`

**Payload:**
```javascript
{
  userId: "user_123",
  isMute: true
}
```

**Description:** Share current mute status with newly joined participants.

---

#### 📥 Server to Client Events

##### Receive ICE Candidate

**Event:** `ice-candidate`

**Payload:**
```javascript
{
  peerId: "socket_789",
  icecandidate: {
    candidate: "candidate:1 1 UDP 2130706431 192.168.1.100 54321 typ host",
    sdpMLineIndex: 0,
    sdpMid: "0"
  }
}
```

**Description:** Receive ICE candidate from a peer for connection establishment.

---

##### Receive Session Description

**Event:** `session-description`

**Payload:**
```javascript
{
  peerId: "socket_789",
  sessionDescription: {
    type: "offer",  // or "answer"
    sdp: "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\n..."
  }
}
```

**Description:** Receive SDP offer or answer from a peer.

---

##### Add Peer

**Event:** `add-peer`

**Payload:**
```javascript
{
  peerId: "socket_789",
  createOffer: true,  // or false
  user: {
    id: "user_456",
    username: "janedoe",
    avatar: "https://example.com/avatars/user_456.png"
  }
}
```

**Description:** A new peer has joined the room. If `createOffer` is true, create and send an SDP offer.

---

##### Remove Peer

**Event:** `remove-peer`

**Payload:**
```javascript
{
  peerId: "socket_789",
  userId: "user_456"
}
```

**Description:** A peer has left the room. Clean up the WebRTC connection.

---

##### Peer Muted

**Event:** `mute`

**Payload:**
```javascript
{
  roomId: "room_456",
  userId: "user_456"
}
```

**Description:** A peer has muted their microphone.

---

##### Peer Unmuted

**Event:** `unmute`

**Payload:**
```javascript
{
  roomId: "room_456",
  userId: "user_456"
}
```

**Description:** A peer has unmuted their microphone.

---

### 📊 API Response Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## 🗺️ Roadmap

Future enhancements planned for Gethory:

### Phase 1: Enhanced Communication (Q2 2025)
- [ ] 🎥 **Video Chat Support** - Add video streaming alongside audio
- [ ] 💬 **Text Chat in Rooms** - Real-time messaging during voice sessions
- [ ] 🎵 **Screen/Audio Sharing** - Share your screen or system audio
- [ ] 🔊 **Spatial Audio** - 3D audio positioning for immersive experience

### Phase 2: User Experience (Q3 2025)
- [ ] 📱 **Mobile App** - React Native iOS and Android applications
- [ ] 🎨 **Custom Room Themes** - Personalize room appearance
- [ ] 🌍 **Multi-language Support** - Internationalization (i18n)
- [ ] 🔔 **Push Notifications** - Real-time notifications for room invites

### Phase 3: Advanced Features (Q4 2025)
- [ ] 👥 **User Roles & Permissions** - Moderators, speakers, listeners
- [ ] 📊 **Analytics Dashboard** - Room statistics and user metrics
- [ ] 🎙️ **Audio Recording** - Record room sessions (with consent)
- [ ] 🤖 **AI Transcription** - Real-time speech-to-text

### Phase 4: Enterprise Features (2026)
- [ ] 🏢 **Organization Accounts** - Multi-user team management
- [ ] 📅 **Scheduled Rooms** - Calendar integration
- [ ] 💳 **Premium Subscriptions** - Advanced features tier
- [ ] 🔗 **Integrations** - Slack, Discord, Calendar APIs

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or feedback, your help is appreciated.

### 🌟 How to Contribute

1. **🍴 Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   # Then clone your fork
   git clone https://github.com/YOUR_USERNAME/gethory.git
   cd gethory
   ```

2. **🌿 Create a Feature Branch**
   ```bash
   # Create a descriptive branch name
   git checkout -b feature/amazing-new-feature
   
   # Or for bug fixes
   git checkout -b fix/issue-description
   ```

3. **💻 Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **✅ Test Your Changes**
   ```bash
   # Run the development environment
   docker-compose -f docker-compose.dev.yml up
   
   # Test your changes thoroughly
   # Ensure no existing functionality breaks
   ```

5. **💾 Commit Your Changes**
   ```bash
   # Stage your changes
   git add .
   
   # Write a clear commit message
   git commit -m "feat: Add amazing new feature"
   
   # Follow conventional commits format:
   # feat: New feature
   # fix: Bug fix
   # docs: Documentation changes
   # style: Code style changes
   # refactor: Code refactoring
   # test: Test additions or changes
   # chore: Build process or auxiliary tool changes
   ```

6. **📤 Push to Your Fork**
   ```bash
   git push origin feature/amazing-new-feature
   ```

7. **🔀 Open a Pull Request**
   - Go to the original Gethory repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template with:
     - Description of changes
     - Related issue numbers
     - Screenshots (if UI changes)
     - Testing steps

### 📋 Contribution Guidelines

- **Code Quality:** Write clean, maintainable code with proper TypeScript types
- **Documentation:** Update README and comments for significant changes
- **Testing:** Ensure your changes don't break existing functionality
- **Commit Messages:** Use conventional commits format
- **Pull Requests:** Provide clear descriptions and context

### 🐛 Reporting Bugs

Found a bug? Please [open an issue](https://github.com/kira14102005/gethory/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or error logs if applicable

### 💡 Suggesting Features

Have an idea? [Open a feature request](https://github.com/kira14102005/gethory/issues) with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Any relevant examples or mockups

---

## 📄 License

This project is licensed under the **MIT License**.

### MIT License

```
MIT License

Copyright (c) 2025 Gethory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the [LICENSE](https://github.com/kira14102005/gethory/blob/main/LICENSE) file for full details.

---

<div align="center">

## 🌟 Built with ❤️ by the Gethory Team

### Connect With Us

[![GitHub](https://img.shields.io/badge/GitHub-Gethory-181717?logo=github)](https://github.com/kira14102005/gethory)
[![Issues](https://img.shields.io/github/issues/kira14102005/gethory)](https://github.com/kira14102005/gethory/issues)
[![Stars](https://img.shields.io/github/stars/kira14102005/gethory)](https://github.com/kira14102005/gethory/stargazers)
[![License](https://img.shields.io/github/license/kira14102005/gethory)](https://github.com/kira14102005/gethory/blob/main/LICENSE)

---

**[⭐ Star us on GitHub](https://github.com/kira14102005/gethory)** | **[🐛 Report Bug](https://github.com/kira14102005/gethory/issues)** | **[💡 Request Feature](https://github.com/kira14102005/gethory/issues)**

---

### Show Your Support

If you find Gethory helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🔀 Contributing code
- 📢 Sharing with others

---

*Made with passion for real-time communication*

</div>
