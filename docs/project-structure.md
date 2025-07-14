
# Architecture & File Structure

This document provides a high-level overview of the backend architecture, file structure, and flow of the PlayX Video Sharing Platform. It is designed to help developers, contributors, and stakeholders understand how the backend is organized and how its components interact.

---

## 1. Tech Stack

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for handling routing and middleware
- **TypeScript** – Static type checking
- **Prisma ORM** – Database access and modeling
- **PostgreSQL** – Relational database
- **AWS S3** – File storage for videos and thumbnails
- **FFmpeg** – Video processing and transcoding
- **Zod** – Input validation library
- **JWT** – Authentication and authorization
--- 
## Project Structure

```
/backend
│-- prisma
│   ├── schema.prisma       # Prisma schema file for database configuration
│
│-- src
│   │-- api
│   │   │-- v1              # API version 1
│   │   │   ├── config      # Configuration files (e.g., aws)
│   │   │   ├── controller  # Handles HTTP request and response logic
│   │   │   ├── service     # Contains core business logic and data handling
│   │   │   ├── middleware  # Express middlewares
│   │   │   ├── validation  # Request validation schemas
│   │   │   ├── routes      # Defines API routes
│   │   │   ├── utility     # Utility functions/helpers
│   │   │   ├── global.ts   # Global utility functions
│   │
│   ├── index.ts            # Server initialization
│
├── .env                    # Environment variables (not committed)
├── .env.example            # Sample environment variables
├── .gitignore              # Files to ignore in version control
├── .prettierrc             # Prettier configuration for code formatting
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
```
## 3. Backend Flow

1. **Request** – A client sends a request to a REST API endpoint.
2. **Routing** – The Express router matches the endpoint and directs it to the correct controller.
3. **Middleware** – Middleware runs before reaching the controller (e.g., for authentication or validation).
4. **Controller** – The controller handles the request logic and delegates business logic to the service layer.
5. **Service** – Services handle complex logic and interact with the database via Prisma.
6. **Database** – Prisma executes queries against PostgreSQL.
7. **Response** – Data is sent back to the client in a structured format (usually JSON).

---

## 4. Key Folders Explained

### `controller/`
Responsible for handling incoming requests and returning appropriate responses. Controllers are lightweight and delegate complex logic to services.

### `routes/`
Defines the API routes and links them to their corresponding controller methods. Follows RESTful conventions and is organized by feature.

### `service/`
Encapsulates business logic and communicates with the database via Prisma. Keeps controllers simple and maintains separation of concerns.

### `middleware/`
Express middleware functions used for tasks such as authentication, error logging, request validation, and more.

### `validation/`
Contains Zod schemas that validate incoming request bodies, query parameters, or headers before they are processed by the controller.

### `config/`
Configuration files for third-party services like AWS S3, SMTP, and any custom environment-based settings.

### `utility/`
Reusable helper functions and common utilities such as token generation, string formatters, or date converters.

### `global.ts`
Houses shared constants, enums, or global functions used across modules.

### `prisma/schema.prisma`
Defines the database structure and model relationships using Prisma’s schema language. Also used for migrations and generating the Prisma client.

---

## 5. How to Extend the Backend

- **Add a new feature**: Create a new controller, service, route, and (optionally) validation schema within `src/api/v1/`.
- **Add a new route**: Define the endpoint in `routes/`, implement logic in the corresponding controller and service.
- **Add new database models**: Update `schema.prisma`, run `npx prisma migrate dev`, and regenerate the client with `npx prisma generate`.
- **Add middleware**: Create reusable middleware logic in `middleware/` and apply it in the router or globally in `index.ts`.

---

For more detailed module-specific documentation, refer to the individual files in the `/docs` folder.