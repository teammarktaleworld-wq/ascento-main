/*
  Warnings:

  - The values [scheduled,live,completed,cancelled] on the enum `WebinarStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WebinarStatus_new" AS ENUM ('active', 'inactive');
ALTER TABLE "public"."webinars" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "webinars" ALTER COLUMN "status" TYPE "WebinarStatus_new" USING ("status"::text::"WebinarStatus_new");
ALTER TYPE "WebinarStatus" RENAME TO "WebinarStatus_old";
ALTER TYPE "WebinarStatus_new" RENAME TO "WebinarStatus";
DROP TYPE "public"."WebinarStatus_old";
ALTER TABLE "webinars" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterTable
ALTER TABLE "webinars" ADD COLUMN     "emailSentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationSentAt" TIMESTAMP(3),
ADD COLUMN     "notificationSentCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'active';
