import express from "express";
import "dotenv/config";
import auth from "./api/v1/routes/auth.js";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestContext } from "./api/v1/middleware/requestContext.js";

const ENV = process.env;
const app = express();

// Define CORS options to control cross-origin requests
const corsOptions = {
  // Allow requests only from the specified origin (constructed using environment variables)
  origin: `${ENV.APP_URL}:${ENV.PORT}`,

  // Specify the HTTP methods allowed for cross-origin requests
  methods: ["GET", "POST", "PUT", "DELETE"],

  // Specify the headers that can be included in cross-origin requests
  allowedHeaders: ["Content-Type", "Authorization"],

  // Allow credentials (e.g., cookies, authorization headers) to be sent with cross-origin requests
  credentials: true,

  // Do not pass preflight requests (OPTIONS) to the next middleware
  preflightContinue: false,

  // Return a 200 status code for successful preflight requests
  optionsSuccessStatus: 200,
};

// Middleware
app.use(helmet()); // Security middleware to set various HTTP headers

app.use(requestContext); // Middleware to create a request context for logging
app.use(cors(corsOptions)); // Enable CORS with the defined options
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data from html forms
app.use(express.json()); // Parse JSON data from requests
app.use(cookieParser()); // Parse cookies from requests

app.use("/api/v1", auth); // Auth routes with the /api/v1 prefix

app.listen(ENV.PORT, () => {
  console.log(`Server running on ${ENV.APP_URL}:${ENV.PORT}`);
});
