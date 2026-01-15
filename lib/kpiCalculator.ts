import { FailureData, WorkloadData, KPIStats } from "@/types";

export function calculateKPIs(
  failures: FailureData[],
  workload: WorkloadData[]
): KPIStats {
  const totalFailures = failures.length;

  const totalDowntime = failures.reduce((sum, row) => {
    const duration = parseFloat(row["Durée arrêt (h)"]?.replace(",", ".") || "0");
    return sum + duration;
  }, 0);

  const totalCost = workload.reduce((sum, row) => {
    const cost = parseFloat(
      row["Coût total intervention"]?.replace(",", ".") || "0"
    );
    return sum + cost;
  }, 0);

  const avgDuration = totalFailures > 0 ? totalDowntime / totalFailures : 0;

  return {
    totalFailures,
    totalDowntime,
    totalCost,
    avgDuration,
  };
}

export function getFailuresByType(failures: FailureData[]): Record<string, number> {
  const result: Record<string, number> = {};
  failures.forEach((row) => {
    const type = row["Type de panne"];
    result[type] = (result[type] || 0) + 1;
  });
  return result;
}

export function getDowntimeByType(failures: FailureData[]): Record<string, number> {
  const result: Record<string, number> = {};
  failures.forEach((row) => {
    const type = row["Type de panne"];
    const duration = parseFloat(row["Durée arrêt (h)"]?.replace(",", ".") || "0");
    result[type] = (result[type] || 0) + duration;
  });
  return result;
}

export function getFailuresByMachine(failures: FailureData[]): Record<string, number> {
  const result: Record<string, number> = {};
  failures.forEach((row) => {
    const machine = row["Désignation"];
    result[machine] = (result[machine] || 0) + 1;
  });
  return result;
}

export function getCostByType(workload: WorkloadData[]): Record<string, number> {
  const result: Record<string, number> = {};
  workload.forEach((row) => {
    const type = row["Type de panne"];
    const cost = parseFloat(
      row["Coût total intervention"]?.replace(",", ".") || "0"
    );
    result[type] = (result[type] || 0) + cost;
  });
  return result;
}

export function getTechnicianWorkload(workload: WorkloadData[]): Record<string, number> {
  const result: Record<string, number> = {};
  workload.forEach((row) => {
    const tech = row["[MO interne].Prénom"];
    const hours = parseFloat(row["Nombre d'heures"]?.replace(",", ".") || "0");
    if (tech) {
      result[tech] = (result[tech] || 0) + hours;
    }
  });
  return result;
}

export function sortByValue(obj: Record<string, number>): [string, number][] {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]);
}