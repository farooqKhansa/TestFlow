# 🎉 TestFlow - Complete Source Code

## 📦 All 17 Files with Complete Code

---

## 🔧 ROOT FILES

### 1. `src/App.jsx` - Main App with React Router
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { TestCasesPage } from './pages/TestCasesPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import './styles/globals.css';

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout><Dashboard /></MainLayout>} path="/" />
        <Route element={<MainLayout><TestCasesPage /></MainLayout>} path="/test-cases" />
        <Route element={<MainLayout><ExecutionPage /></MainLayout>} path="/execution" />
        <Route element={<MainLayout><AnalyticsPage /></MainLayout>} path="/analytics" />
        <Route element={<MainLayout><SettingsPage /></MainLayout>} path="/settings" />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
```

### 2. `src/main.jsx` - React Entry Point
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## 📊 DATA & STATE MANAGEMENT

### 3. `src/mockData.js` - Mock Data
```javascript
export const mockProjects = [
  { id: 'proj-1', name: 'E-Commerce Platform', description: 'Testing for online shopping platform', createdAt: '2024-01-15', status: 'active', testsCount: 12, passRate: 92 },
  { id: 'proj-2', name: 'Mobile Banking App', description: 'Financial application testing', createdAt: '2024-02-20', status: 'active', testsCount: 18, passRate: 88 },
  { id: 'proj-3', name: 'Admin Dashboard', description: 'Internal admin panel testing', createdAt: '2024-03-10', status: 'active', testsCount: 8, passRate: 95 },
];

export const mockTestCases = [
  { id: 'tc-001', projectId: 'proj-1', title: 'User Registration', description: 'Verify registration', priority: 'high', status: 'active', category: 'Auth', createdAt: '2024-01-15', lastExecuted: '2024-05-20', executionCount: 24, passCount: 22, failCount: 2, steps: [{ id: 1, action: 'Navigate to registration', expectedResult: 'Page loads' }], assignedTo: 'John Doe', tags: ['regression'] },
  { id: 'tc-002', projectId: 'proj-1', title: 'Product Search', description: 'Test search', priority: 'medium', status: 'active', category: 'Features', createdAt: '2024-01-20', lastExecuted: '2024-05-21', executionCount: 18, passCount: 18, failCount: 0, steps: [{ id: 1, action: 'Click search', expectedResult: 'Focused' }], assignedTo: 'Sarah Smith', tags: ['feature'] },
  { id: 'tc-003', projectId: 'proj-1', title: 'Payment Processing', description: 'Test payment', priority: 'critical', status: 'active', category: 'Payment', createdAt: '2024-02-01', lastExecuted: '2024-05-21', executionCount: 15, passCount: 14, failCount: 1, steps: [{ id: 1, action: 'Add to cart', expectedResult: 'Added' }], assignedTo: 'Mike Johnson', tags: ['critical'] },
  { id: 'tc-004', projectId: 'proj-2', title: 'User Login', description: 'Test login', priority: 'critical', status: 'active', category: 'Auth', createdAt: '2024-02-05', lastExecuted: '2024-05-20', executionCount: 32, passCount: 31, failCount: 1, steps: [{ id: 1, action: 'Open login', expectedResult: 'Visible' }], assignedTo: 'John Doe', tags: ['smoke'] },
  { id: 'tc-005', projectId: 'proj-2', title: 'Fund Transfer', description: 'Test transfer', priority: 'high', status: 'active', category: 'Features', createdAt: '2024-02-10', lastExecuted: '2024-05-19', executionCount: 12, passCount: 10, failCount: 2, steps: [{ id: 1, action: 'Navigate', expectedResult: 'Loads' }], assignedTo: 'Sarah Smith', tags: ['feature'] },
  { id: 'tc-006', projectId: 'proj-3', title: 'Dashboard Performance', description: 'Test load', priority: 'medium', status: 'active', category: 'Performance', createdAt: '2024-03-01', lastExecuted: '2024-05-21', executionCount: 10, passCount: 10, failCount: 0, steps: [{ id: 1, action: 'Login', expectedResult: 'OK' }], assignedTo: 'Mike Johnson', tags: ['perf'] },
];

