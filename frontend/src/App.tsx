// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import Step1Basic from "./pages/onboarding/step1Basic";
import Step2Body from "./pages/onboarding/step2Body";
import Step3LifeStyle from "./pages/onboarding/step3LifeStyle";
import Summary from "./pages/onboarding/summary";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      Loading...
    </div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/onboarding/step1" element={<Step1Basic />} />
              <Route path="/onboarding/step2" element={<Step2Body />} />
              <Route path="/onboarding/step3" element={<Step3LifeStyle />} />
              <Route path="/onboarding/summary" element={<Summary />} />
              <Route index element={<Dashboard />} />
              <Route path="history" element={<History />} />
            </Route>
          </Routes>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
