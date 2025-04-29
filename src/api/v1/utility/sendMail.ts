import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import path from "path"; // Import the 'path' module
import "dotenv/config";

// Get the current directory path using import.meta.url
const currentDir = path.dirname(new URL(import.meta.url).pathname);

const ENV = process.env;

const transporter = nodemailer.createTransport({
  host: ENV.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: ENV.MAIL_USERNAME,
    pass: ENV.MAIL_PASSWORD,
  },
});

export const sendMail = (receiverMail: string, username: string, resetLink: string) => {
  async function main() {
    // Use path.resolve to get the absolute path
    const filePath = path.resolve(currentDir, "../mail-template/forgot-password.html");
    // logHttp("info", `Reading HTML template from: ${filePath}`);

    let htmlContent = readFileSync(filePath, "utf-8");
    // logHttp("info", htmlContent);

    // Replace placeholders
    htmlContent = htmlContent.replace(/{{displayName}}/g, username).replace(/{{resetLink}}/g, resetLink);

    // Send email
    await transporter.sendMail({
      from: ENV.MAIL_USERNAME,
      to: receiverMail,
      subject: "Password Reset Link",
      html: htmlContent,
    });
    // console.log("Message sent:", info.messageId);
  }

  main().catch(console.error);
};
