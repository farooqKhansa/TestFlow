const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock Database
let projects = [
  { id: 'proj-1', name: 'E-Commerce Platform', description: 'Testing for online shopping platform', createdAt: '2024-01-15', status: 'active', testsCount: 12, passRate: 92 },
  { id: 'proj-2', name: 'Mobile Banking App', description: 'Financial application testing', createdAt: '2024-02-20', status: 'active', testsCount: 18, passRate: 88 },
  { id: 'proj-3', name: 'Admin Dashboard', description: 'Internal admin panel testing', createdAt: '2024-03-10', status: 'active', testsCount: 8, passRate: 95 },
];

let testCases = [
  { id: 'tc-001', projectId: 'proj-1', title: 'User Registration', description: 'Verify registration', priority: 'high', status: 'active', category: 'Auth', createdAt: '2024-01-15', lastExecuted: '2024-05-20', executionCount: 24, passCount: 22, failCount: 2, steps: [{ id: 1, action: 'Navigate to registration', expectedResult: 'Page loads' }], assignedTo: 'John Doe', tags: ['regression'] },
  { id: 'tc-002', projectId: 'proj-1', title: 'Product Search', description: 'Test search', priority: 'medium', status: 'active', category: 'Features', createdAt: '2024-01-20', lastExecuted: '2024-05-21', executionCount: 18, passCount: 18, failCount: 0, steps: [{ id: 1, action: 'Click search', expectedResult: 'Focused' }], assignedTo: 'Sarah Smith', tags: ['feature'] },
  { id: 'tc-003', projectId: 'proj-1', title: 'Payment Processing', description: 'Test payment', priority: 'critical', status: 'active', category: 'Payment', createdAt: '2024-02-01', lastExecuted: '2024-05-21', executionCount: 15, passCount: 14, failCount: 1, steps: [{ id: 1, action: 'Add to cart', expectedResult: 'Added' }], assignedTo: 'Mike Johnson', tags: ['critical'] },
  { id: 'tc-004', projectId: 'proj-2', title: 'User Login', description: 'Test login', priority: 'critical', status: 'active', category: 'Auth', createdAt: '2024-02-05', lastExecuted: '2024-05-20', executionCount: 32, passCount: 31, failCount: 1, steps: [{ id: 1, action: 'Open login', expectedResult: 'Visible' }], assignedTo: 'John Doe', tags: ['smoke'] },
  { id: 'tc-005', projectId: 'proj-2', title: 'Fund Transfer', description: 'Test transfer', priority: 'high', status: 'active', category: 'Features', createdAt: '2024-02-10', lastExecuted: '2024-05-19', executionCount: 12, passCount: 10, failCount: 2, steps: [{ id: 1, action: 'Navigate', expectedResult: 'Loads' }], assignedTo: 'Sarah Smith', tags: ['feature'] },
  { id: 'tc-006', projectId: 'proj-3', title: 'Dashboard Performance', description: 'Test load', priority: 'medium', status: 'active', category: 'Performance', createdAt: '2024-03-01', lastExecuted: '2024-05-21', executionCount: 10, passCount: 10, failCount: 0, steps: [{ id: 1, action: 'Login', expectedResult: 'OK' }], assignedTo: 'Mike Johnson', tags: ['perf'] },
];

let teamMembers = [
  { id: 'tm-1', name: 'John Doe', email: 'john@test.com', role: 'QA Lead', avatar: '👨‍💼', joinedAt: '2024-01-10', status: 'active' },
  { id: 'tm-2', name: 'Sarah Smith', email: 'sarah@test.com', role: 'QA Engineer', avatar: '👩‍💻', joinedAt: '2024-01-15', status: 'active' },
  { id: 'tm-3', name: 'Mike Johnson', email: 'mike@test.com', role: 'QA Engineer', avatar: '👨‍💼', joinedAt: '2024-02-01', status: 'active' },
];

let executions = [];

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 TestFlow Backend is running!', status: 'OK' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TestFlow Backend is running' });
});

// ============ PROJECTS API ============
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const newProject = { id: `proj-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  projects.push(newProject);
  res.json(newProject);
});

// ============ TEST CASES API ============
app.get('/api/testcases', (req, res) => {
  const { projectId } = req.query;
  const filtered = projectId ? testCases.filter(t => t.projectId === projectId) : testCases;
  res.json(filtered);
});

app.get('/api/testcases/:id', (req, res) => {
  const testCase = testCases.find(t => t.id === req.params.id);
  if (!testCase) return res.status(404).json({ error: 'Test case not found' });
  res.json(testCase);
});

app.post('/api/testcases', (req, res) => {
  const newTestCase = { id: `tc-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  testCases.push(newTestCase);
  res.json(newTestCase);
});

app.delete('/api/testcases/:id', (req, res) => {
  testCases = testCases.filter(t => t.id !== req.params.id);
  res.json({ message: 'Test case deleted' });
});

// ============ TEAM MEMBERS API ============
app.get('/api/team', (req, res) => {
  res.json(teamMembers);
});

app.post('/api/team', (req, res) => {
  const newMember = { id: `tm-${Date.now()}`, ...req.body, joinedAt: new Date().toISOString() };
  teamMembers.push(newMember);
  res.json(newMember);
});

app.delete('/api/team/:id', (req, res) => {
  teamMembers = teamMembers.filter(m => m.id !== req.params.id);
  res.json({ message: 'Team member deleted' });
});

// ============ EXECUTIONS API ============
app.get('/api/executions', (req, res) => {
  res.json(executions);
});

app.post('/api/executions', (req, res) => {
  const newExecution = { id: `exec-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  executions.push(newExecution);
  res.json(newExecution);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ ========================================`);
  console.log(`🚀 TestFlow Backend running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`========================================\n`);
  console.log(`📊 Available API Endpoints:`);
  console.log(`   GET    /                    - Welcome`);
  console.log(`   GET    /api/health          - Health check`);
  console.log(`   GET    /api/projects        - All projects`);
  console.log(`   GET    /api/testcases       - All test cases`);
  console.log(`   GET    /api/team            - All team members`);
  console.log(`   GET    /api/executions      - All executions`);
  console.log(`   POST   /api/testcases       - Create test case`);
  console.log(`   POST   /api/executions      - Create execution`);
  console.log(`   DELETE /api/testcases/:id   - Delete test case`);
  console.log(`\n`);
});
