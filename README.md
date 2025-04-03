# PlayX - Backend

## 📂 Project Structure

```
/backend
│-- prisma
│   ├── schema.prisma       # Prisma schema file for database configuration
│
│-- src
│   │-- api
│   │   │-- v1              # API version 1
│   │   │   │-- app
│   │   │   │   ├── controller  # Handles business logic
│   │   │   │   ├── middleware  # Express middlewares
│   │   │   │   ├── validation  # Request validation schemas
│   │   │   │
│   │   │   ├── routes       # Defines API routes
│   │   │   ├── utility      # Utility functions/helpers
│   │
│   ├── index.ts            # Server initialization
│
├── .env                    # Environment variables (not committed)
├── .env.example            # Sample environment variables
├── .gitignore               # Files to ignore in version control
├── .prettierrc              # Prettier configuration for code formatting
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
```

##  Getting Started

### 1. Install Dependencies
```sh
npm install
```

### 2. Setup Environment Variables
- Create a `.env` file in the root directory using `.env.example` as a reference.
- Add necessary environment variables like database connection strings.

### 3. Generate Prisma Client
```sh
npx prisma generate
```

### 4. Run Database Migrations
```sh
npx prisma migrate dev
```

### 5. Start the Server
```sh
npm run dev
```
