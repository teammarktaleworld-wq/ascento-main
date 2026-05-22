/*
  Warnings:

  - You are about to drop the column `sectionId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `enrollments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_classId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "timetable_slots" DROP CONSTRAINT "timetable_slots_sectionId_fkey";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "sectionId",
ADD COLUMN     "academicYear" TEXT,
ADD COLUMN     "class" TEXT,
ADD COLUMN     "section" TEXT;

-- DropTable
DROP TABLE "enrollments";

-- DropTable
DROP TABLE "sections";
