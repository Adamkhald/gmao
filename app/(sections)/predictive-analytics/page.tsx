'use client'

import PredictionCharts from "@/components/PredictionCharts";
import { useUser } from "@/components/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PredictiveAnalyticsPage() {
    const { role, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && role !== 'manager') {
            router.push('/');
        }
    }, [role, loading, router]);

    if (loading || role !== 'manager') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Maintenance Prédictive (IA)
                </h1>
                <p className="text-[var(--text-light)]">
                    Analyse prévisionnelle basée sur les modèles LSTM entraînés sur votre historique de maintenance.
                </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-500">
                    <strong>Note :</strong> Ces prédictions sont générées par des réseaux de neurones récurrents (LSTM) analysant les séquences temporelles passées pour anticiper les futures tendances.
                </p>
            </div>

            <PredictionCharts />
        </div>
    );
}
