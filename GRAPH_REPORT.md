# Graph Report - Gethory  (2026-10-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 605 nodes · 1298 edges · 40 communities (28 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.85)
- Token cost: 1,463 input · 376 output

## Graph Freshness
- Built from commit: `5f21e4d9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- React App Core
- UI Components
- Frontend Dependencies
- WebRTC Hooks
- Common UI Elements
- HTTP Status Codes
- Auth Controllers
- Backend Configuration
- Room Management
- Frontend TypeScript Config
- Server Entry Point
- Auth Services
- Frontend Dev Dependencies
- Node TypeScript Config
- Environment Variables
- Backend Dependencies
- Email Services
- User Management
- Backend Type Definitions
- Session Management
- Socket.IO Integration
- Backend TypeScript Config
- Project Documentation
- Session Controllers
- Zod Validation Schemas
- NPM Scripts
- Verification Types
- Password Hashing
- Frontend Project References
- Deployment Configuration
- Frontend Assets
- Profile Assets
- Logo Assets
- Social Icons
- Google Auth Icons
- Placeholder Assets
- Frontend Documentation

## God Nodes (most connected - your core abstractions)
1. `HTTP` - 29 edges
2. `appAssert()` - 26 edges
3. `react` - 23 edges
4. `react-router-dom` - 22 edges
5. `compilerOptions` - 19 edges
6. `App()` - 17 edges
7. `selectUser()` - 17 edges
8. `compilerOptions` - 17 edges
9. `react-redux` - 16 edges
10. `DarkButton()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Application Screenshot 2` --references--> `React Client`  [INFERRED]
  frontend/public/ss2.jpg → README.md
- `Application Screenshot 1` --references--> `React Client`  [INFERRED]
  frontend/public/ss.jpg → README.md
- `Docker Compose Dev` --references--> `Backend API`  [INFERRED]
  docker-compose.dev.yml → README.md
- `Docker Compose Dev` --references--> `MongoDB`  [INFERRED]
  docker-compose.dev.yml → README.md
- `Docker Compose Prod` --references--> `NGINX`  [INFERRED]
  docker-compose.prod.yml → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dockerized Services** — mongodb [EXTRACTED 1.00]
- **Gethory Core Architecture** — react_client, backend_api, mongodb, signaling_server [EXTRACTED 1.00]

## Communities (40 total, 12 thin omitted)

### Community 0 - "React App Core"
Cohesion: 0.06
Nodes (56): App(), AnimatedPage(), pageTransition, pageVariants, AppInitializer(), LoginSubmitButton(), SigninButton(), TitleCard() (+48 more)

### Community 1 - "UI Components"
Cohesion: 0.08
Nodes (43): ButtonProps, ButtonWithLogo(), ButtonWithLogoProps, CreateRoomButton(), DarkButton(), LightButton(), CardProps, CustomBox() (+35 more)

### Community 2 - "Frontend Dependencies"
Cohesion: 0.05
Nodes (46): typescript, dependencies, axios, @emotion/react, @emotion/styled, framer-motion, @mui/icons-material, @mui/material (+38 more)

### Community 3 - "WebRTC Hooks"
Cohesion: 0.11
Nodes (19): useStateWithCallback(), AudioInterface, ClientInterface, ConnectionInterface, joineeDummyData, useWebRTC(), AudioInterface, ClientInterface (+11 more)

### Community 4 - "Common UI Elements"
Cohesion: 0.11
Nodes (20): AvatarComponent(), LighttitleCard(), CentralLoader(), AuthInput(), Loader1(), Loader2(), Loader3(), StyledWrapper (+12 more)

### Community 5 - "HTTP Status Codes"
Cohesion: 0.11
Nodes (20): HTTP, BAD_REQUEST, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, MEDIA_TYPE_NOT_SUPPORTED, NO_CONTENT, NOT_ACCEPTABLE (+12 more)

### Community 6 - "Auth Controllers"
Cohesion: 0.17
Nodes (22): loginController, logoutController, refreshController, registerController, resendEmailVerificationController, resetPasswordController, sendPasswordResetEmailController, verifyController (+14 more)

### Community 7 - "Backend Configuration"
Cohesion: 0.09
Nodes (22): author, description, keywords, license, main, name, type, version (+14 more)

### Community 8 - "Room Management"
Cohesion: 0.18
Nodes (15): fetchAllRoomController, getRoomController, roomCreateController, RoomDto(), RoomModel, RoomModelDocument, roomModelSchema, RoomType (+7 more)

### Community 9 - "Frontend TypeScript Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 10 - "Server Entry Point"
Cohesion: 0.12
Nodes (11): connecttoDb(), APP_ORIGIN, DB_URI, PORT, app, server, authenticate(), rt (+3 more)

### Community 11 - "Auth Services"
Cohesion: 0.17
Nodes (16): JWT_SECRET, VerificationModel, verifSchema, CreateAccountParams, loginUser(), loginUserParams, verifyEmail(), get7daysfromNow() (+8 more)

### Community 12 - "Frontend Dev Dependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+11 more)

### Community 13 - "Node TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+10 more)

### Community 14 - "Environment Variables"
Cohesion: 0.17
Nodes (13): mailjet, resend_client, ACCESS_TOKEN_EXPIRY, BACKEND_URL, DEFAULT_AVATAR, EMAIL_SENDER, JWT_REFRESH_SECRET, MJ_APIKEY_PRIVATE (+5 more)

### Community 15 - "Backend Dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcrypt, cookie-parser, cors, dotenv, express, jimp, jsonwebtoken (+6 more)

### Community 16 - "Email Services"
Cohesion: 0.23
Nodes (11): renderVerificationEmail(), CreateAccount(), resendEmailVerification(), sendPasswordResetEmail(), getFiveMinsAgo(), getOneHourFromNow(), getOneYearFromNow(), getFromEmail() (+3 more)

### Community 17 - "User Management"
Cohesion: 0.33
Nodes (6): getUserController, updateuserProfileController, User, userSchema, updateUser(), appAssert()

### Community 18 - "Backend Type Definitions"
Cohesion: 0.18
Nodes (11): devDependencies, @types/bcrypt, @types/cookie-parser, @types/cors, @types/express, @types/jimp, @types/jsonwebtoken, @types/mongoose (+3 more)

### Community 19 - "Session Management"
Cohesion: 0.22
Nodes (8): NODE_ENV, SessionDocument, SessionModel, sessionSchema, defaults, Params, get30daysfromNow(), ONE_DAY_MILIS

### Community 20 - "Socket.IO Integration"
Cohesion: 0.31
Nodes (6): ACTIONS, socketUserMapping, SocketUserMappingInterface, io, socketHandlerV2(), socket.io

### Community 21 - "Backend TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, outDir, rootDir, skipLibCheck, strict (+1 more)

### Community 22 - "Project Documentation"
Cohesion: 0.39
Nodes (8): Backend API, Docker Compose Dev, Application Screenshot 2, Application Screenshot 1, MongoDB, React Client, Gethory README, Signaling Server (Socket.IO)

### Community 23 - "Session Controllers"
Cohesion: 0.36
Nodes (5): deleteSessionController, getSessionsController, rt, AsyncController, catchError()

### Community 24 - "Zod Validation Schemas"
Cohesion: 0.29
Nodes (5): createRoomSchema, createRoomType, UpdateProfileType, UpdateUserSchema, zod

### Community 25 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, test

### Community 26 - "Verification Types"
Cohesion: 0.40
Nodes (4): VerificationCodeType, EMAIL, PASSWORD_RESET, PHONE

### Community 27 - "Password Hashing"
Cohesion: 0.50
Nodes (3): compareHash(), hashValue(), bcrypt

## Knowledge Gaps
- **227 isolated node(s):** `RouteProps`, `RouteProps`, `RouteProps`, `RouteProps`, `AuthState` (+222 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 267 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `typescript` connect `Frontend Dependencies` to `Backend Configuration`?**
  _High betweenness centrality (0.383) - this node is a cross-community bridge._
- **Why does `react` connect `React App Core` to `UI Components`, `Frontend Dependencies`, `WebRTC Hooks`, `Common UI Elements`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `React App Core` to `UI Components`, `Frontend Dependencies`, `WebRTC Hooks`, `Common UI Elements`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **What connects `RouteProps`, `RouteProps`, `RouteProps` to the rest of the system?**
  _227 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React App Core` be split into smaller, more focused modules?**
  _Cohesion score 0.06142322097378277 - nodes in this community are weakly interconnected._
- **Should `UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07514124293785311 - nodes in this community are weakly interconnected._
- **Should `Frontend Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045068027210884355 - nodes in this community are weakly interconnected._