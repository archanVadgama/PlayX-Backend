# PlayX - Backend Documentation

Welcome to the backend documentation of **PlayX**, a powerful video-sharing platform. This project focuses on secure video management, user interaction, content moderation, and scalable backend architecture using Node.js, Express, Prisma, and PostgreSQL.


## 📚 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Documentation](docs/detail-documentaion.md#detailed-documentation)
  - [Project Structure](docs/project-structure.md#project-structure)
  - [Features](docs/features.md#user-panel-features)
  - [File Upload](docs/file-upload.md#file-upload)
  - [User Stories](https://simformsolutionspvtltd-my.sharepoint.com/:w:/r/personal/archan_vadgama_simformsolutions_com/_layouts/15/Doc.aspx?sourcedoc=%7BFA1D6C86-C15D-473F-86CB-CC55333739CA%7D&file=Archan%20Vadgama%20-%20Video%20Sharing%20Platform.docx&action=default&mobileredirect=true&DefaultItemOpen=1&ct=1750330605599&wdOrigin=OFFICECOM-WEB.START.EDGEWORTH&cid=732ef863-8229-47a8-be05-4c815f085dee&wdPreviousSessionSrc=HarmonyEmbed&wdPreviousSession=0ff8b3be-a721-46c7-bf90-f6c6feb624f4)
  - [Database Design](https://dbdiagram.io/d/PlayX-Video-Sharing-Platform-67c95db6263d6cf9a06b6bfd)
## Overview

**PlayX** is a user-friendly video sharing platform designed to enable seamless video uploading, sharing, and interaction. It allows users to create, upload, and manage video content while offering engagement features such as comments and likes. The platform ensures a smooth content discovery experience through advanced search and filtering capabilities. With an intuitive dashboard, content creators can efficiently manage their videos, monitor engagement, and interact with their audience. Additionally, the system provides robust administrative tools for content moderation, user management, and overall platform governance.

## Getting Started

### 1. Clone the Repository  
   Clone the repository to your local machine.

### 2. Install Dependencies

```sh
npm install
```

### 3. Environment Configuration

- Copy the sample environment file and configure your environment variables:
```sh
cp .example.env .env
```
Set values such as:

- `DATABASE_URL`

- `JWT_SECRET`

- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

### 4. Generate Prisma client

```sh
npx prisma generate
```

### 5. Run Database Migrations

```sh
npx prisma migrate dev
```

### 6. Start the Server

```sh
npm run dev
```

