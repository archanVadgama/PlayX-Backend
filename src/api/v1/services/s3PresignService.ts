import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";
import { s3Client } from "../config/aws.js";

export const generatePresignedUploadUrl = async (key: string, contentType: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const signedURL = await getSignedUrl(s3Client, command, { expiresIn: 60 * 15 }); // 5 minutes

  return signedURL; // 5 minutes
};

export const getSignedS3Url = async (key: string, expiresInSeconds = 3600) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds, // 1 hour default
  });

  return signedUrl;
};
