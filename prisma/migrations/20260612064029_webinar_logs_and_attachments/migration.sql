-- AlterTable
ALTER TABLE "webinars" ADD COLUMN     "attachmentName" TEXT,
ADD COLUMN     "attachmentSize" INTEGER,
ADD COLUMN     "attachmentType" TEXT,
ADD COLUMN     "attachmentUrl" TEXT;

-- CreateTable
CREATE TABLE "webinar_email_logs" (
    "id" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "studentId" TEXT,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "errorMsg" TEXT,
    "resendId" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinar_email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webinar_notification_logs" (
    "id" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "errorMsg" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinar_notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "webinar_email_logs_webinarId_idx" ON "webinar_email_logs"("webinarId");

-- CreateIndex
CREATE INDEX "webinar_email_logs_status_idx" ON "webinar_email_logs"("status");

-- CreateIndex
CREATE INDEX "webinar_notification_logs_webinarId_idx" ON "webinar_notification_logs"("webinarId");

-- CreateIndex
CREATE INDEX "webinar_notification_logs_status_idx" ON "webinar_notification_logs"("status");

-- AddForeignKey
ALTER TABLE "webinar_email_logs" ADD CONSTRAINT "webinar_email_logs_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinar_notification_logs" ADD CONSTRAINT "webinar_notification_logs_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
