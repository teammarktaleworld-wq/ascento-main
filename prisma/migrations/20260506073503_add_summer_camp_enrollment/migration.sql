-- CreateTable
CREATE TABLE "summer_camp_enrollments" (
    "id" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "parentName" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "ageGroup" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "summer_camp_enrollments_pkey" PRIMARY KEY ("id")
);
