import { useState } from 'react';
import { useApp } from '../hooks/useApp.js';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Plus, Search } from 'lucide-react';

export function TestCasesPage() {
  const { currentProject, testCases } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!currentProject) {
    return <div className="p-8"><h1 className="text-2xl font-bold">No Project Selected</h1></div>;
  }

  const projectTests = testCases.filter(tc => tc.projectId === currentProject.id);
  const filteredTests = projectTests.filter(tc => 
    tc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedTest) {
    return (
      <div className="p-8">
        <button onClick={() => setSelectedTest(null)} className="mb-4 text-purple-600 hover:text-purple-700 font-medium">← Back</button>
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">{selectedTest.title}</h1>
          <p className="text-gray-600 mb-4">{selectedTest.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <Badge variant="danger">{selectedTest.priority}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{selectedTest.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned To</p>
              <p className="font-medium">{selectedTest.assignedTo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Executions</p>
              <p className="font-medium">{selectedTest.executionCount}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Steps</h3>
          <div className="space-y-4">
            {selectedTest.steps?.map((step, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Step {idx + 1}: {step.action}</p>
                <p className="text-gray-600 mt-1">Expected: {step.expectedResult}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="p-8">
        <button onClick={() => setShowCreateForm(false)} className="mb-4 text-purple-600 hover:text-purple-700 font-medium">← Back</button>
        <Card className="p-6 max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Create New Test Case</h1>
          <div className="space-y-4">
            <Input 
              label="Title" 
              placeholder="Test case title"
            />
            <Input 
              label="Description" 
              placeholder="What does this test?"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>low</option>
                  <option>medium</option>
                  <option>high</option>
                  <option>critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input placeholder="e.g. Auth, Features" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => { setShowCreateForm(false); alert('Test case created!'); }}>✅ Create</Button>
              <Button variant="secondary" onClick={() => setShowCreateForm(false)}>❌ Cancel</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Test Cases</h1>
          <p className="text-gray-600">Manage test cases for {currentProject.name}</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateForm(true)}>
          <Plus size={20} className="inline mr-2" /> New
        </Button>
      </div>

      <Card className="mb-8 p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredTests.length > 0 ? filteredTests.map(t => (
          <Card key={t.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex gap-2 mb-2 items-center">
                  <h3 className="font-bold text-lg text-gray-900">{t.title}</h3>
                  <Badge variant={t.priority === 'critical' ? 'danger' : 'info'}>{t.priority}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{t.description}</p>
                <div className="flex gap-2">
                  <Badge variant="success">{t.category}</Badge>
                  <Badge variant="info">By {t.assignedTo}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{t.executionCount}</p>
                <p className="text-xs text-gray-500">Executions</p>
                <Button 
                  variant="primary" 
                  onClick={() => setSelectedTest(t)}
                  className="mt-2 px-3 py-1 text-sm"
                >
                  View
                </Button>
              </div>
            </div>
          </Card>
        )) : (
          <Card className="p-6 text-center text-gray-500">
            <p>No test cases found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
