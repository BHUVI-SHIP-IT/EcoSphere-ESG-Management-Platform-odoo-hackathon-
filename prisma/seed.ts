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
