-- AlterEnum
ALTER TYPE "AnnouncementAudience" ADD VALUE 'students';

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "emailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "storagePath" TEXT;
