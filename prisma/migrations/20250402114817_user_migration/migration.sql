-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Inactive', 'Blocked');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin', 'Moderator');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',
    "role" "UserRole" NOT NULL DEFAULT 'User',
    "image" VARCHAR(255),
    "userName" VARCHAR(50) NOT NULL,
    "fullName" VARCHAR(50) NOT NULL,
    "channelName" VARCHAR(50),
    "email" TEXT NOT NULL,
    "mobileNumber" BIGINT NOT NULL,
    "password" TEXT NOT NULL,
    "landmark" VARCHAR(50),
    "addressLine1" VARCHAR(50),
    "addressLine2" VARCHAR(50),
    "cityId" INTEGER,
    "stateId" INTEGER,
    "resetToken" TEXT,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNumber_key" ON "User"("mobileNumber");
