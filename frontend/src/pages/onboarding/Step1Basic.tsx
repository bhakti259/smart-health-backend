import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function Step1Basic() {
  const { onboardingData, setOnboardingData } = useUser();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: onboardingData
  });

  const onSubmit = (data: any) => {
    setOnboardingData({ ...onboardingData, ...data });
    navigate("/onboarding/step2");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold mb-2 text-indigo-500 text-center">
          Tell us about yourself
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Step 1 of 4
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Age
            </label>
            <input
              {...register("age")}
              type="number"
              placeholder="Enter your age"
              required
              className="w-full p-3.5 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Gender
            </label>
            <select
              {...register("gender")}
              required
              className="w-full p-3.5 border-2 border-gray-200 rounded-lg text-base bg-white cursor-pointer focus:border-indigo-500 focus:outline-none transition-colors"
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold mt-4 hover:-translate-y-0.5 transition-transform shadow-lg"
          >
            Next →
          </button>
        </form>
      </div>
    </div>
  );
}
