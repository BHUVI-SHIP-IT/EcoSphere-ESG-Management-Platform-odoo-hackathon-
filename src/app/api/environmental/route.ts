import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const transactions = await prisma.carbonTransaction.findMany({
    include: { department: true, emissionFactor: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalCo2eKg = transactions.reduce((sum, t) => sum + t.co2eKg, 0);

  // Group by category for a breakdown chart
  const byCategory = new Map<string, number>();
  for (const t of transactions) {
    const cat = t.emissionFactor.category.name;
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + t.co2eKg);
  }

  // Group by department
  const byDepartment = new Map<string, number>();
  for (const t of transactions) {
    const dept = t.department.name;
    byDepartment.set(dept, (byDepartment.get(dept) ?? 0) + t.co2eKg);
  }

  // Simple score: lower emissions relative to a baseline = higher score (0-100)
  // Baseline is a placeholder target; replace with real target when available.
  const baselineKg = 50000;
  const environmentalScore = Math.max(
    0,
    Math.min(100, Math.round(100 - (totalCo2eKg / baselineKg) * 100))
  );

  return NextResponse.json({
    totalCo2eKg: Math.round(totalCo2eKg),
    totalCo2eTonnes: Math.round(totalCo2eKg / 1000),
    environmentalScore,
    byCategory: Array.from(byCategory.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    })),
    byDepartment: Array.from(byDepartment.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    })),
    transactionCount: transactions.length,
  });
}