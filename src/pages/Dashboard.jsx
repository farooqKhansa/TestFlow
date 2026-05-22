import { useApp } from '../hooks/useApp.js';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { currentProject, testCases } = useApp();

  if (!currentProject) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">No Project Selected</h1>
      </div>
    );
  }

  const projectTests = testCases.filter(tc => tc.projectId === currentProject.id);
  const totalPassed = projectTests.reduce((a, t) => a + (t.passCount || 0), 0);
  const totalFailed = projectTests.reduce((a, t) => a + (t.failCount || 0), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{currentProject.name}</h1>
        <p className="text-gray-600">{currentProject.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Tests</p>
              <p className="text-3xl font-bold">{projectTests.length}</p>
            </div>
            <CheckCircle size={32} className="text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Passed</p>
              <p className="text-3xl font-bold text-green-600">{totalPassed}</p>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Failed</p>
              <p className="text-3xl font-bold text-red-600">{totalFailed}</p>
            </div>
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Pass Rate</p>
              <p className="text-3xl font-bold text-purple-600">{currentProject.passRate}%</p>
            </div>
            <TrendingUp size={32} className="text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/test-cases" className="block">
              <Button variant="primary" className="w-full">✏️ Create Test Case</Button>
            </Link>
            <Link to="/execution" className="block">
              <Button variant="secondary" className="w-full">▶️ Execute Test</Button>
            </Link>
            <Link to="/analytics" className="block">
              <Button variant="secondary" className="w-full">📊 View Analytics</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Tests</h2>
          <div className="space-y-3">
            {projectTests.slice(0, 3).map(t => (
              <div key={t.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{t.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.lastExecuted}</p>
                  </div>
                  <Badge variant="info">{t.executionCount} runs</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
