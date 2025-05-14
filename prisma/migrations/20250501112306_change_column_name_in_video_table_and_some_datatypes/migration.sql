/*
  Warnings:

  - You are about to drop the column `ageRestricted` on the `Video` table. All the data in the column will be lost.
  - The `viewCount` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `size` on the `Video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `duration` on the `Video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "ageRestricted",
ADD COLUMN     "isAgeRestricted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "viewCount",
ADD COLUMN     "viewCount" BIGINT NOT NULL DEFAULT 0,
DROP COLUMN "size",
ADD COLUMN     "size" BIGINT NOT NULL,
DROP COLUMN "duration",
ADD COLUMN     "duration" DECIMAL(65,30) NOT NULL;
