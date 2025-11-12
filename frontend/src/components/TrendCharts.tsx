// src/components/TrendChart.tsx
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import type { MeasurementOut } from "../types";
import 'chart.js/auto';
import { formatDateShort } from "../utils/format";

type Props = { history: MeasurementOut[] };

export default function TrendChart({ history }: Props) {
  const reversed = [...history].reverse(); // oldest -> newest
  const labels = reversed.map((h) => formatDateShort(h.created_at));
  const dataPoints = reversed.map((h) => Number(h.risk_score));

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Risk score",
        data: dataPoints,
        tension: 0.2,
        fill: false,
        pointRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: { stepSize: 0.1 },
      },
    },
  };

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
      <h3>Risk Score Trend</h3>
      {history.length === 0 ? (
        <div style={{ padding: 12 }}>No history yet. Submit a measurement to see the trend.</div>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
}
