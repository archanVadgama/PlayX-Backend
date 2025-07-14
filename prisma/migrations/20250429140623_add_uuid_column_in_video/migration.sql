/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_uuid_key" ON "Video"("uuid");
