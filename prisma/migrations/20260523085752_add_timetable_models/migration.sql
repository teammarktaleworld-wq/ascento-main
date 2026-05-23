-- CreateTable
CREATE TABLE "schedule_slots" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "levelId" TEXT,
    "dayOfWeek" TEXT NOT NULL,
    "periodNumber" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable_uploads" (
    "id" TEXT NOT NULL,
    "programId" TEXT,
    "levelId" TEXT,
    "originalName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timetable_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedule_slots_programId_idx" ON "schedule_slots"("programId");

-- CreateIndex
CREATE INDEX "schedule_slots_levelId_idx" ON "schedule_slots"("levelId");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_slots_programId_levelId_dayOfWeek_periodNumber_key" ON "schedule_slots"("programId", "levelId", "dayOfWeek", "periodNumber");

-- CreateIndex
CREATE INDEX "timetable_uploads_programId_idx" ON "timetable_uploads"("programId");

-- AddForeignKey
ALTER TABLE "schedule_slots" ADD CONSTRAINT "schedule_slots_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_slots" ADD CONSTRAINT "schedule_slots_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "program_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_uploads" ADD CONSTRAINT "timetable_uploads_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_uploads" ADD CONSTRAINT "timetable_uploads_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "program_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
