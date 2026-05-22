import { useApp } from '../hooks/useApp.js';
import { Card } from '../components/common/Card.jsx';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsPage() {
  const { currentProject, testCases } = useApp();

  if (!currentProject) {
    return <div className="p-8"><h1 className="text-2xl font-bold">No Project Selected</h1></div>;
  }

  const projectTests = testCases.filter(tc => tc.projectId === currentProject.id);
  const totalPassed = projectTests.reduce((a, t) => a + (t.passCount || 0), 0);
  const totalFailed = projectTests.reduce((a, t) => a + (t.failCount || 0), 0);

  // Data for Pass/Fail Chart
  const passFailData = [
    { name: 'Passed', value: totalPassed, fill: '#10b981' },
    { name: 'Failed', value: totalFailed, fill: '#ef4444' }
  ];

  // Data for Test Cases Chart
  const testCasesData = projectTests.map(t => ({
    name: t.title.substring(0, 15),
    passed: t.passCount,
    failed: t.failCount,
    total: t.executionCount
  }));

  // Data for Execution Trend
  const executionTrend = projectTests.map((t, idx) => ({
    name: `Test ${idx + 1}`,
    executions: t.executionCount,
    passRate: Math.round((t.passCount / (t.passCount + t.failCount)) * 100)
  }));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Analytics</h1>
      <p className="text-gray-600 mb-8">Test analytics for {currentProject.name}</p>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Tests</p>
          <p className="text-4xl font-bold text-blue-600">{projectTests.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Pass Rate</p>
          <p className="text-4xl font-bold text-green-600">{currentProject.passRate}%</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Passed</p>
          <p className="text-4xl font-bold text-green-600">{totalPassed}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Failed</p>
          <p className="text-4xl font-bold text-red-600">{totalFailed}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pass/Fail Pie Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Pass/Fail Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passFailData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {passFailData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Execution Trend */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Execution Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={executionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="executions" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Test Results Bar Chart */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Test Results by Case</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={testCasesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" fill="#10b981" name="Passed" />
            <Bar dataKey="failed" fill="#ef4444" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Table */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Detailed Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Test Case</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Executions</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Passed</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Failed</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {projectTests.map(t => {
                const passRate = t.passCount + t.failCount > 0 
                  ? Math.round((t.passCount / (t.passCount + t.failCount)) * 100)
                  : 0;
                return (
                  <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.executionCount}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-medium">{t.passCount}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">{t.failCount}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <span className={passRate >= 80 ? 'text-green-600' : 'text-red-600'}>
                        {passRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
