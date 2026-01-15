export interface FailureData {
  "Type de panne": string;
  "Durée arrêt (h)": string;
  "Désignation": string;
  [key: string]: string;
}

export interface WorkloadData {
  "Type de panne": string;
  "Nombre d'heures": string;
  "Coût total intervention": string;
  "[MO interne].Prénom": string;
  [key: string]: string;
}

export interface KPIStats {
  totalFailures: number;
  totalDowntime: number;
  totalCost: number;
  avgDuration: number;
}

export interface ChartDataset {
  labels: string[];
  data: number[];
  backgroundColor?: string | string[];
  borderRadius?: number;
  label?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  created_by: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_at: string;
  assignee?: { email: string };
}