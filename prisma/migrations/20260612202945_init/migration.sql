/*
  Warnings:

  - You are about to drop the column `errorMsg` on the `announcement_email_logs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PortalRegistrationStatus" AS ENUM ('registered', 'in_progress', 'submitted', 'expired');

-- AlterTable
ALTER TABLE "announcement_email_logs" DROP COLUMN "errorMsg";

-- CreateTable
CREATE TABLE "portal_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_papers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "categoryId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "totalMarks" INTEGER NOT NULL DEFAULT 100,
    "passingMarks" INTEGER NOT NULL DEFAULT 40,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
    "allowReview" BOOLEAN NOT NULL DEFAULT true,
    "showResultImmediately" BOOLEAN NOT NULL DEFAULT true,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_questions" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctOptionIndex" INTEGER NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT 1,
    "explanation" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_registrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "status" "PortalRegistrationStatus" NOT NULL DEFAULT 'registered',
    "score" INTEGER,
    "totalMarks" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "timeTaken" INTEGER,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_answers" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedIndex" INTEGER,
    "isCorrect" BOOLEAN,
    "marksAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portal_categories_name_key" ON "portal_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "portal_categories_slug_key" ON "portal_categories"("slug");

-- CreateIndex
CREATE INDEX "portal_papers_categoryId_idx" ON "portal_papers"("categoryId");

-- CreateIndex
CREATE INDEX "portal_papers_isPublished_idx" ON "portal_papers"("isPublished");

-- CreateIndex
CREATE INDEX "portal_papers_startDate_idx" ON "portal_papers"("startDate");

-- CreateIndex
CREATE INDEX "portal_questions_paperId_idx" ON "portal_questions"("paperId");

-- CreateIndex
CREATE INDEX "portal_questions_order_idx" ON "portal_questions"("order");

-- CreateIndex
CREATE INDEX "portal_registrations_userId_idx" ON "portal_registrations"("userId");

-- CreateIndex
CREATE INDEX "portal_registrations_paperId_idx" ON "portal_registrations"("paperId");

-- CreateIndex
CREATE INDEX "portal_registrations_status_idx" ON "portal_registrations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "portal_registrations_userId_paperId_attemptNumber_key" ON "portal_registrations"("userId", "paperId", "attemptNumber");

-- CreateIndex
CREATE INDEX "portal_answers_registrationId_idx" ON "portal_answers"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "portal_answers_registrationId_questionId_key" ON "portal_answers"("registrationId", "questionId");

-- AddForeignKey
ALTER TABLE "portal_papers" ADD CONSTRAINT "portal_papers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "portal_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_questions" ADD CONSTRAINT "portal_questions_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "portal_papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_registrations" ADD CONSTRAINT "portal_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_registrations" ADD CONSTRAINT "portal_registrations_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "portal_papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_answers" ADD CONSTRAINT "portal_answers_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "portal_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_answers" ADD CONSTRAINT "portal_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "portal_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
