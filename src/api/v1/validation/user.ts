import { Schema } from "express-validator";

type TStringField = (
  min: number,
  max: number,
  field: string
) => {
  [key: string]: { errorMessage?: string; options?: { min: number; max: number } } | boolean;
};

/**
 * String field validation
 *
 * @param {number} min
 * @param {number} max
 * @param {string} field
 */
const stringField: TStringField = (min: number, max: number, field: string) => ({
  trim: true,
  escape: true,
  notEmpty: {
    errorMessage: `${field} is required`,
  },
  isLength: {
    options: { min, max },
    errorMessage: `${field} must be between ${min} to ${max} characters`,
  },
});

// Validation for uploading a video
const uploadVideoSchema: Schema = {
  userId: stringField(1, 200, "User ID"),
  categoryId: stringField(1, 200, "Category ID"),
  isAgeRestricted: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Age Restricted is required",
    },
    isBoolean: {
      errorMessage: "Age Restricted should be a boolean value",
    },
    toBoolean: true, // It will convert the value to boolean
  },
  keywords: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Keyword is required",
    },
    isLength: {
      options: { min: 10, max: 100 },
      errorMessage: "Keyword must be between 10 to 100 characters",
    },
    custom: {
      options: (value: string) => {
        const keywordsArray = value.split(",").map((keyword: string) => keyword.trim());
        if (keywordsArray.length > 10) {
          throw new Error("Keywords should not exceed 10 items");
        }
        return true;
      },
    },
  },
  title: stringField(5, 80, "Title"),
  description: stringField(10, 500, "Description"),
  isPrivate: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Is Private is required",
    },
    isBoolean: {
      errorMessage: "Is Private should be a boolean value",
    },
    toBoolean: true, // It will convert the value to boolean
  },
};

export { uploadVideoSchema };
