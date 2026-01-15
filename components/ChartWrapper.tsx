"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,
} from "chart.js";

// Register at module level - this is critical!
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  BarController
);

interface ChartWrapperProps {
  title: string;
  type: "doughnut" | "bar";
  data: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor: string | string[];
      borderRadius?: number;
    }[];
  };
  options?: any;
  fullWidth?: boolean;
}

export default function ChartWrapper({
  title,
  type,
  data,
  options,
  fullWidth = false,
}: ChartWrapperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Create new chart
    try {
      chartRef.current = new ChartJS(ctx, {
        type,
        data,
        options: options || {},
      });
    } catch (error) {
      console.error("Chart creation error:", error);
    }

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [type, data, options]);

  return (
    <div
      className={`bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 ${
        fullWidth ? "col-span-full" : ""
      }`}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="relative">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}