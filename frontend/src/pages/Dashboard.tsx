// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import PredictionForm from "../components/PredictionForm";
import TrendChart from "../components/TrendCharts";
import api from "../api/api";
import type { MeasurementOut } from "../types";

export default function Dashboard() {
  const [history, setHistory] = useState<MeasurementOut[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get<MeasurementOut[]>("/predictions");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <PredictionForm onNewMeasurement={() => {
        // prepend new measurement from API (optional)
        fetchHistory();
      }} />

      <div style={{ display: "grid", gap: 12 }}>
        <TrendChart history={history} />
        <section style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
          <h3>Latest measurement</h3>
          {loading ? <div>Loading…</div> : (
            <div>
              {history.length === 0 ? <div>No measurements yet</div> : (
                <div>
                  <div>Latest risk: <strong>{history[0].risk_score}</strong></div>
                  <div>Recorded: {history[0].created_at}</div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
