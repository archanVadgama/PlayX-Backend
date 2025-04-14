import { Prisma } from "@prisma/client";

interface IPrismaError {
    name: string;
    code: string;
    message: string;
    meta?: {
        target?: string[];
    };
}
function capitalizeFirstLetter(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
/**
 * Handles Prisma errors and returns a user-friendly error message.
 *
 * @param {object} error - The Prisma error object.
 * @returns {string} - A user-friendly error message.
 */
export const prismaErrorHandler = (error: IPrismaError): string => {
    // Handle known errors
    switch (error.code) {
        case "P2002":
            return `${capitalizeFirstLetter((error.meta?.target?.[0] as string) ?? "Unknown target")} must be unique`;
        case "P2003":
            return "Foreign key constraint failed";
        case "P2025":
            return "Record not found";
        default:
            break;
    }

    // Handle other Prisma errors
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        return "An unknown error occurred";
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        return "A Rust panic occurred";
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
        return "Failed to initialize Prisma Client";
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        return "Missing field or empty field or invalid data type";
    } else {
        return "An unexpected error occurred";
    }
};