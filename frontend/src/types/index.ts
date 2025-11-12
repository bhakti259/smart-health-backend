// src/types/index.ts
export interface MeasurementIn {
  age: number;
  weight_kg: number;
  height_cm: number;
  smoker?: boolean;
  alcohol_units_per_week?: number;
  exercise_hours_per_week?: number;
}

export interface MeasurementOut {
  id: number;
  user_id?: number;
  age: number;
  bmi?: number;
  risk_score: number;
  created_at: string;
}
