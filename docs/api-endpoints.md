
## API Endpoints

This document provides a detailed overview of the API endpoints available in the PlayX backend. The API is organized into several categories, each serving different functionalities.

## Authentication Routes
Base path: `/api/v1/auth`

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/log-in` | User login | No |
| POST | `/sign-up` | New user registration | No |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password with token | No |
| POST | `/log-out` | User logout | No |
| GET | `/refresh-token` | Refresh access token | No |

## User Routes
Base path: `/api/v1/user`

#### Public Endpoints 
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:username/video/:filename` | Stream video content |
| GET | `/:username/thumbnail/:filename` | Get video thumbnail |
| GET | `/search` | Search videos |
| GET | `/feed` | Get feed data |
| GET | `/watch/:uuid` | Get video details |
| POST | `/view-count/:id` | Update video view count |

#### Protected Endpoints (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/:id` | Get user profile |
| GET | `/watch-history/:id` | Get user's watch history |
| GET | `/my-videos/:userId` | Get user's uploaded videos |
| POST | `/watch-history` | Add to watch history |
| POST | `/confirm-upload/:videoId` | Confirm video upload |
| POST | `/generate-presigned-url` | Generate upload URL |
| POST | `/upload-video` | Upload video file |

## Admin Routes
Base path: `/api/v1/admin`

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/dashboard` | Admin dashboard data | Required |

## Authentication
- Protected routes require a valid authentication token
- Use the `/auth/log-in` endpoint to obtain tokens
- Tokens can be refreshed using `/auth/refresh-token`

## File Upload
Video uploads use a two-step process:
1. Generate a pre-signed URL using `/user/generate-presigned-url`
2. Complete upload confirmation with `/user/confirm-upload/:videoId`

## Response Format
All API endpoints return responses in the following format:
```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string
}
```

## Error Handling
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
