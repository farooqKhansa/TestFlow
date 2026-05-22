import { useState } from 'react';
import { useApp } from '../hooks/useApp.js';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { Play } from 'lucide-react';

export function ExecutionPage() {
  const { currentProject, testCases } = useApp();
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResult, setTestResult] = useState(null);

  if (!currentProject) {
    return <div className="p-8"><h1 className="text-2xl font-bold">No Project Selected</h1></div>;
  }

  const projectTests = testCases.filter(tc => tc.projectId === currentProject.id);

  if (testResult) {
    return (
      <div className="p-8">
        <button onClick={() => { setSelectedTest(null); setTestResult(null); }} className="mb-4 text-purple-600 hover:text-purple-700 font-medium">← Back</button>
        <Card className="p-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Test Execution Result</h2>
          <p className={`text-6xl font-bold mb-6 ${testResult === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
            {testResult === 'passed' ? '✅ PASSED' : '❌ FAILED'}
          </p>
          <Button variant="primary" onClick={() => { setSelectedTest(null); setTestResult(null); }}>
            Run Another Test
          </Button>
        </Card>
      </div>
    );
  }

  if (selectedTest) {
    return (
      <div className="p-8">
        <button onClick={() => setSelectedTest(null)} className="mb-4 text-purple-600 hover:text-purple-700 font-medium">← Back</button>
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{selectedTest.title}</h1>
          <p className="text-gray-600 mb-6">{selectedTest.description}</p>

          <h3 className="text-xl font-bold mb-4 text-gray-900">Test Steps</h3>
          <div className="space-y-4 mb-8">
            {selectedTest.steps?.map((step, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900">Step {idx + 1}: {step.action}</p>
                <p className="text-gray-600 mt-1">Expected: {step.expectedResult}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button 
              variant="success"
              onClick={() => setTestResult('passed')}
            >
              ✅ Pass
            </Button>
            <Button 
              variant="danger"
              onClick={() => setTestResult('failed')}
            >
              ❌ Fail
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Test Execution</h1>
      <p className="text-gray-600 mb-8">Execute tests for {currentProject.name}</p>

      <div className="space-y-4">
        {projectTests.map(t => (
          <Card key={t.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{t.title}</h3>
                <p className="text-sm text-gray-600">{t.description}</p>
              </div>
              <Button 
                variant="primary"
                onClick={() => setSelectedTest(t)}
              >
                <Play size={20} /> Execute
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
