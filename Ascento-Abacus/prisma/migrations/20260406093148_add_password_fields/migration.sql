-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isPasswordTemporary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT;
