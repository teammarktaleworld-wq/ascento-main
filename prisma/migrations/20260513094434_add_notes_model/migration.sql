-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('DEMO', 'REAL');

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "serialId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "type" "NoteType" NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);
