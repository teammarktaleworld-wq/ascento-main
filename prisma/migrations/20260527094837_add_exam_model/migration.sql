-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "description" TEXT,
    "examStartDate" TIMESTAMP(3),
    "examEndDate" TIMESTAMP(3),
    "programId" TEXT,
    "levelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exams_programId_idx" ON "exams"("programId");

-- CreateIndex
CREATE INDEX "exams_levelId_idx" ON "exams"("levelId");

-- CreateIndex
CREATE INDEX "exams_examStartDate_idx" ON "exams"("examStartDate");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "program_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
