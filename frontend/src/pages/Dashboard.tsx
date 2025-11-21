// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import TrendChart from "../components/TrendCharts";
import api from "../api/api";
import type { MeasurementOut } from "../types";

export default function Dashboard() {
  const [patients, setPatients] = useState<MeasurementOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    avgRisk: 0
  });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get<MeasurementOut[]>("/predictions");
      setPatients(res.data);
      
      // Calculate statistics
      const total = res.data.length;
      const highRisk = res.data.filter(p => p.risk_score >= 0.7).length;
      const mediumRisk = res.data.filter(p => p.risk_score >= 0.4 && p.risk_score < 0.7).length;
      const lowRisk = res.data.filter(p => p.risk_score < 0.4).length;
      const avgRisk = total > 0 
        ? res.data.reduce((sum, p) => sum + Number(p.risk_score), 0) / total 
        : 0;
      
      setStats({ total, highRisk, mediumRisk, lowRisk, avgRisk });
    } catch (err) {
      console.error("Failed to fetch patient data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const getRiskBadge = (score: number) => {
    if (score >= 0.7) return { label: "High Risk", color: "bg-red-100 text-red-700 border-red-300" };
    if (score >= 0.4) return { label: "Medium Risk", color: "bg-yellow-100 text-yellow-700 border-yellow-300" };
    return { label: "Low Risk", color: "bg-green-100 text-green-700 border-green-300" };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-xl text-indigo-600">Loading patient data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Healthcare Provider Dashboard</h1>
          <p className="text-gray-600">Monitor patient health risk assessments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-indigo-100">
            <p className="text-sm text-gray-500 mb-1">Total Patients</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-100">
            <p className="text-sm text-gray-500 mb-1">High Risk</p>
            <p className="text-3xl font-bold text-red-600">{stats.highRisk}</p>
            <p className="text-xs text-gray-400 mt-1">≥ 0.7 score</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-yellow-100">
            <p className="text-sm text-gray-500 mb-1">Medium Risk</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.mediumRisk}</p>
            <p className="text-xs text-gray-400 mt-1">0.4 - 0.7</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-100">
            <p className="text-sm text-gray-500 mb-1">Low Risk</p>
            <p className="text-3xl font-bold text-green-600">{stats.lowRisk}</p>
            <p className="text-xs text-gray-400 mt-1">&lt; 0.4 score</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-100">
            <p className="text-sm text-gray-500 mb-1">Average Risk</p>
            <p className="text-3xl font-bold text-purple-600">{stats.avgRisk.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Population avg</p>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="mb-8">
          <TrendChart history={patients} />
        </div>

        {/* Patient Assessments Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Recent Patient Assessments</h2>
          
          {patients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No patient assessments yet</p>
              <p className="text-sm mt-2">New patient data will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-indigo-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Patient ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Age</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">BMI</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Risk Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Risk Level</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Assessment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => {
                    const badge = getRiskBadge(Number(patient.risk_score));
                    return (
                      <tr key={patient.id} className="border-b border-gray-100 hover:bg-indigo-50 transition-colors">
                        <td className="py-3 px-4 font-mono text-sm text-gray-700">#{patient.id}</td>
                        <td className="py-3 px-4 text-gray-700">{patient.age}</td>
                        <td className="py-3 px-4 text-gray-700">{patient.bmi?.toFixed(1)}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-lg text-indigo-600">
                            {Number(patient.risk_score).toFixed(3)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(patient.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
