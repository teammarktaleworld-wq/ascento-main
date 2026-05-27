-- CreateEnum
CREATE TYPE "AnnouncementPriority" AS ENUM ('info', 'normal', 'urgent');

-- CreateEnum
CREATE TYPE "AnnouncementAudience" AS ENUM ('all', 'program', 'level', 'teachers');

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "AnnouncementPriority" NOT NULL DEFAULT 'normal',
    "audience" "AnnouncementAudience" NOT NULL DEFAULT 'all',
    "programId" TEXT,
    "levelId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "announcements_audience_idx" ON "announcements"("audience");

-- CreateIndex
CREATE INDEX "announcements_programId_idx" ON "announcements"("programId");

-- CreateIndex
CREATE INDEX "announcements_isActive_idx" ON "announcements"("isActive");

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "program_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
