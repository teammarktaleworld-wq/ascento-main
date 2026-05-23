// prisma/seed.ts  (or seed.js)
// Run with: npx ts-node prisma/seed.ts   OR   npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const programs = [
    {
      name: "Play School",
      description: "Early childhood play-based learning",
      hasLevels: false,
      sortOrder: 1,
      levels: [
        { name: "Pre-Nursery", sortOrder: 1 },
        { name: "Nursery",     sortOrder: 2 },
        { name: "LKG",         sortOrder: 3 },
        { name: "UKG",         sortOrder: 4 },
        { name: "1st Class",   sortOrder: 5 },
        { name: "2nd Class",   sortOrder: 6 },
      ],
    },
    {
      name: "Abacus",
      description: "Mental arithmetic using abacus",
      hasLevels: true,
      sortOrder: 2,
      levels: Array.from({ length: 11 }, (_, i) => ({
        name: `Level ${i}`,
        sortOrder: i,
      })),
    },
    {
      name: "Vedic Maths",
      description: "Speed mathematics using Vedic techniques",
      hasLevels: true,
      sortOrder: 3,
      levels: Array.from({ length: 4 }, (_, i) => ({
        name: `Level ${i + 1}`,
        sortOrder: i + 1,
      })),
    },
    {
      name: "Brain Gym",
      description: "Brain exercise and cognitive development",
      hasLevels: false,
      sortOrder: 4,
      levels: [],
    },
    {
      name: "Tuitions",
      description: "Academic tuition support",
      hasLevels: false,
      sortOrder: 5,
      levels: [],
    },
    {
      name: "Pre Abacus",
      description: "Foundation course before Abacus",
      hasLevels: false,
      sortOrder: 6,
      levels: [],
    },
  ];

  for (const prog of programs) {
    const { levels, ...programData } = prog;
    const program = await prisma.program.upsert({
      where: { name: programData.name },
      update: {},
      create: programData,
    });

    for (const level of levels) {
      await prisma.programLevel.upsert({
        where: { programId_name: { programId: program.id, name: level.name } },
        update: {},
        create: { programId: program.id, ...level },
      });
    }

    console.log(`✓ Seeded program: ${program.name} (${levels.length} levels)`);
  }

  console.log("\n✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());