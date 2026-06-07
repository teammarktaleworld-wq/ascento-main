/*
  Warnings:

  - You are about to drop the column `pdfUrl` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `storagePath` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactEnquiry` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serialId]` on the table `notes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CouponScope" AS ENUM ('global', 'note', 'test_paper');

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_categoryId_fkey";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "pdfUrl",
DROP COLUMN "storagePath",
DROP COLUMN "type",
ADD COLUMN     "demoPath" TEXT,
ADD COLUMN     "demoUrl" TEXT,
ADD COLUMN     "discountPercent" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "realPath" TEXT,
ADD COLUMN     "realUrl" TEXT;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "ContactEnquiry";

-- CreateTable
CREATE TABLE "contact_enquiries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "childAge" TEXT,
    "reason" TEXT,
    "message" TEXT,
    "program" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_paper_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_paper_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_papers" (
    "id" TEXT NOT NULL,
    "serialId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "categoryId" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountPercent" DOUBLE PRECISION,
    "fileUrl" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "scope" "CouponScope" NOT NULL DEFAULT 'global',
    "noteId" TEXT,
    "testPaperId" TEXT,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "noteId" TEXT,
    "testPaperId" TEXT,
    "couponId" TEXT,
    "originalPrice" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "discountApplied" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "note_categories_name_key" ON "note_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "test_paper_categories_name_key" ON "test_paper_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "test_papers_serialId_key" ON "test_papers"("serialId");

-- CreateIndex
CREATE INDEX "test_papers_categoryId_idx" ON "test_papers"("categoryId");

-- CreateIndex
CREATE INDEX "test_papers_price_idx" ON "test_papers"("price");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_code_idx" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_scope_idx" ON "coupons"("scope");

-- CreateIndex
CREATE INDEX "coupons_isActive_idx" ON "coupons"("isActive");

-- CreateIndex
CREATE INDEX "purchases_userId_idx" ON "purchases"("userId");

-- CreateIndex
CREATE INDEX "purchases_noteId_idx" ON "purchases"("noteId");

-- CreateIndex
CREATE INDEX "purchases_testPaperId_idx" ON "purchases"("testPaperId");

-- CreateIndex
CREATE INDEX "purchases_purchasedAt_idx" ON "purchases"("purchasedAt");

-- CreateIndex
CREATE UNIQUE INDEX "notes_serialId_key" ON "notes"("serialId");

-- CreateIndex
CREATE INDEX "notes_categoryId_idx" ON "notes"("categoryId");

-- CreateIndex
CREATE INDEX "notes_price_idx" ON "notes"("price");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "note_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_papers" ADD CONSTRAINT "test_papers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "test_paper_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_testPaperId_fkey" FOREIGN KEY ("testPaperId") REFERENCES "test_papers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_testPaperId_fkey" FOREIGN KEY ("testPaperId") REFERENCES "test_papers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
