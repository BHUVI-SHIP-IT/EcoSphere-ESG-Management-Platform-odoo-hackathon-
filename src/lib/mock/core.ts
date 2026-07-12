import type { Category, Department, EmissionFactor, User } from "@/lib/types";

export const departments: Department[] = [
  { id: "dep-mfg", name: "Manufacturing", parentId: null, headcount: 320, totalScore: 71, environmentalScore: 62, socialScore: 78, governanceScore: 76 },
  { id: "dep-log", name: "Logistics & Fleet", parentId: null, headcount: 140, totalScore: 64, environmentalScore: 51, socialScore: 74, governanceScore: 72 },
  { id: "dep-proc", name: "Procurement", parentId: null, headcount: 60, totalScore: 79, environmentalScore: 74, socialScore: 82, governanceScore: 83 },
  { id: "dep-fin", name: "Finance", parentId: null, headcount: 45, totalScore: 85, environmentalScore: 88, socialScore: 80, governanceScore: 87 },
  { id: "dep-hr", name: "People & Culture", parentId: null, headcount: 30, totalScore: 88, environmentalScore: 84, socialScore: 95, governanceScore: 84 },
  { id: "dep-it", name: "Technology", parentId: null, headcount: 90, totalScore: 76, environmentalScore: 70, socialScore: 79, governanceScore: 81 },
];

export const categories: Category[] = [
  { id: "cat-energy", name: "Energy", kind: "emission", color: "amber" },
  { id: "cat-transport", name: "Transport", kind: "emission", color: "sky" },
  { id: "cat-materials", name: "Materials", kind: "emission", color: "stone" },
  { id: "cat-waste", name: "Waste", kind: "emission", color: "rose" },
  { id: "cat-community", name: "Community", kind: "csr", color: "emerald" },
  { id: "cat-education", name: "Education", kind: "csr", color: "violet" },
  { id: "cat-health", name: "Health & Wellbeing", kind: "csr", color: "pink" },
  { id: "cat-env-challenge", name: "Environmental", kind: "challenge", color: "green" },
  { id: "cat-social-challenge", name: "Social", kind: "challenge", color: "blue" },
  { id: "cat-gov-challenge", name: "Governance", kind: "challenge", color: "orange" },
  { id: "cat-data-privacy", name: "Data & Privacy", kind: "compliance", color: "indigo" },
  { id: "cat-safety", name: "Health & Safety", kind: "compliance", color: "red" },
  { id: "cat-ethics", name: "Ethics & Conduct", kind: "compliance", color: "teal" },
];

export const users: User[] = [
  { id: "usr-admin", name: "Ada Okafor", email: "ada@ecosphere.io", role: "admin", departmentId: "dep-it", title: "Platform Admin", xp: 4200, level: 9, avatarUrl: "" },
  { id: "usr-mgr", name: "Marco Reyes", email: "marco@ecosphere.io", role: "esg_manager", departmentId: "dep-proc", title: "Head of Sustainability", xp: 6100, level: 12, avatarUrl: "" },
  { id: "usr-emp", name: "Lena Cho", email: "lena@ecosphere.io", role: "employee", departmentId: "dep-mfg", title: "Process Engineer", xp: 1850, level: 5, avatarUrl: "" },
  { id: "usr-aud", name: "Priya Nair", email: "priya@ecosphere.io", role: "auditor", departmentId: "dep-fin", title: "Internal Auditor", xp: 2400, level: 6, avatarUrl: "" },
  { id: "usr-emp2", name: "Tomás Vidal", email: "tomas@ecosphere.io", role: "employee", departmentId: "dep-log", title: "Fleet Coordinator", xp: 3100, level: 7, avatarUrl: "" },
  { id: "usr-emp3", name: "Sara Lindqvist", email: "sara@ecosphere.io", role: "employee", departmentId: "dep-hr", title: "People Ops Lead", xp: 5200, level: 11, avatarUrl: "" },
  { id: "usr-emp4", name: "Wei Zhang", email: "wei@ecosphere.io", role: "employee", departmentId: "dep-it", title: "SRE", xp: 2750, level: 6, avatarUrl: "" },
  { id: "usr-emp5", name: "Fatima Al-Sayed", email: "fatima@ecosphere.io", role: "employee", departmentId: "dep-mfg", title: "Line Supervisor", xp: 990, level: 3, avatarUrl: "" },
];

export const currentUserByRole = {
  admin: "usr-admin",
  esg_manager: "usr-mgr",
  employee: "usr-emp",
  auditor: "usr-aud",
} as const;

export const emissionFactors: EmissionFactor[] = [
  { id: "ef-elec", name: "Grid Electricity", categoryId: "cat-energy", unit: "kWh", co2ePerUnit: 0.233, source: "DEFRA 2024", updatedAt: "2026-01-15" },
  { id: "ef-natgas", name: "Natural Gas", categoryId: "cat-energy", unit: "kWh", co2ePerUnit: 0.183, source: "DEFRA 2024", updatedAt: "2026-01-15" },
  { id: "ef-diesel", name: "Diesel (fleet)", categoryId: "cat-transport", unit: "L", co2ePerUnit: 2.68, source: "GHG Protocol", updatedAt: "2026-02-01" },
  { id: "ef-petrol", name: "Petrol (fleet)", categoryId: "cat-transport", unit: "L", co2ePerUnit: 2.31, source: "GHG Protocol", updatedAt: "2026-02-01" },
  { id: "ef-air", name: "Air Freight", categoryId: "cat-transport", unit: "tonne-km", co2ePerUnit: 0.602, source: "GHG Protocol", updatedAt: "2026-02-01" },
  { id: "ef-steel", name: "Steel", categoryId: "cat-materials", unit: "kg", co2ePerUnit: 1.85, source: "Ecoinvent", updatedAt: "2025-11-20" },
  { id: "ef-plastic", name: "Polymer Resin", categoryId: "cat-materials", unit: "kg", co2ePerUnit: 2.7, source: "Ecoinvent", updatedAt: "2025-11-20" },
  { id: "ef-paper", name: "Paper & Card", categoryId: "cat-materials", unit: "kg", co2ePerUnit: 0.94, source: "Ecoinvent", updatedAt: "2025-11-20" },
  { id: "ef-waste", name: "Landfill Waste", categoryId: "cat-waste", unit: "kg", co2ePerUnit: 0.46, source: "DEFRA 2024", updatedAt: "2026-01-15" },
];

export function deptName(id: string | null): string {
  if (!id) return "Org-wide";
  return departments.find((d) => d.id === id)?.name ?? "Unknown";
}

export function userName(id: string): string {
  return users.find((u) => u.id === id)?.name ?? "Unknown";
}

export function userById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function categoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? "Unknown";
}

export function factorById(id: string): EmissionFactor | undefined {
  return emissionFactors.find((f) => f.id === id);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
