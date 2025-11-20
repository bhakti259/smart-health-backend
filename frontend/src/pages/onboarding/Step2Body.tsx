import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function Step2Body() {
  const { onboardingData, setOnboardingData } = useUser();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: onboardingData
  });

  const onSubmit = (data: any) => {
    setOnboardingData({ ...onboardingData, ...data });
    navigate("/onboarding/step3");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold mb-2 text-indigo-500 text-center">
          Body Metrics
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Step 2 of 4
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              {...register("height")}
              type="number"
              placeholder="Enter your height in cm"
              required
              className="w-full p-3.5 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              {...register("weight")}
              type="number"
              placeholder="Enter your weight in kg"
              required
              className="w-full p-3.5 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/onboarding/step1')}
              className="flex-1 p-3.5 bg-white text-indigo-500 border-2 border-indigo-500 rounded-lg text-base font-semibold hover:bg-gray-50 hover:-translate-y-0.5 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 p-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold hover:-translate-y-0.5 transition-transform shadow-lg"
            >
              Next →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
