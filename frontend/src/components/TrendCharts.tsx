// src/components/TrendChart.tsx
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import type { MeasurementOut } from "../types";
import 'chart.js/auto';

type Props = { history: MeasurementOut[] };

export default function TrendChart({ history }: Props) {
  // Calculate risk distribution
  const highRisk = history.filter(p => Number(p.risk_score) >= 0.7).length;
  const mediumRisk = history.filter(p => Number(p.risk_score) >= 0.4 && Number(p.risk_score) < 0.7).length;
  const lowRisk = history.filter(p => Number(p.risk_score) < 0.4).length;

  const data: ChartData<"bar"> = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        label: 'Number of Patients',
        data: [lowRisk, mediumRisk, highRisk],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',   // green
          'rgba(234, 179, 8, 0.7)',   // yellow
          'rgba(239, 68, 68, 0.7)',   // red
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Patient Risk Distribution',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#4f46e5',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Number of Patients',
          font: {
            size: 14,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-100">
      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No patient data yet</p>
          <p className="text-sm mt-2">Risk distribution will appear here once patients are assessed</p>
        </div>
      ) : (
        <div style={{ height: '300px' }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
