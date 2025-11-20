import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface OnboardingData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activity: string;
  sleep: string;
  smoker: string;
  alcohol_units_per_week: string;
}

interface UserContextType {
  onboardingData: OnboardingData;
  setOnboardingData: (data: OnboardingData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity: "",
    sleep: "",
    smoker: "",
    alcohol_units_per_week: ""
  });

  return (
    <UserContext.Provider value={{ onboardingData, setOnboardingData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
