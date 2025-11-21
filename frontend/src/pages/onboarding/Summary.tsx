import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api";

export default function Summary() {
  const { onboardingData } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finish = async () => {
    setLoading(true);
    setError("");

    try {
      // Map activity level to exercise hours per week
      const activityMap: { [key: string]: number } = {
        "sedentary": 0,
        "moderate": 3,
        "active": 7
      };

      const payload = {
        age: parseInt(onboardingData.age),
        weight_kg: parseFloat(onboardingData.weight),
        height_cm: parseFloat(onboardingData.height),
        smoker: onboardingData.smoker === "true",
        alcohol_units_per_week: parseInt(onboardingData.alcohol_units_per_week || "0"),
        exercise_hours_per_week: activityMap[onboardingData.activity.toLowerCase()] || 0
      };

      const response = await api.post("/predictions", payload);
      console.log("Prediction created:", response.data);
      
      // Navigate to dashboard with success
      navigate("/");
    } catch (err: any) {
      console.error("Failed to submit onboarding data:", err);
      setError(err.response?.data?.detail || "Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        <h2 className="text-3xl font-bold mb-2 text-indigo-500 text-center">
          Review Your Information
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Step 4 of 4
        </p>

        <div className="bg-gray-50 p-6 rounded-xl mb-8 border-2 border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Age</p>
              <p className="text-lg font-semibold text-gray-800">{onboardingData.age}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Gender</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{onboardingData.gender}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Height</p>
              <p className="text-lg font-semibold text-gray-800">{onboardingData.height} cm</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Weight</p>
              <p className="text-lg font-semibold text-gray-800">{onboardingData.weight} kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Activity</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{onboardingData.activity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Sleep</p>
              <p className="text-lg font-semibold text-gray-800">{onboardingData.sleep} hrs</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Smoker</p>
              <p className="text-lg font-semibold text-gray-800">{onboardingData.smoker === 'true' ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Alcohol/Week</p>
              <p className="text-lg font-semibold text-gray-800">{onboardingData.alcohol_units_per_week} units</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/onboarding/step3')}
            disabled={loading}
            className="flex-1 p-3.5 bg-white text-indigo-500 border-2 border-indigo-500 rounded-lg text-base font-semibold hover:bg-gray-50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={finish}
            disabled={loading}
            className="flex-1 p-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-base font-semibold hover:-translate-y-0.5 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "✓ Finish"}
          </button>
        </div>
      </div>
    </div>
  );
}
