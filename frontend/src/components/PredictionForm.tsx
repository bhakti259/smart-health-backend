// src/components/PredictionForm.tsx
import React, { useState } from "react";
import api from "../api/api";
import type { MeasurementIn } from "../types";

type Props = {
  onNewMeasurement?: (m: any) => void; // call parent to refresh
};

export default function PredictionForm({ onNewMeasurement }: Props) {
  const [form, setForm] = useState<MeasurementIn>({
    age: 45,
    weight_kg: 75,
    height_cm: 170,
    smoker: false,
    alcohol_units_per_week: 0,
    exercise_hours_per_week: 2,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ risk_score: number; bmi: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof MeasurementIn>(k: K, v: MeasurementIn[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/predictions", {
        age: form.age,
        weight_kg: form.weight_kg,
        height_cm: form.height_cm,
        smoker: form.smoker,
        alcohol_units_per_week: form.alcohol_units_per_week,
        exercise_hours_per_week: form.exercise_hours_per_week,
      });
      setResult({ risk_score: res.data.risk_score, bmi: res.data.bmi });
      if (onNewMeasurement) onNewMeasurement(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ border: "1px solid #eee", padding: 16, borderRadius: 8, marginBottom: 20 }}>
      <h2>New Measurement</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
        <label>
          Age
          <input type="number" value={form.age} onChange={(e) => update("age", +e.target.value)} />
        </label>
        <label>
          Weight (kg)
          <input type="number" value={form.weight_kg} onChange={(e) => update("weight_kg", +e.target.value)} />
        </label>
        <label>
          Height (cm)
          <input type="number" value={form.height_cm} onChange={(e) => update("height_cm", +e.target.value)} />
        </label>
        <label>
          Smoker
          <input type="checkbox" checked={!!form.smoker} onChange={(e) => update("smoker", e.target.checked)} />
        </label>
        <label>
          Alcohol units / week
          <input type="number" value={form.alcohol_units_per_week} onChange={(e) => update("alcohol_units_per_week", +e.target.value)} />
        </label>
        <label>
          Exercise hrs / week
          <input type="number" value={form.exercise_hours_per_week} onChange={(e) => update("exercise_hours_per_week", +e.target.value)} />
        </label>

        <div style={{ gridColumn: "1/-1", display: "flex", gap: 8, alignItems: "center" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict Risk"}
          </button>
          <button type="button" onClick={() => { setResult(null); setError(null); }}>
            Reset
          </button>
        </div>
      </form>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 12 }}>
          <strong>Risk score:</strong> {result.risk_score} <br />
          <strong>BMI:</strong> {result.bmi}
          <div style={{ marginTop: 8 }}>
            {result.risk_score >= 0.7 ? (
              <div style={{ padding: 8, background: "#fdecea", color: "#9b1c1c", borderRadius: 6 }}>
                High risk — recommend medical follow up
              </div>
            ) : result.risk_score >= 0.4 ? (
              <div style={{ padding: 8, background: "#fff7e6", color: "#6a4b00", borderRadius: 6 }}>
                Moderate risk — consider lifestyle changes
              </div>
            ) : (
              <div style={{ padding: 8, background: "#ecfdf5", color: "#065f46", borderRadius: 6 }}>
                Low risk — keep up the good habits
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