export const mockTeamMembers = [
  { id: 'tm-1', name: 'John Doe', email: 'john@test.com', role: 'QA Lead', avatar: '👨‍💼', joinedAt: '2024-01-10', status: 'active' },
  { id: 'tm-2', name: 'Sarah Smith', email: 'sarah@test.com', role: 'QA Engineer', avatar: '👩‍💻', joinedAt: '2024-01-15', status: 'active' },
  { id: 'tm-3', name: 'Mike Johnson', email: 'mike@test.com', role: 'QA Engineer', avatar: '👨‍💼', joinedAt: '2024-02-01', status: 'active' },
];

export const mockExecutions = [
  { id: 'exec-001', testCaseId: 'tc-001', executedBy: 'John Doe', executedAt: '2024-05-20', duration: 245, result: 'passed', notes: 'Passed', screenshots: [] },
  { id: 'exec-002', testCaseId: 'tc-002', executedBy: 'Sarah Smith', executedAt: '2024-05-19', duration: 198, result: 'passed', notes: 'OK', screenshots: [] },
];
```

### 4. `src/context/AppContext.jsx` - Global State
```javascript
import React, { createContext, useReducer, useCallback } from "react";
import { mockProjects, mockTestCases, mockTeamMembers, mockExecutions } from "../mockData";

export const AppContext = createContext();

const initialState = {
  projects: mockProjects,
  testCases: mockTestCases,
  teamMembers: mockTeamMembers,
  executions: mockExecutions,
  currentProject: mockProjects[0],
  currentUser: mockTeamMembers[0],
  darkMode: false,
  sidebarOpen: true,
  notifications: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_CURRENT_PROJECT":
      return { ...state, currentProject: action.payload };
    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "ADD_TEST_CASE":
      return { ...state, testCases: [...state.testCases, action.payload] };
    case "DELETE_TEST_CASE":
      return { ...state, testCases: state.testCases.filter(tc => tc.id !== action.payload) };
    case "ADD_EXECUTION":
      return { ...state, executions: [...state.executions, action.payload] };
    case "ADD_TEAM_MEMBER":
      return { ...state, teamMembers: [...state.teamMembers, action.payload] };
    case "REMOVE_TEAM_MEMBER":
      return { ...state, teamMembers: state.teamMembers.filter(tm => tm.id !== action.payload) };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setCurrentProject = useCallback(p => dispatch({ type: "SET_CURRENT_PROJECT", payload: p }), []);
  const setDarkMode = useCallback(d => dispatch({ type: "SET_DARK_MODE", payload: d }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: "TOGGLE_SIDEBAR" }), []);
  const addTestCase = useCallback(tc => dispatch({ type: "ADD_TEST_CASE", payload: tc }), []);
  const deleteTestCase = useCallback(id => dispatch({ type: "DELETE_TEST_CASE", payload: id }), []);
  const addExecution = useCallback(e => dispatch({ type: "ADD_EXECUTION", payload: e }), []);
  const addTeamMember = useCallback(m => dispatch({ type: "ADD_TEAM_MEMBER", payload: m }), []);
  const removeTeamMember = useCallback(id => dispatch({ type: "REMOVE_TEAM_MEMBER", payload: id }), []);

  const value = {
    ...state,
    setCurrentProject,
    setDarkMode,
    toggleSidebar,
    addTestCase,
    deleteTestCase,
    addExecution,
    addTeamMember,
    removeTeamMember,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

### 5. `src/hooks/useApp.js` - Custom Hook
```javascript
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
```

---

## 🧩 COMMON COMPONENTS

### 6. `src/components/common/Button.jsx`
```javascript
export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };
  const sizes = { sm: 'px-3 py-1 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };
  return <button className={`font-medium rounded-lg transition-all cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}
```

### 7. `src/components/common/Card.jsx`
```javascript
export function Card({ children, className = '', ...props }) {
  return <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 ${className}`} {...props}>{children}</div>;
}
```

### 8. `src/components/common/Input.jsx`
```javascript
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${error ? 'border-red-500' : ''} ${className}`} {...props} />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
```

### 9. `src/components/common/Badge.jsx`
```javascript
export function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>;
}
```

### 10. `src/components/common/Navbar.jsx`
```javascript
import { useApp } from '../../hooks/useApp';
import { Button } from './Button';
import { Menu, Moon, Sun, Bell } from 'lucide-react';

