import type {
  CarbonTransaction,
  ErpRecordBase,
  SustainabilityGoal,
} from "@/lib/types";

// A handful of ERP stub records that carbon transactions trace back to.
export const erpRecords: ErpRecordBase[] = [
  { id: "erp-1", sourceType: "fleet", departmentId: "dep-log", date: "2026-07-02", reference: "FLEET-2201", quantity: 820, unit: "L", categoryId: "cat-transport", amount: 1230, description: "Diesel refuel — regional delivery fleet" },
  { id: "erp-2", sourceType: "purchase", departmentId: "dep-proc", date: "2026-07-03", reference: "PO-88134", quantity: 4200, unit: "kg", categoryId: "cat-materials", amount: 15400, description: "Steel stock for Q3 production" },
  { id: "erp-3", sourceType: "manufacturing", departmentId: "dep-mfg", date: "2026-07-04", reference: "MFG-5567", quantity: 18500, unit: "kWh", categoryId: "cat-energy", amount: 4200, description: "Line 3 electricity draw" },
  { id: "erp-4", sourceType: "expense", departmentId: "dep-it", date: "2026-07-05", reference: "EXP-3390", quantity: 2600, unit: "kg", categoryId: "cat-materials", amount: 5100, description: "Polymer resin for enclosures" },
  { id: "erp-5", sourceType: "fleet", departmentId: "dep-log", date: "2026-07-08", reference: "FLEET-2247", quantity: 2450, unit: "L", categoryId: "cat-transport", amount: 3680, description: "Diesel refuel — SPIKE (see anomaly)" },
  { id: "erp-6", sourceType: "manufacturing", departmentId: "dep-mfg", date: "2026-07-09", reference: "MFG-5590", quantity: 16900, unit: "kWh", categoryId: "cat-energy", amount: 3850, description: "Line 1 electricity draw" },
  { id: "erp-7", sourceType: "purchase", departmentId: "dep-proc", date: "2026-07-10", reference: "PO-88201", quantity: 900, unit: "kg", categoryId: "cat-materials", amount: 860, description: "Paper & packaging" },
  { id: "erp-8", sourceType: "expense", departmentId: "dep-fin", date: "2026-07-06", reference: "EXP-3401", quantity: 5400, unit: "kWh", categoryId: "cat-energy", amount: 1260, description: "HQ office electricity" },
];

function sparkline(base: number, n = 8): number[] {
  // deterministic pseudo-history around a baseline
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const wobble = ((i * 37) % 11) / 10 - 0.5; // -0.5..0.5
    out.push(Math.round(base * (1 + wobble * 0.18)));
  }
  return out;
}

export const carbonTransactions: CarbonTransaction[] = [
  { id: "ct-1", departmentId: "dep-log", sourceType: "fleet", sourceRecordId: "erp-1", emissionFactorId: "ef-diesel", quantity: 820, unit: "L", co2eKg: Math.round(820 * 2.68), autoCalculated: true, date: "2026-07-02" },
  { id: "ct-2", departmentId: "dep-proc", sourceType: "purchase", sourceRecordId: "erp-2", emissionFactorId: "ef-steel", quantity: 4200, unit: "kg", co2eKg: Math.round(4200 * 1.85), autoCalculated: true, date: "2026-07-03" },
  { id: "ct-3", departmentId: "dep-mfg", sourceType: "manufacturing", sourceRecordId: "erp-3", emissionFactorId: "ef-elec", quantity: 18500, unit: "kWh", co2eKg: Math.round(18500 * 0.233), autoCalculated: true, date: "2026-07-04" },
  { id: "ct-4", departmentId: "dep-it", sourceType: "expense", sourceRecordId: "erp-4", emissionFactorId: "ef-plastic", quantity: 2600, unit: "kg", co2eKg: Math.round(2600 * 2.7), autoCalculated: true, date: "2026-07-05" },
  {
    id: "ct-5",
    departmentId: "dep-log",
    sourceType: "fleet",
    sourceRecordId: "erp-5",
    emissionFactorId: "ef-diesel",
    quantity: 2450,
    unit: "L",
    co2eKg: Math.round(2450 * 2.68),
    autoCalculated: true,
    date: "2026-07-08",
    anomaly: {
      isAnomaly: true,
      zScore: 3.4,
      baselineMean: Math.round(820 * 2.68),
      history: [...sparkline(820 * 2.68, 7), Math.round(2450 * 2.68)],
    },
  },
  { id: "ct-6", departmentId: "dep-mfg", sourceType: "manufacturing", sourceRecordId: "erp-6", emissionFactorId: "ef-elec", quantity: 16900, unit: "kWh", co2eKg: Math.round(16900 * 0.233), autoCalculated: true, date: "2026-07-09" },
  { id: "ct-7", departmentId: "dep-proc", sourceType: "purchase", sourceRecordId: "erp-7", emissionFactorId: "ef-paper", quantity: 900, unit: "kg", co2eKg: Math.round(900 * 0.94), autoCalculated: true, date: "2026-07-10" },
  { id: "ct-8", departmentId: "dep-fin", sourceType: "expense", sourceRecordId: "erp-8", emissionFactorId: "ef-elec", quantity: 5400, unit: "kWh", co2eKg: Math.round(5400 * 0.233), autoCalculated: false, date: "2026-07-06" },
];

// Monthly emission trend per department (t CO2e) for charts.
export const carbonTrend: { month: string; [dept: string]: number | string }[] = [
  { month: "Feb", "dep-mfg": 142, "dep-log": 98, "dep-proc": 40, "dep-it": 22, "dep-fin": 8, "dep-hr": 4 },
  { month: "Mar", "dep-mfg": 138, "dep-log": 102, "dep-proc": 44, "dep-it": 24, "dep-fin": 9, "dep-hr": 4 },
  { month: "Apr", "dep-mfg": 150, "dep-log": 95, "dep-proc": 38, "dep-it": 21, "dep-fin": 8, "dep-hr": 5 },
  { month: "May", "dep-mfg": 131, "dep-log": 110, "dep-proc": 42, "dep-it": 23, "dep-fin": 7, "dep-hr": 4 },
  { month: "Jun", "dep-mfg": 126, "dep-log": 118, "dep-proc": 39, "dep-it": 25, "dep-fin": 8, "dep-hr": 5 },
  { month: "Jul", "dep-mfg": 119, "dep-log": 141, "dep-proc": 37, "dep-it": 24, "dep-fin": 7, "dep-hr": 4 },
];

export const emissionsBySource: { name: string; value: number }[] = [
  { name: "Energy", value: 38 },
  { name: "Transport", value: 34 },
  { name: "Materials", value: 21 },
  { name: "Waste", value: 7 },
];

export const goals: SustainabilityGoal[] = [
  { id: "goal-1", name: "Cut total emissions 25% YoY", departmentId: null, metric: "Total emissions", target: 300, current: 372, unit: "t CO2e", deadline: "2026-12-31", direction: "reduce" },
  { id: "goal-2", name: "Fleet to 40% EV", departmentId: "dep-log", metric: "EV share", target: 40, current: 28, unit: "%", deadline: "2026-12-31", direction: "increase" },
  { id: "goal-3", name: "100% renewable electricity", departmentId: null, metric: "Renewable share", target: 100, current: 64, unit: "%", deadline: "2027-06-30", direction: "increase" },
  { id: "goal-4", name: "Zero landfill (Manufacturing)", departmentId: "dep-mfg", metric: "Waste to landfill", target: 0, current: 12, unit: "t", deadline: "2026-09-30", direction: "reduce" },
];
