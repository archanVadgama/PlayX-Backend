
# File Upload Documentation
This document provides an overview of the file upload process in the PlayX backend, detailing how video files are uploaded to AWS S3 and their metadata is stored in the PostgreSQL database.
## Overview
The file upload process in PlayX involves generating a pre-signed URL for uploading video files to AWS S3. Once the file is uploaded, the metadata is saved in the PostgreSQL database using Prisma ORM. This two-step process ensures secure and efficient handling of video uploads.
## File Upload Process
1. **Generate Pre-signed URL**: The client requests a pre-signed URL from the backend. This URL allows the client to upload a file directly to AWS S3 without exposing AWS  credentials.
2. **Upload File**: The client uses the pre-signed URL to upload the video file to S3.
3. **Confirm Upload**: After the file is successfully uploaded, the client sends a request to the backend to confirm the upload. This request includes the video metadata such as title, description, and thumbnail.
4. **Save Metadata**: The backend saves the video metadata in the PostgreSQL database using Prisma ORM. This includes details like the video ID, user ID, title, description, keywords, and thumbnail URL.
5. **Response**: The backend responds with the video details, including the video ID and any other relevant information.
## API Endpoints
### Generate Pre-signed URL
- **Endpoint**: `/api/v1/user/generate-presigned-url`
- **Method**: `POST`
- **Request Body**:
```json
{
  "filename": "example.mp4",
  "fileType": "video/mp4"
}
```
- **Response**:
```json       
{
  "url": "https://s3.amazonaws.com/bucket-name/example.mp4?AWSAccessKeyId=...&Signature=...&Expires=..."
}
``` 
### Confirm Upload
- **Endpoint**: `/api/v1/user/confirm-upload/:videoId`
- **Method**: `POST`
- **Response**:
```json 
{
  "message": "Video uploaded successfully"
}
```   
## Error Handling
- If the pre-signed URL generation fails, the backend responds with a 500 status code and an error message.
- If the file upload fails, the backend responds with a 400 status code indicating the error.
- If the metadata saving fails, the backend responds with a 500 status code and an error message.
## Security Considerations
- The pre-signed URL is time-limited to prevent unauthorized access.
- The backend validates the video metadata before saving it to the database.
- Proper error handling is implemented to ensure that sensitive information is not exposed in error messages. 