"use client";

import ChartWrapper from "./ChartWrapper";

interface ChartDataProps {
  chartData: {
    failuresByType: Record<string, number>;
    downtimeByType: [string, number][];
    failuresByMachine: [string, number][];
    costByType: [string, number][];
    techWorkload: [string, number][];
  };
}

export default function DashboardCharts({ chartData }: ChartDataProps) {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  const failureTypeData = {
    labels: Object.keys(chartData.failuresByType),
    datasets: [
      {
        data: Object.values(chartData.failuresByType),
        backgroundColor: colors,
      },
    ],
  };

  const failureTypeOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          color: "var(--text)",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  const downtimeData = {
    labels: chartData.downtimeByType.map(([type]) => type),
    datasets: [
      {
        label: "Temps d'arrêt (heures)",
        data: chartData.downtimeByType.map(([, hours]) => hours),
        backgroundColor: "#ef4444",
        borderRadius: 6,
      },
    ],
  };

  const horizontalBarOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "var(--text)" },
        grid: { color: "var(--border)" },
      },
      y: {
        ticks: { color: "var(--text)" },
        grid: { display: false },
      },
    },
  };

  const machineData = {
    labels: chartData.failuresByMachine.map(([machine]) => machine),
    datasets: [
      {
        label: "Nombre de pannes",
        data: chartData.failuresByMachine.map(([, count]) => count),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const verticalBarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "var(--text)",
          stepSize: 1,
        },
        grid: { color: "var(--border)" },
      },
      x: {
        ticks: { color: "var(--text)" },
        grid: { display: false },
      },
    },
  };

  const costData = {
    labels: chartData.costByType.map(([type]) => type),
    datasets: [
      {
        label: "Coût total (€)",
        data: chartData.costByType.map(([, cost]) => cost),
        backgroundColor: "#f59e0b",
        borderRadius: 6,
      },
    ],
  };

  const workloadData = {
    labels: chartData.techWorkload.map(([tech]) => tech),
    datasets: [
      {
        label: "Heures travaillées",
        data: chartData.techWorkload.map(([, hours]) => hours),
        backgroundColor: "#10b981",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartWrapper
        title="Répartition des Pannes par Type"
        type="doughnut"
        data={failureTypeData}
        options={failureTypeOptions}
      />
      <ChartWrapper
        title="Distribution des Temps d'Arrêt"
        type="bar"
        data={downtimeData}
        options={horizontalBarOptions}
      />
      <ChartWrapper
        title="Pannes par Machine"
        type="bar"
        data={machineData}
        options={verticalBarOptions}
        fullWidth
      />
      <ChartWrapper
        title="Analyse des Coûts par Type de Panne"
        type="bar"
        data={costData}
        options={verticalBarOptions}
      />
      <ChartWrapper
        title="Heures de Main d'Œuvre par Technicien"
        type="bar"
        data={workloadData}
        options={horizontalBarOptions}
      />
    </div>
  );
}