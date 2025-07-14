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

## Document References

- [User Stories](https://simformsolutionspvtltd-my.sharepoint.com/:w:/r/personal/archan_vadgama_simformsolutions_com/_layouts/15/Doc.aspx?sourcedoc=%7BFA1D6C86-C15D-473F-86CB-CC55333739CA%7D&file=Archan%20Vadgama%20-%20Video%20Sharing%20Platform.docx&action=default&mobileredirect=true&DefaultItemOpen=1&ct=1750330605599&wdOrigin=OFFICECOM-WEB.START.EDGEWORTH&cid=732ef863-8229-47a8-be05-4c815f085dee&wdPreviousSessionSrc=HarmonyEmbed&wdPreviousSession=0ff8b3be-a721-46c7-bf90-f6c6feb624f4)
- [Database Design](https://dbdiagram.io/d/PlayX-Video-Sharing-Platform-67c95db6263d6cf9a06b6bfd)