export function Navbar() {
  const { darkMode, setDarkMode, toggleSidebar, currentUser } = useApp();
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-bold text-purple-600">TestFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 rounded-lg">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{currentUser?.avatar}</span>
            <div>
              <p className="text-sm font-medium">{currentUser?.name}</p>
              <p className="text-xs text-gray-500">{currentUser?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 11. `src/components/common/Sidebar.jsx`
```javascript
import { useApp } from '../../hooks/useApp';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TestTube2, Activity, BarChart3, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Test Cases', path: '/test-cases', icon: TestTube2 },
  { name: 'Execution', path: '/execution', icon: Activity },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarOpen, projects, currentProject, setCurrentProject } = useApp();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const location = useLocation();

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r min-h-screen overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-1 mb-8">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="pt-6 border-t">
          <button onClick={() => setProjectsOpen(!projectsOpen)} className="flex items-center justify-between w-full px-4 py-2">
            <span className="font-medium text-sm">Projects</span>
            <ChevronDown size={16} />
          </button>
          {projectsOpen && (
            <div className="mt-3 space-y-2">
              {projects.map(p => (
                <button key={p.id} onClick={() => setCurrentProject(p)} className={`w-full text-left px-4 py-2 rounded-lg text-sm ${currentProject?.id === p.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}>
                  <div>{p.name}</div>
                  <div className="text-xs text-gray-500">{p.testsCount} tests</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
```

---

## 📐 LAYOUT

### 12. `src/components/Layout/MainLayout.jsx`
```javascript
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { useApp } from '../../hooks/useApp';

export function MainLayout({ children }) {
  const { darkMode } = useApp();
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
        </div>
      </div>
    </div>
  );
}
```

---

## 📄 PAGES

### 13. `src/pages/Dashboard.jsx` - Home Page
```javascript
import { useApp } from '../hooks/useApp';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { currentProject, testCases } = useApp();
  const projectTests = testCases.filter(tc => tc.projectId === currentProject.id);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{currentProject.name}</h1>
        <p className="text-gray-600">{currentProject.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-start">
          <div className="p-3 bg-blue-100 rounded-lg mr-4"><CheckCircle size={24} /></div>
          <div><p className="text-sm text-gray-600">Total Tests</p><p className="text-2xl font-bold">{projectTests.length}</p></div>
        </Card>
        <Card className="flex items-start">
          <div className="p-3 bg-green-100 rounded-lg mr-4"><CheckCircle size={24} /></div>
          <div><p className="text-sm text-gray-600">Passed</p><p className="text-2xl font-bold">{projectTests.reduce((a,t)=>a+t.passCount,0)}</p></div>
        </Card>
        <Card className="flex items-start">
          <div className="p-3 bg-red-100 rounded-lg mr-4"><AlertCircle size={24} /></div>
          <div><p className="text-sm text-gray-600">Failed</p><p className="text-2xl font-bold">{projectTests.reduce((a,t)=>a+t.failCount,0)}</p></div>
        </Card>
        <Card className="flex items-start">
          <div className="p-3 bg-purple-100 rounded-lg mr-4"><TrendingUp size={24} /></div>
          <div><p className="text-sm text-gray-600">Pass Rate</p><p className="text-2xl font-bold">{currentProject.passRate}%</p></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/test-cases"><Button variant="primary" className="w-full">✏️ Create Test Case</Button></Link>
            <Link to="/execution"><Button variant="secondary" className="w-full">▶️ Execute Test</Button></Link>
            <Link to="/analytics"><Button variant="secondary" className="w-full">📊 View Analytics</Button></Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Recent Tests</h2>
          <div className="space-y-3">
            {projectTests.slice(0,3).map(t => (
              <div key={t.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <div><p className="font-medium text-sm">{t.title}</p><p className="text-xs text-gray-500 mt-1">{t.lastExecuted}</p></div>
                  <Badge variant="success">{t.executionCount} runs</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
```

### 14. `src/pages/TestCasesPage.jsx`
### 15. `src/pages/ExecutionPage.jsx`
### 16. `src/pages/AnalyticsPage.jsx`
### 17. `src/pages/SettingsPage.jsx`

*(See files already created in your project)*

---

## 🎨 STYLES

### `src/styles/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
}

html {
  scroll-behavior: smooth;
}
```

---

## 📦 SUMMARY

**Total Files: 17**
- ✅ 2 Root files (App.jsx, main.jsx)
- ✅ 1 Data file (mockData.js)
- ✅ 1 Context (AppContext.jsx)
- ✅ 1 Hook (useApp.js)
- ✅ 6 Common Components
- ✅ 1 Layout Component
- ✅ 5 Page Components
- ✅ 1 Global CSS

**All files are ready to use!**

