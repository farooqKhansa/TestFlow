import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [durationTrend, setDurationTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [dashboard, trend, duration] = await Promise.all([
        fetch('/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('/api/analytics/trend/pass-rate', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('/api/analytics/trend/duration', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json())
      ]);

      setDashboardData(dashboard);
      setTrendData(trend);
      setDurationTrend(duration);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  const { summary = {}, flakyTests = [], topFailingTests = [] } = dashboardData || {};
  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  const statusData = [
    { name: 'Passed', value: summary.passedTests || 0 },
    { name: 'Failed', value: summary.failedTests || 0 },
    { name: 'Skipped', value: summary.skippedTests || 0 }
  ];

  return (
    <div className="space-y-6 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">{summary.totalTests || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pass Rate</p>
              <p className="text-3xl font-bold text-green-600">{summary.passRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Failed Tests</p>
              <p className="text-3xl font-bold text-red-600">{summary.failedTests || 0}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Duration (ms)</p>
              <p className="text-3xl font-bold text-purple-600">{summary.avgDuration}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Rate Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pass Rate Trend (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Duration Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Duration Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgDuration" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution & Flaky Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Flaky Tests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Flaky Tests</h2>
          <div className="space-y-2">
            {flakyTests.length > 0 ? (
              flakyTests.map((test, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                  <div>
                    <p className="font-medium text-gray-900">{test.testName}</p>
                    <p className="text-sm text-gray-500">ID: {test.testId}</p>
                  </div>
                  <span className="text-yellow-600 font-bold">{test.flakinessPercentage}%</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No flaky tests detected</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Failing Tests */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Failing Tests</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Test Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Failure Count</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
              </tr>
            </thead>
            <tbody>
              {topFailingTests.map((test, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-6 py-4 text-sm text-gray-900">{test.testName}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-semibold">{test.failureCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{test.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;