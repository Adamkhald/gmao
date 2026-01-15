'use client'

import { useUser } from "@/components/UserProvider";
import TaskList from "@/components/TaskList";
import { useEffect, useState } from "react";
import {
  calculateKPIs,
  getFailuresByType,
  getDowntimeByType,
  getFailuresByMachine,
  getCostByType,
  getTechnicianWorkload,
  sortByValue,
} from "@/lib/kpiCalculator";
import StatCard from "@/components/StatCard";
import DashboardCharts from "@/components/DashboardCharts";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { role, loading } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // In a real app, you might want to fetch only what's needed based on role
      // But for now, we'll keep the existing data loading logic
      try {
        const response = await fetch('/api/dashboard-data');
        const { allFailures, workloadData } = await response.json();

        const kpis = calculateKPIs(allFailures, workloadData);
        const failuresByType = getFailuresByType(allFailures);
        const downtimeByType = sortByValue(getDowntimeByType(allFailures));
        const failuresByMachine = sortByValue(getFailuresByMachine(allFailures));
        const costByType = sortByValue(getCostByType(workloadData));
        const techWorkload = sortByValue(getTechnicianWorkload(workloadData));

        setDashboardData({
          kpis,
          chartData: {
            failuresByType,
            downtimeByType,
            failuresByMachine,
            costByType,
            techWorkload,
          }
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setDataLoading(false);
      }
    };

    if (role === 'manager') {
      fetchData();
    } else {
      setDataLoading(false);
    }
  }, [role]);

  if (loading || (role === 'manager' && dataLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
        <p className="text-[var(--text-light)] animate-pulse">Chargement de votre session...</p>
      </div>
    );
  }

  if (role === 'technician') {
    return (
      <div className="max-w-[1400px] mx-auto px-8 py-8 animation-fade-in">
        <TaskList />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-8 animation-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tableau de Bord GMAO</h1>
        <p className="text-[var(--text-light)]">
          Vue d'ensemble des indicateurs de performance
        </p>
      </div>

      {dashboardData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Pannes"
              value={dashboardData.kpis.totalFailures}
              trend="Depuis le début"
            />
            <StatCard
              label="Temps d'Arrêt Total"
              value={`${dashboardData.kpis.totalDowntime.toFixed(1)}h`}
              trend="Temps d'arrêt cumulé"
            />
            <StatCard
              label="Coût Total"
              value={`${dashboardData.kpis.totalCost.toFixed(0)} €`}
              trend="Coût total interventions"
            />
            <StatCard
              label="Durée Moyenne Arrêt"
              value={`${dashboardData.kpis.avgDuration.toFixed(2)}h`}
              trend="Par intervention"
            />
          </div>

          <DashboardCharts chartData={dashboardData.chartData} />
        </>
      )}
    </div>
  );
}