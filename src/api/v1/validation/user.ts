import { Schema } from "express-validator";

type TStringField = (
  min: number,
  max: number,
  field: string
) => {
  [key: string]: { errorMessage?: string; options?: { min: number; max: number } } | boolean;
};

type TIntField = (
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
const stringField = (min: number, max: number, field: string) => ({
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

/**
 * Integer field validation
 *
 * @param {number} min
 * @param {number} max
 * @param {string} field
 */
const intField: TIntField = (min: number, max: number, field: string) => ({
  trim: true,
  escape: true,
  notEmpty: {
    errorMessage: `${field} is required`,
  },
  isInt: {
    errorMessage: `${field} will be a number`,
  },
  isLength: {
    options: { min, max },
    errorMessage: `${field} must be between ${min} to ${max} characters`,
  },
});

const emailField: { [key: string]: { errorMessage?: string } | boolean } = {
  trim: true,
  escape: true,
  notEmpty: {
    errorMessage: "Email is required",
  },
  isEmail: {
    errorMessage: "Invalid email",
  },
};

const uploadVideoSchema: Schema = {
  userId: intField(1, 20, "User ID"),
  categoryId: intField(1, 12, "Category ID"),
  ageRestricted: {
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
      options: { min: 10, max: 50 },
      errorMessage: "Keyword must be between 10 to 50 characters",
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
  // video: {
  //   notEmpty: {
  //     errorMessage: "Video is required",
  //   },
  //   custom: {
  //     options: (value: string, { req }) => {
  //       const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  //       const videoFile = files?.["video"]?.[0];
  //       if (!videoFile) {
  //         throw new Error("Video file is missing");
  //       }
  //       return true;
  //     },
  //   },
  // },
  // thumbnail: {
  //   notEmpty: {
  //     errorMessage: "Thumbnail is required",
  //   },
  //   custom: {
  //     options: (value: string, { req }) => {
  //       const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  //       const thumbnailFile = files?.["thumbnail"]?.[0];
  //       if (!thumbnailFile) {
  //         throw new Error("Thumbnail file is missing");
  //       }
  //       if (thumbnailFile.size > 2 * 1024 * 1024) {
  //         throw new Error("Thumbnail size exceeds 2MB");
  //       }
  //       return true;
  //     },
  //   },
  // },
};

export { uploadVideoSchema };
