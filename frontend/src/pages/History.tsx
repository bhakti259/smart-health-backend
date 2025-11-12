// src/pages/History.tsx
import { useEffect, useState } from "react";
import api from "../api/api";
import type { MeasurementOut } from "../types";
import { formatDateShort } from "../utils/format";

export default function History() {
  const [items, setItems] = useState<MeasurementOut[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get<MeasurementOut[]>("/predictions?limit=100");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <section>
      <h2>Prediction History</h2>
      {loading ? <div>Loading…</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th>ID</th>
              <th>Recorded</th>
              <th>Age</th>
              <th>BMI</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                <td>{it.id}</td>
                <td>{formatDateShort(it.created_at)}</td>
                <td>{it.age}</td>
                <td>{it.bmi ?? "-"}</td>
                <td>{it.risk_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
