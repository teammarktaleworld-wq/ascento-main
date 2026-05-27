-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "storagePath" TEXT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "photoUrl" TEXT;
