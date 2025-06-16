# PlayX - Backend

## 📖 Overview

**PlayX** is a user-friendly video sharing platform designed to enable seamless video uploading, sharing, and interaction. It allows users to create, upload, and manage video content while offering engagement features such as comments and likes. The platform ensures a smooth content discovery experience through advanced search and filtering capabilities. With an intuitive dashboard, content creators can efficiently manage their videos, monitor engagement, and interact with their audience. Additionally, the system provides robust administrative tools for content moderation, user management, and overall platform governance.

## 👤 User Panel Features

- **Authentication**: Sign up, login, password reset, and profile management.
- **Video Upload & Management**: Upload videos with metadata (title, description, keywords, thumbnail).
- **Interaction**: Like/dislike, comment, and report inappropriate content.
- **Search & Filtering**: By title, keywords, description, and category.
- **Subscriptions**: Follow creators and receive in-app/email notifications.
- **Watch Later**: Save videos for future viewing.

## 🛡 Admin Panel Features

- **Dashboard**: Overview of activity and content.
- **Category Management**: Create/manage video categories.
- **User Management**: Suspend/delete users and moderate content.
- **Reports**: Review and take action on reported content.

## 🛠 Tech Stack

- **Frontend**: Angular, HTML, CSS, JavaScript
- **UI Framework**: Tailwind CSS
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL
- **Others**:

  - JWT Authentication
  - Prisma ORM
  - FFmpeg for video processing

## 📂 Project Structure

```
/backend
│-- prisma
│   ├── schema.prisma       # Prisma schema file for database configuration
│
│-- src
│   │-- api
│   │   │-- v1              # API version 1
│   │   │   ├── controller  # Handles business logic
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

## Getting Started

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
