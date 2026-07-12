import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Departments ---
  const departmentNames = ["Manufacturing", "Logistics", "Operations", "R&D"];
  const departments = await Promise.all(
    departmentNames.map((name) =>
      prisma.department.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // --- Categories ---
  const categoryNames = ["Electricity", "Fuel", "Raw Material", "Business Travel"];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // --- Emission factors (kg CO2e per unit, rough placeholder values) ---
  const emissionFactors = await Promise.all(
    categories.map((c) =>
      prisma.emissionFactor.create({
        data: {
          categoryId: c.id,
          factor: c.name === "Electricity" ? 0.4 : c.name === "Fuel" ? 2.68 : c.name === "Raw Material" ? 1.2 : 0.15,
          unit: c.name === "Electricity" ? "per kWh" : c.name === "Fuel" ? "per liter" : c.name === "Raw Material" ? "per kg" : "per km",
        },
      })
    )
  );

  // --- Score weight config (default 40/30/30) ---
  await prisma.scoreWeightConfig.create({
    data: { environmentalPct: 0.4, socialPct: 0.3, governancePct: 0.3 },
  });

  // --- Users, one per role, attached to first department ---
  const passwordHash = await bcrypt.hash("password123", 10);
  const roles: Role[] = ["ADMIN", "ESG_MANAGER", "DEPARTMENT_LEAD", "EMPLOYEE"];
  await Promise.all(
    roles.map((role, i) =>
      prisma.user.upsert({
        where: { email: `${role.toLowerCase()}@ecosphere.test` },
        update: {},
        create: {
          name: `${role.replace("_", " ")} User`,
          email: `${role.toLowerCase()}@ecosphere.test`,
          password: passwordHash,
          role,
          departmentId: departments[i % departments.length].id,
        },
      })
    )
  );
  // --- Synthetic employees for diversity/training stats ---
  const genders = ["Woman", "Man", "Man", "Non-binary"]; // weighted roughly like real orgs
  const ageBands = ["Under 30", "30-45", "30-45", "46-60", "60+"];
  const firstNames = ["Aditi","Rahul","Priya","Karan","Sneha","Vikram","Meera","Arjun","Divya","Rohan","Anjali","Sameer","Pooja","Nikhil","Kavya","Suresh","Neha","Amit","Ritu","Varun","Isha","Manoj","Shreya","Deepak","Tanvi","Rajesh","Swati","Vivek","Anita","Gaurav"];
  const lastNames = ["Sharma","Verma","Iyer","Nair","Reddy","Gupta","Menon","Rao","Kapoor","Joshi"];

  const employeeUsers = [];
  for (let i = 0; i < 50; i++) {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const dept = departments[i % departments.length];
    const isLeadership = i % 8 === 0; // ~12% in leadership
    const user = await prisma.user.upsert({
      where: { email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@ecosphere.test` },
      update: {},
      create: {
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@ecosphere.test`,
        password: passwordHash,
        role: "EMPLOYEE",
        departmentId: dept.id,
        gender: genders[Math.floor(Math.random() * genders.length)],
        ageBand: ageBands[Math.floor(Math.random() * ageBands.length)],
        isLeadership,
      },
    });
    employeeUsers.push(user);
  }

  // --- Training courses ---
  const courseNames = ["Workplace Safety 2026", "Anti-Bribery & Corruption", "Data Privacy Essentials", "Inclusive Leadership"];
  const courses = await Promise.all(
    courseNames.map((name) =>
      prisma.trainingCourse.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // --- Training records: each employee takes 1-2 random courses at varying completion ---
  for (const user of employeeUsers) {
    const numCourses = 1 + Math.floor(Math.random() * 2);
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    for (let i = 0; i < numCourses; i++) {
      const completion = Math.random() < 0.7 ? 100 : 40 + Math.floor(Math.random() * 50);
      await prisma.trainingRecord.upsert({
        where: { userId_courseId: { userId: user.id, courseId: shuffled[i].id } },
        update: {},
        create: {
          userId: user.id,
          courseId: shuffled[i].id,
          completion,
          completedAt: completion === 100 ? new Date() : null,
        },
      });
    }
  }

  // --- CSR Activities + Participations ---
  const csrTitles = ["River Cleanup Drive", "Code Club Mentoring", "Blood Donation Camp", "Community Garden Build"];
  const csrActivities = await Promise.all(
    departments.map((dept, i) =>
      prisma.cSRActivity.create({
        data: {
          departmentId: dept.id,
          title: csrTitles[i % csrTitles.length],
          description: `Company-wide initiative organized by ${dept.name}.`,
        },
      })
    )
  );

  const statuses: ("PENDING" | "APPROVED" | "REJECTED")[] = ["PENDING", "APPROVED", "REJECTED"];
  for (let i = 0; i < 20; i++) {
    const user = employeeUsers[Math.floor(Math.random() * employeeUsers.length)];
    const activity = csrActivities[Math.floor(Math.random() * csrActivities.length)];
    await prisma.participation.create({
      data: {
        userId: user.id,
        csrActivityId: activity.id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        proofUrl: `proof-${i}.jpg`,
      },
    });
  }
  
  // --- Historical carbon transactions: 6 months, ~15 per department per month ---
  const now = new Date();
  for (const dept of departments) {
    for (let monthsAgo = 6; monthsAgo >= 0; monthsAgo--) {
      for (let i = 0; i < 15; i++) {
        const factor = emissionFactors[Math.floor(Math.random() * emissionFactors.length)];
        const date = new Date(now);
        date.setMonth(date.getMonth() - monthsAgo);
        date.setDate(1 + Math.floor(Math.random() * 27));

        // baseline quantity with small random noise — gives anomaly detection a real distribution to compare against
        const baseQty = 50 + Math.random() * 20;
        const co2e = baseQty * factor.factor;

        await prisma.carbonTransaction.create({
          data: {
            departmentId: dept.id,
            emissionFactorId: factor.id,
            co2eKg: co2e,
            autoCalculated: true,
            anomalyFlag: false,
            createdAt: date,
          },
        });
      }
    }
  }

  console.log("Seed complete: departments, categories, emission factors, 4 role users, ~6 months of carbon history.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
