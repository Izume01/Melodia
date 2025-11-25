/*
  Warnings:

  - You are about to drop the column `ImageS3Key` on the `Song` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[requestId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requestId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Song_s3Key_ImageS3Key_idx";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "ImageS3Key",
ADD COLUMN     "imageS3Key" TEXT,
ADD COLUMN     "requestId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Song_requestId_key" ON "Song"("requestId");

-- CreateIndex
CREATE INDEX "Song_s3Key_imageS3Key_idx" ON "Song"("s3Key", "imageS3Key");
