# Gethory

Real-time WebRTC voice rooms with public/private access. Gethory is a
full-stack web application meticulously designed for seamless,
low-latency audio communication, aiming to foster spontaneous and
natural conversations online. It offers robust, secure user
authentication, customizable user profiles, and a fully containerized
environment. This Docker-based setup ensures a consistent, reproducible,
and frictionless experience for both developers and production
deployments.

## Table of Contents

- [[Overview]{.underline}](#fh6dva846lvi)

- [[User Interface]{.underline}](#35t7bvo2j4ww)

- [[Architecture]{.underline}](#r3cpfp3ofdkv)

- [[Directory Structure]{.underline}](#ca5qemu9841d)

- [[Tech Stack]{.underline}](#ax2c94wp2a31)

- [[Prerequisites]{.underline}](#c5jdjesv7ddg)

- [[Local Development Setup]{.underline}](#a7inkja78azj)

- [[Deployment & Branching Strategy]{.underline}](#jbeb7tys8rwp)

- [[Configuration]{.underline}](#rfzeyy54tgc9)

- [[Security]{.underline}](#buqa9o422zsf)

- [[API Reference]{.underline}](#meek9li1tbvs)

- [[Roadmap]{.underline}](#luxbs54sm5ri)

- [[Contributing]{.underline}](#b6j24hzhxoz0)

- [[License]{.underline}](#j5kqaksz4jau)

## Overview

Gethory allows users to create and join real-time audio chat rooms. The
application\'s architecture is built on three core components:

1.  **WebRTC** for efficient, peer-to-peer audio streaming, which
    > ensures low latency by routing audio directly between users.

2.  A **Node.js/Express backend** that serves as the central hub for
    > user authentication, room orchestration, API management, and as
    > the crucial signaling server for WebRTC.

3.  A **React/Redux frontend** that provides a responsive, dynamic, and
    > interactive user experience for joining, creating, and
    > participating in conversations.

### Core Features

- **Real-time Audio:** High-quality, low-latency audio communication
  > leveraging peer-to-peer WebRTC connections. This bypasses server
  > bottlenecks, streaming audio directly between clients for maximum
  > clarity and speed.

- **Public and Private Rooms:** Create public rooms for anyone to
  > discover and join, or private (group-based) rooms ideal for friends,
  > teams, or private events.

- **User Authentication:** Secure, token-based user authentication with
  > JWTs (Access & Refresh tokens). Tokens are stored in httpOnly
  > cookies to mitigate XSS attacks.

- **Email Verification:** New users must verify their email address via
  > a one-time code before they can log in, preventing spam accounts and
  > ensuring a valid user base.

- **User Profiles:** Customizable user profiles with avatars and
  > personal information, allowing users to express their identity
  > within the application.

- **Dockerized Environment:** The entire application is containerized
  > with Docker. We provide separate, optimized compose files for
  > development (with hot-reloading) and production, ensuring consistent
  > and reproducible builds.

- **Optimized Deployment Branches:** The repository includes
  > pre-configured branches for different deployment scales. This
  > showcases adaptability for various infrastructure needs, from
  > hobbyist projects on a t3.micro to larger-scale deployments.

## User Interface

Here\'s a glimpse of the Gethory application.

| **Home Page**                   | **Room List**                                            | **Active Room**                          |
|---------------------------------|----------------------------------------------------------|------------------------------------------|
|                                 |                                                          |                                          |
| **Landing Page** for new users. | **Browse Rooms** to see all active public conversations. | **In a Room** with real-time voice chat. |

## Architecture

Gethory follows a client-server architecture for signaling and API
requests, while leveraging peer-to-peer (P2P) connections for the actual
audio streaming. This hybrid model ensures that while user data and room
logic are managed centrally by the server, the heavy lifting of audio
streaming is offloaded directly to the clients. This approach is
critical for enabling scalability and maintaining low-latency
communication.

graph TD  
A\[React Client\] \<\--\> B\[Backend API (Node.js/Express)\];  
B \<\--\> C\[MongoDB\];  
A \<\--\> D\[Signaling Server (Socket.IO)\];

### WebRTC Flow

1.  **Initiation:** A user joins a room, which connects them to the
    > Socket.IO signaling server. This establishes the vital \"signaling
    > channel\" used to coordinate the connection.

2.  **Signaling:** The server orchestrates the connections by notifying
    > all other clients in the room that a new peer has joined
    > (add-peer).

3.  **Peer Connection:** The new client and existing clients establish
    > direct WebRTC peer connections.

    - The new client creates an **Offer (SDP)**. The SDP (Session
      > Description Protocol) defines the technical details of the media
      > to be streamed, such as codecs and formats.

    - Existing peers receive this offer and create an **Answer (SDP)**.

4.  **ICE Candidates:** Clients exchange ICE (Interactive Connectivity
    > Establishment) candidates through the signaling server. ICE is a
    > protocol used to find the best and most direct network path
    > between two peers (e.g., a direct connection on the same network,
    > or via a TURN server if both users are behind strict firewalls).

5.  **Audio Stream:** Once P2P connections are established, audio is
    > streamed directly between the users. The audio data bypasses the
    > server entirely, which is the key to achieving minimal latency and
    > reducing server load.

sequenceDiagram  
participant ClientA  
participant SignalingServer  
participant ClientB  
  
ClientA-\>\>SignalingServer: Join Room (roomId, user)  
SignalingServer\--\>\>ClientA: Joined  
ClientB-\>\>SignalingServer: Join Room (roomId, user)  
SignalingServer\--\>\>ClientB: Joined  
  
SignalingServer-\>\>ClientA: add-peer (peerId: ClientB, createOffer:
true)  
SignalingServer-\>\>ClientB: add-peer (peerId: ClientA, createOffer:
false)  
  
ClientA-\>\>SignalingServer: relay-sdp (peerId: ClientB,
sessionDescription: Offer)  
SignalingServer-\>\>ClientB: session-description (peerId: ClientA,
sessionDescription: Offer)  
  
ClientB-\>\>SignalingServer: relay-sdp (peerId: ClientA,
sessionDescription: Answer)  
SignalingServer-\>\>ClientA: session-description (peerId: ClientB,
sessionDescription: Answer)  
  
ClientA-\>\>SignalingServer: relay-ice (peerId: ClientB, icecandidate)  
SignalingServer-\>\>ClientB: ice-candidate (peerId: ClientA,
icecandidate)  
  
ClientB-\>\>SignalingServer: relay-ice (peerId: ClientA, icecandidate)  
SignalingServer-\>\>ClientA: ice-candidate (peerId: ClientB,
icecandidate)  
  
ClientA\<-\>\>ClientB: Peer-to-Peer Audio Stream Established

## Directory Structure

Gethory/  
├───backend/  
│ ├───@types/  
│ └───src/  
│ ├───config/ \# DB, Mail, etc.  
│ ├───constants/ \# Enums, actions, env vars  
│ ├───controllers/ \# Express route handlers  
│ ├───dtos/ \# Data Transfer Objects  
│ ├───midwares/ \# Authentication, error handling  
│ ├───models/ \# Mongoose models  
│ ├───router/ \# API routes  
│ ├───services/ \# Business logic  
│ ├───socket/ \# Socket.IO handlers  
│ ├───storage/ \# Default/uploaded avatars  
│ └───utils/ \# Helpers (JWT, hash, etc.)  
├───consoleFiles/ \# WebRTC debugging logs  
├───deploy/ \# Nginx configs  
└───frontend/  
├───public/  
└───src/  
├───assets/  
├───components/  
│ └───shared/ \# Reusable components (Buttons, Cards)  
├───hooks/ \# Custom hooks (useWebRTC)  
├───http/ \# Axios instance & interceptors  
├───pages/ \# Top-level route components  
├───routes/  
│ └───protected/ \# Route guards  
├───sockets/ \# Socket.IO client setup  
└───store/ \# Redux Toolkit store

## Tech Stack

| **Category**         | **Technology**                                    |
|----------------------|---------------------------------------------------|
| **Frontend**         | React 19, Redux Toolkit, TypeScript, Tailwind CSS |
| **Backend**          | Node.js, Express, TypeScript                      |
| **Database**         | MongoDB (with Mongoose)                           |
| **Realtime**         | WebRTC, Socket.IO                                 |
| **Authentication**   | JWT (Access/Refresh Tokens), httpOnly Cookies     |
| **Email**            | Mailjet / Resend                                  |
| **Containerization** | Docker, Docker Compose                            |
| **Deployment**       | Nginx, AWS EC2                                    |

## Prerequisites

- Node.js (v18 or higher)

- npm (v8 or higher)

- Docker

- Docker Compose

## Local Development Setup

This project is configured to run in a containerized development
environment with **hot-reloading** for both the frontend and backend.
This provides a fast, iterative development experience where code
changes are reflected live without needing to manually rebuild
containers.

### 1. Clone the Repository {#clone-the-repository}

git clone
\[https://github.com/kira14102005/gethory.git\](https://github.com/kira14102005/gethory.git)  
cd gethory

### 2. Set Up Environment Files {#set-up-environment-files}

You must create two .env files for development. These files provide the
necessary secrets and configuration for the services to run correctly
without hard-coding sensitive data into the source code.

**A) Backend Environment**

Create a file named backend/.env.dev. You can copy the example:

cp backend/.env.dev.example backend/.env.dev

Then, edit backend/.env.dev and set your secrets (especially for JWT and
email). Note that the DB_URI points to mongodb, which is the service
name defined in docker-compose.dev.yml.

\# backend/.env.dev  
  
\# Database (connects to the \'mongodb\' service in
docker-compose.dev.yml)  
DB_URI=\"mongodb://mongodb:27017/gethory\"  
  
\# JWT Secrets  
JWT_SECRET=\"your_very_strong_jwt_secret\"  
JWT_REFRESH_SECRET=\"your_other_strong_jwt_refresh_secret\"  
ACCESS_TOKEN_EXPIRY=\"15m\"  
  
\# Server Configuration  
PORT=3000  
NODE_ENV=\"development\"  
APP_ORIGIN=\"http://localhost:5173\"  
BACKEND_URL=\"http://localhost:3000\"  
  
\# Email (Mailjet)  
MJ_APIKEY_PUBLIC = \'your-mailjet-public-key\'  
MJ_APIKEY_PRIVATE = \'your-mailjet-private-key\'  
EMAIL_SENDER=\"your-verified-mailjet-email@example.com\"  
  
DEFAULT_AVATAR=\"profile.png\"

**B) Frontend Environment**

Create a file named frontend/.env.dev. You can copy the example:

cp frontend/.env.dev.example frontend/.env.dev

The contents should point to your local backend and socket server. The
VITE\_ prefix is required by Vite to expose these variables to the
client-side application.

\# frontend/.env.dev  
VITE_BACKEND_URL = \'http://localhost:3000/api\'  
VITE_FULL_BACKEND_URL = \'http://localhost:3000\'

### 3. Run with Docker Compose (Development) {#run-with-docker-compose-development}

Use the -f flag to specify the docker-compose.dev.yml file. This
specific compose file is configured to mount your local source code
directories directly into the running containers, which is what enables
the hot-reloading magic.

docker-compose -f docker-compose.dev.yml up \--build

The services will be available at:

- **Frontend (Vite):** http://localhost:5173

- **Backend (Node):** http://localhost:3000

- **MongoDB:** mongodb://localhost:27017

## Deployment & Branching Strategy {#deployment-branching-strategy}

This repository is structured with two main branches for different
deployment targets. This strategy allows for flexible deployments
catering to different hardware capabilities and resource constraints.

### main Branch: Standard Deployment

- **Target:** Standard servers (e..g., AWS EC2 t2.medium or larger).

- **Method:** Uses a multi-stage Dockerfile.prod that builds the React
  > frontend from source *inside* the container. This is the standard,
  > most robust build method, as the build pipeline is self-contained.

- **Files:** docker-compose.prod.yml, Dockerfile.prod,
  > backend/Dockerfile.prod.

- **Use Case:** Ideal for CI/CD pipelines and servers with enough
  > resources (CPU/RAM) to run the npm run build command without issues.

### @aws Branch: Low-Resource Deployment (t3.micro) {#aws-branch-low-resource-deployment-t3.micro}

- **Target:** Resource-constrained servers like AWS EC2 t3.micro.

- **Method:** To save RAM/CPU on the small instance, this branch **does
  > not** build the frontend in the container. Instead, it uses a simple
  > Nginx container and expects a **pre-built dist folder**. This is a
  > key optimization for hobbyist deployments on free-tier or low-cost
  > cloud instances where build resources are minimal.

- **Files:** docker-compose.prod.yml (modified), Dockerfile.prod (Nginx
  > only).

#### Deployment Steps for @aws (t3.micro) {#deployment-steps-for-aws-t3.micro}

1.  **Checkout the branch:**  
    > git checkout @aws

2.  **Build Frontend Locally:** You must build the production-ready
    > frontend on your local machine first. This pre-compiles all
    > React/TS code into static HTML, CSS, and JS files.  
    > cd frontend  
    > npm install  
    > npm run build  
    > \# This creates the ./frontend/dist folder  
    > cd ..

3.  **Prepare Production Environment:** Copy and fill in the production
    > .env files (backend/.env and frontend/.env) on your server. Use
    > the .env.example files as templates.

4.  **Build and Run Docker Compose:** On your t3.micro server (which now
    > has the code and the frontend/dist folder), run:  
    > \# This will build the backend image and use a simple Nginx
    > image  
    > \# to serve the static files from ./frontend/dist  
    > docker-compose -f docker-compose.prod.yml up \--build -d  
    >   
    > This approach avoids an \"Out of Memory\" error during the npm run
    > build step on the small server. Nginx will then serve the static
    > files from frontend/dist while the backend container runs the API.

## Configuration

All configuration is managed via environment variables. This follows the
[[Twelve-Factor App]{.underline}](https://12factor.net/config)
methodology, allowing the same Docker image to be used across different
environments (dev, staging, prod) simply by changing the environment
context.

### Backend (backend/.env) {#backend-backend.env}

| **Variable**        | **Description**                                                                                                    |
|---------------------|--------------------------------------------------------------------------------------------------------------------|
| DB_URI              | Connection string for MongoDB.                                                                                     |
| JWT_SECRET          | Secret key for signing JWT access tokens.                                                                          |
| JWT_REFRESH_SECRET  | Secret key for signing JWT refresh tokens.                                                                         |
| ACCESS_TOKEN_EXPIRY | Expiry time for access tokens (e.g., 15m for 15 minutes or 1h for 1 hour). A short expiry is crucial for security. |
| PORT                | Port the backend server will run on.                                                                               |
| NODE_ENV            | development or production.                                                                                         |
| APP_ORIGIN          | The URL of the frontend (for CORS).                                                                                |
| BACKEND_URL         | Public-facing URL of the backend (for email links).                                                                |
| MJ_APIKEY_PUBLIC    | Mailjet Public API Key.                                                                                            |
| MJ_APIKEY_PRIVATE   | Mailjet Private API Key.                                                                                           |
| EMAIL_SENDER        | \"From\" email address verified with Mailjet.                                                                      |
| DEFAULT_AVATAR      | Filename of the default avatar in src/storage.                                                                     |

### Frontend (frontend/.env) {#frontend-frontend.env}

| **Variable**          | **Description**                                                           |
|-----------------------|---------------------------------------------------------------------------|
| VITE_BACKEND_URL      | The full URL to the backend API (e.g., https://yourdomain.com/api).       |
| VITE_FULL_BACKEND_URL | The full URL to the backend socket server (e.g., https://yourdomain.com). |

## Security

- **Authentication:** Handled with JWTs. Short-lived Access Tokens (15m)
  > and long-lived Refresh Tokens (30d) are stored in httpOnly, secure
  > cookies, making them inaccessible to client-side JavaScript.

- **Token Refresh:** The axios interceptor automatically handles 401
  > errors by using the Refresh Token to request a new Access Token,
  > providing a seamless user session.

- **Authorization:** Backend middleware protects routes, ensuring only
  > authenticated users can access resources like profiles and rooms.

- **Email Verification:** New users are blocked from logging in until
  > they verify their email, preventing spam signups.

- **CORS:** The backend uses cors middleware to restrict requests to the
  > APP_ORIGIN.

## API Reference

### REST API

| **Endpoint**                        | **Method** | **Auth**      | **Description**                                  |
|-------------------------------------|------------|---------------|--------------------------------------------------|
| /api/auth/register                  | POST       | No            | Register a new user.                             |
| /api/auth/login                     | POST       | No            | Log in a user.                                   |
| /api/auth/logout                    | GET        | Yes           | Log out a user (clears cookies).                 |
| /api/auth/refresh                   | GET        | Yes (Refresh) | Get a new access token.                          |
| /api/auth/email/verify              | POST       | No            | Verify email with code.                          |
| /api/auth/email/resend-verification | POST       | No            | Resend verification email.                       |
| /api/user                           | GET        | Yes           | Get the current user\'s profile.                 |
| /api/user/update_profile            | PUT        | Yes           | Complete profile setup (name, username, avatar). |
| /api/room/create                    | POST       | Yes           | Create a new room.                               |
| /api/room/fetchall                  | GET        | Yes           | Get a list of all public rooms.                  |
| /api/room/getroom/:id               | GET        | Yes           | Get details for a single room.                   |

### Socket.IO Events {#socket.io-events}

| **Event**           | **Direction** | **Description**                               | **Payload**                                            |
|---------------------|---------------|-----------------------------------------------|--------------------------------------------------------|
| join                | C → S         | A user joins a room.                          | { roomId: string, user: object }                       |
| leave               | C → S         | A user explicitly leaves a room.              | { roomId: string }                                     |
| relay-ice           | C → S         | Relay an ICE candidate to a specific peer.    | { peerId: string, icecandidate: object }               |
| relay-sdp           | C → S         | Relay an SDP offer/answer to a specific peer. | { peerId: string, sessionDescription: object }         |
| ice-candidate       | S → C         | An ICE candidate from a peer.                 | { peerId: string, icecandidate: object }               |
| session-description | S → C         | An SDP offer/answer from a peer.              | { peerId: string, sessionDescription: object }         |
| add-peer            | S → C         | A new peer has joined the room.               | { peerId: string, createOffer: boolean, user: object } |
| remove-peer         | S → C         | A peer has left the room.                     | { peerId: string, userId: string }                     |
| mute                | C ↔ S ↔ C     | A user mutes their microphone.                | { roomId: string, userId: string }                     |
| unmute              | C ↔ S ↔ C     | A user unmutes their microphone.              | { roomId: string, userId: string }                     |
| mute-info           | C → S → C     | Relays mute status to new joiners.            | { userId: string, isMute: boolean }                    |

## Contributing

Contributions are welcome! Please fork the repository and submit a pull
request.

## License

This project is licensed under the MIT License. See the
[[LICENSE]{.underline}](https://github.com/kira14102005/gethory/blob/main/LICENSE)
file for details.
