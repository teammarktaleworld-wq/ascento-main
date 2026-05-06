/*
  Warnings:

  - You are about to drop the column `age` on the `ContactEnquiry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContactEnquiry" DROP COLUMN "age",
ADD COLUMN     "childAge" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "reason" TEXT,
ALTER COLUMN "program" DROP NOT NULL;
