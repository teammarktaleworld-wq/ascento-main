-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "emailSentCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "announcement_email_logs" (
    "id" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "announcement_email_logs_announcementId_idx" ON "announcement_email_logs"("announcementId");

-- CreateIndex
CREATE INDEX "announcement_email_logs_status_idx" ON "announcement_email_logs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_email_logs_announcementId_userId_key" ON "announcement_email_logs"("announcementId", "userId");

-- AddForeignKey
ALTER TABLE "announcement_email_logs" ADD CONSTRAINT "announcement_email_logs_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_email_logs" ADD CONSTRAINT "announcement_email_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
