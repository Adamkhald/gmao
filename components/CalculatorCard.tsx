"use client";

import { useState } from "react";

interface FieldConfig {
  id: string;
  label: string;
  type: string;
  step?: number;
  min?: number;
  max?: number;
}

interface CalculatorCardProps {
  title: string;
  type: string;
  fields: FieldConfig[];
  calculate: (values: Record<string, number>) => string;
}

export default function CalculatorCard({
  title,
  fields,
  calculate,
}: CalculatorCardProps) {
  const [values, setValues] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedResult = calculate(values);
    setResult(calculatedResult);
  };

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [id]: parseFloat(value) || 0,
    }));
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
        {title}
      </h3>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              {field.label}
            </label>
            <input
              type={field.type}
              step={field.step}
              min={field.min}
              max={field.max}
              required
              className="w-full px-3 py-2 rounded-lg text-sm"
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full px-3 py-2 bg-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
        >
          Calculer
        </button>

        {result && (
          <div className="mt-4 p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-center font-bold text-[var(--accent)] text-xl whitespace-pre-line">
            {result}
          </div>
        )}
      </form>
    </div>
  );
}