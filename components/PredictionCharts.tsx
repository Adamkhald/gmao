"use client";

import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface PredictionData {
    step: number;
    actual: number;
    predicted: number;
}

interface AllPredictions {
    failures: PredictionData[];
    downtime: PredictionData[];
    workload: PredictionData[];
}

export default function PredictionCharts() {
    const [data, setData] = useState<AllPredictions | null>(null);

    useEffect(() => {
        fetch("/data/ml_predictions.json")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.error("Failed to load predictions", err));
    }, []);

    if (!data) return <div className="p-4">Chargement des prédictions...</div>;

    const createChartData = (
        items: PredictionData[],
        label: string,
        color: string
    ) => ({
        labels: items.map((i) => `S${i.step}`),
        datasets: [
            {
                label: "Réel",
                data: items.map((i) => i.actual),
                borderColor: "rgba(100, 116, 139, 0.5)",
                backgroundColor: "rgba(100, 116, 139, 0.1)",
                borderDash: [5, 5],
                tension: 0.4,
            },
            {
                label: `Prédiction (${label})`,
                data: items.map((i) => i.predicted),
                borderColor: color,
                backgroundColor: color.replace("1)", "0.1)"),
                tension: 0.4,
            },
        ],
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Prévision des Pannes</h3>
                <Line
                    data={createChartData(data.failures, "Pannes", "rgba(239, 68, 68, 1)")}
                    options={options}
                />
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Prévision des Arrêts (h)</h3>
                <Line
                    data={createChartData(
                        data.downtime,
                        "Heures",
                        "rgba(245, 158, 11, 1)"
                    )}
                    options={options}
                />
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">
                    Prévision de la Charge de Travail (Workload)
                </h3>
                <Line
                    data={createChartData(
                        data.workload,
                        "Heures Tech",
                        "rgba(59, 130, 246, 1)"
                    )}
                    options={options}
                />
            </div>
        </div>
    );
}
