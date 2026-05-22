/*
  Warnings:

  - You are about to drop the `homework` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "homework_submissions" DROP CONSTRAINT "homework_submissions_homeworkId_fkey";

-- DropTable
DROP TABLE "homework";

-- CreateTable
CREATE TABLE "homework_files" (
    "id" TEXT NOT NULL,
    "serialId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "label" TEXT,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homework_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "homework_files_serialId_key" ON "homework_files"("serialId");

-- AddForeignKey
ALTER TABLE "homework_submissions" ADD CONSTRAINT "homework_submissions_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "homework_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
