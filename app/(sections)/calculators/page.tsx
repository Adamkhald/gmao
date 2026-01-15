'use client'

import CalculatorCard from "@/components/CalculatorCard";
import { useUser } from "@/components/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function CalculatorsPage() {
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
    <div className="max-w-[1400px] mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Calculateurs KPI</h1>
        <p className="text-[var(--text-light)]">
          Calculez vos indicateurs de performance en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CalculatorCard
          title="Calculateur MTBF"
          type="mtbf"
          fields={[
            {
              id: "time",
              label: "Temps total de fonctionnement (heures)",
              type: "number",
              step: 0.1,
            },
            { id: "failures", label: "Nombre de pannes", type: "number" },
          ]}
          calculate={(values) => {
            const result = values.time / values.failures;
            return `${result.toFixed(2)} heures`;
          }}
        />

        <CalculatorCard
          title="Calculateur MTTR"
          type="mttr"
          fields={[
            {
              id: "time",
              label: "Temps total de réparation (heures)",
              type: "number",
              step: 0.1,
            },
            { id: "failures", label: "Nombre de pannes", type: "number" },
          ]}
          calculate={(values) => {
            const result = values.time / values.failures;
            return `${result.toFixed(2)} heures`;
          }}
        />

        <CalculatorCard
          title="Calculateur de Disponibilité"
          type="availability"
          fields={[
            { id: "mtbf", label: "MTBF (heures)", type: "number", step: 0.1 },
            { id: "mttr", label: "MTTR (heures)", type: "number", step: 0.1 },
          ]}
          calculate={(values) => {
            const result = (values.mtbf / (values.mtbf + values.mttr)) * 100;
            return `${result.toFixed(2)}%`;
          }}
        />

        <CalculatorCard
          title="Calculateur OEE"
          type="oee"
          fields={[
            {
              id: "availability",
              label: "Disponibilité (%)",
              type: "number",
              step: 0.1,
              max: 100,
            },
            {
              id: "performance",
              label: "Performance (%)",
              type: "number",
              step: 0.1,
              max: 100,
            },
            {
              id: "quality",
              label: "Qualité (%)",
              type: "number",
              step: 0.1,
              max: 100,
            },
          ]}
          calculate={(values) => {
            const result =
              (values.availability / 100) *
              (values.performance / 100) *
              (values.quality / 100) *
              100;
            return `${result.toFixed(2)}%`;
          }}
        />

        <CalculatorCard
          title="Calculateur RPN"
          type="rpn"
          fields={[
            {
              id: "severity",
              label: "Gravité (1-10)",
              type: "number",
              min: 1,
              max: 10,
            },
            {
              id: "occurrence",
              label: "Occurrence (1-10)",
              type: "number",
              min: 1,
              max: 10,
            },
            {
              id: "detection",
              label: "Détection (1-10)",
              type: "number",
              min: 1,
              max: 10,
            },
          ]}
          calculate={(values) => {
            const result = values.severity * values.occurrence * values.detection;
            let priority = "";
            if (result > 500) priority = " - URGENT";
            else if (result > 200) priority = " - PRIORITAIRE";
            else if (result > 100) priority = " - IMPORTANT";
            else priority = " - NORMAL";
            return `${result}${priority}`;
          }}
        />

        <CalculatorCard
          title="Calculateur Stock Minimum"
          type="stock"
          fields={[
            {
              id: "consumption",
              label: "Consommation moyenne (pièces/mois)",
              type: "number",
              step: 0.1,
            },
            {
              id: "lead",
              label: "Délai réapprovisionnement (mois)",
              type: "number",
              step: 0.1,
            },
            {
              id: "safety",
              label: "Stock de sécurité (pièces)",
              type: "number",
            },
          ]}
          calculate={(values) => {
            const stockMin = values.consumption * values.lead;
            const orderPoint = stockMin + values.safety;
            return `Stock min: ${stockMin.toFixed(1)}\nPoint commande: ${orderPoint.toFixed(1)}`;
          }}
        />
      </div>
    </div>
  );
}