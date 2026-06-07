-- AlterTable
ALTER TABLE "test_papers" ADD COLUMN     "demoPath" TEXT,
ADD COLUMN     "demoUrl" TEXT,
ADD COLUMN     "realPath" TEXT,
ADD COLUMN     "realUrl" TEXT,
ALTER COLUMN "fileUrl" DROP NOT NULL,
ALTER COLUMN "filePath" DROP NOT NULL;
