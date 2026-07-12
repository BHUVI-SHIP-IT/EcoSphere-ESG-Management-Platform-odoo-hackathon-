import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // --- Diversity metrics (from User table) ---
  const users = await prisma.user.findMany({
    select: { gender: true, ageBand: true, isLeadership: true },
  });

  const genderCounts = new Map<string, number>();
  const ageCounts = new Map<string, number>();
  let womenLeaders = 0;
  let menLeaders = 0;

  for (const u of users) {
    if (u.gender) genderCounts.set(u.gender, (genderCounts.get(u.gender) ?? 0) + 1);
    if (u.ageBand) ageCounts.set(u.ageBand, (ageCounts.get(u.ageBand) ?? 0) + 1);
    if (u.isLeadership) {
      if (u.gender === "Woman") womenLeaders++;
      else if (u.gender === "Man") menLeaders++;
    }
  }

  const diversityMetrics = [
    {
      dimension: "Gender",
      segments: Array.from(genderCounts.entries()).map(([label, count]) => ({ label, count })),
    },
    {
      dimension: "Age band",
      segments: Array.from(ageCounts.entries()).map(([label, count]) => ({ label, count })),
    },
    {
      dimension: "Leadership",
      segments: [
        { label: "Women in leadership", count: womenLeaders },
        { label: "Men in leadership", count: menLeaders },
      ],
    },
  ];

  // --- Training records (from TrainingRecord + TrainingCourse) ---
  const trainingRecordsRaw = await prisma.trainingRecord.findMany({
    include: { user: { include: { department: true } }, course: true },
  });

  const trainingRecords = trainingRecordsRaw.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.user.name,
    departmentId: r.user.departmentId,
    departmentName: r.user.department?.name ?? "Unknown",
    courseName: r.course.name,
    completion: r.completion,
    completedAt: r.completedAt,
  }));

  // Group by department for the trainingByDept chart
  const deptTotals = new Map<string, { sum: number; count: number }>();
  for (const r of trainingRecordsRaw) {
    const deptName = r.user.department?.name ?? "Unknown";
    const entry = deptTotals.get(deptName) ?? { sum: 0, count: 0 };
    entry.sum += r.completion;
    entry.count += 1;
    deptTotals.set(deptName, entry);
  }
  const trainingByDept = Array.from(deptTotals.entries()).map(([dept, { sum, count }]) => ({
    dept,
    completion: Math.round(sum / count),
  }));

  // --- CSR activities + participations ---
  const csrActivities = await prisma.cSRActivity.findMany({
    include: { department: true, participations: true },
    orderBy: { createdAt: "desc" },
  });

  const csrActivitiesOut = csrActivities.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    departmentId: a.departmentId,
    departmentName: a.department.name,
    participantCount: a.participations.length,
  }));

  const participationsRaw = await prisma.participation.findMany({
    include: { user: true, csrActivity: true },
    orderBy: { createdAt: "desc" },
  });

  const participations = participationsRaw.map((p) => ({
    id: p.id,
    activityId: p.csrActivityId,
    activityTitle: p.csrActivity.title,
    userId: p.userId,
    userName: p.user.name,
    status: p.status,
    proofUrl: p.proofUrl,
    submittedAt: p.createdAt,
  }));

  // --- Simple social score: blend of avg training completion + approval rate ---
  const avgTrainingCompletion =
    trainingRecordsRaw.length > 0
      ? trainingRecordsRaw.reduce((sum, r) => sum + r.completion, 0) / trainingRecordsRaw.length
      : 0;
  const approvedCount = participationsRaw.filter((p) => p.status === "APPROVED").length;
  const approvalRate =
    participationsRaw.length > 0 ? (approvedCount / participationsRaw.length) * 100 : 0;
  const socialScore = Math.round(avgTrainingCompletion * 0.6 + approvalRate * 0.4);

  return NextResponse.json({
    socialScore,
    diversityMetrics,
    trainingRecords,
    trainingByDept,
    csrActivities: csrActivitiesOut,
    participations,
  });
}