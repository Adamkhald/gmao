import Papa from "papaparse";
import { promises as fs } from "fs";
import path from "path";
import { FailureData, WorkloadData } from "@/types";

export async function loadCSV<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", filename);
    const fileContent = await fs.readFile(filePath, "utf-8");

    const parsed = Papa.parse<Record<string, string>>(fileContent, {
      delimiter: ";",
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    return parsed.data as T[];
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

export function normalizeFailureData(
  data: Record<string, string>[]
): FailureData[] {
  if (data.length === 0) return [];

  const cols = Object.keys(data[0]);
  const typeCol = cols.find((c) => c.toLowerCase().includes("type"));
  const dureeCol = cols.find(
    (c) => c.toLowerCase().includes("arr") && c.toLowerCase().includes("t")
  );
  const designCol = cols.find((c) => c.toLowerCase().includes("signation"));

  if (!typeCol || !dureeCol || !designCol) return [];

  return data
    .filter((row) => row[typeCol] && row[dureeCol] && row[designCol])
    .map((row) => ({
      "Type de panne": row[typeCol],
      "Durée arrêt (h)": row[dureeCol],
      Désignation: row[designCol],
      ...row,
    }));
}

export function normalizeWorkloadData(
  data: Record<string, string>[]
): WorkloadData[] {
  if (data.length === 0) return [];

  const cols = Object.keys(data[0]);
  const typeCol = cols.find((c) => c.toLowerCase().includes("type"));
  const heuresCol = cols.find(
    (c) =>
      c.toLowerCase().includes("heure") &&
      !c.toLowerCase().includes("mo interne")
  );
  const coutCol = cols.find(
    (c) =>
      c.toLowerCase().includes("total") &&
      c.toLowerCase().includes("intervention")
  );
  const prenomCol = cols.find(
    (c) => c.toLowerCase().includes("nom") && c.toLowerCase().includes("interne")
  );

  if (!typeCol || !heuresCol || !coutCol) return [];

  return data
    .filter((row) => row[typeCol] && row[heuresCol] && row[coutCol])
    .map((row) => ({
      "Type de panne": row[typeCol],
      "Nombre d'heures": row[heuresCol],
      "Coût total intervention": row[coutCol],
      "[MO interne].Prénom": prenomCol ? row[prenomCol] : "",
      ...row,
    }));
}

export async function loadAllData() {
  const [amdecRaw, gmaoRaw, workloadRaw] = await Promise.all([
    loadCSV("AMDEC.csv"),
    loadCSV("GMAO_Integrator.csv"),
    loadCSV("Workload.csv"),
  ]);

  const amdecData = normalizeFailureData(amdecRaw);
  const gmaoData = normalizeFailureData(gmaoRaw);
  const workloadData = normalizeWorkloadData(workloadRaw);

  const allFailures = [...amdecData, ...gmaoData];

  return {
    amdecData,
    gmaoData,
    workloadData,
    allFailures,
  };
}