-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "emailSentAt" TIMESTAMP(3),
ADD COLUMN     "emailSentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notifSentAt" TIMESTAMP(3),
ADD COLUMN     "notifSentCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "examId" TEXT;

-- CreateIndex
CREATE INDEX "notifications_examId_idx" ON "notifications"("examId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
