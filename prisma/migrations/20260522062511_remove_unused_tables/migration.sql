/*
  Warnings:

  - You are about to drop the `attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `domains` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homework` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homework_submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `marks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subject_teachers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timetable_slots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_markedById_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_domainId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_studentId_fkey";

-- DropForeignKey
ALTER TABLE "fees" DROP CONSTRAINT "fees_createdById_fkey";

-- DropForeignKey
ALTER TABLE "fees" DROP CONSTRAINT "fees_studentId_fkey";

-- DropForeignKey
ALTER TABLE "homework_submissions" DROP CONSTRAINT "homework_submissions_homeworkId_fkey";

-- DropForeignKey
ALTER TABLE "homework_submissions" DROP CONSTRAINT "homework_submissions_studentId_fkey";

-- DropForeignKey
ALTER TABLE "marks" DROP CONSTRAINT "marks_examId_fkey";

-- DropForeignKey
ALTER TABLE "marks" DROP CONSTRAINT "marks_studentId_fkey";

-- DropForeignKey
ALTER TABLE "marks" DROP CONSTRAINT "marks_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "student_notifications" DROP CONSTRAINT "student_notifications_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "student_notifications" DROP CONSTRAINT "student_notifications_studentId_fkey";

-- DropForeignKey
ALTER TABLE "subject_teachers" DROP CONSTRAINT "subject_teachers_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "subject_teachers" DROP CONSTRAINT "subject_teachers_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "timetable_slots" DROP CONSTRAINT "timetable_slots_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "timetable_slots" DROP CONSTRAINT "timetable_slots_teacherId_fkey";

-- DropTable
DROP TABLE "attendance";

-- DropTable
DROP TABLE "classes";

-- DropTable
DROP TABLE "documents";

-- DropTable
DROP TABLE "domains";

-- DropTable
DROP TABLE "events";

-- DropTable
DROP TABLE "exams";

-- DropTable
DROP TABLE "fees";

-- DropTable
DROP TABLE "homework";

-- DropTable
DROP TABLE "homework_submissions";

-- DropTable
DROP TABLE "marks";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "settings";

-- DropTable
DROP TABLE "student_notifications";

-- DropTable
DROP TABLE "subject_teachers";

-- DropTable
DROP TABLE "subjects";

-- DropTable
DROP TABLE "timetable_slots";
