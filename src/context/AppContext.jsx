import React, { createContext, useReducer, useCallback, useEffect, useState } from "react";
import { projectsAPI, testCasesAPI, teamAPI, executionsAPI } from "../api/client.js";

export const AppContext = createContext();

const initialState = {
  projects: [
    { id: 'proj-1', name: 'E-Commerce Platform', description: 'Testing for online shopping platform', createdAt: '2024-01-15', status: 'active', testsCount: 12, passRate: 92 },
    { id: 'proj-2', name: 'Mobile Banking App', description: 'Financial application testing', createdAt: '2024-02-20', status: 'active', testsCount: 18, passRate: 88 },
    { id: 'proj-3', name: 'Admin Dashboard', description: 'Internal admin panel testing', createdAt: '2024-03-10', status: 'active', testsCount: 8, passRate: 95 },
  ],
  testCases: [
    { id: 'tc-001', projectId: 'proj-1', title: 'User Registration', description: 'Verify registration', priority: 'high', status: 'active', category: 'Auth', createdAt: '2024-01-15', lastExecuted: '2024-05-20', executionCount: 24, passCount: 22, failCount: 2, steps: [{ id: 1, action: 'Navigate to registration', expectedResult: 'Page loads' }], assignedTo: 'John Doe', tags: ['regression'] },
    { id: 'tc-002', projectId: 'proj-1', title: 'Product Search', description: 'Test search', priority: 'medium', status: 'active', category: 'Features', createdAt: '2024-01-20', lastExecuted: '2024-05-21', executionCount: 18, passCount: 18, failCount: 0, steps: [{ id: 1, action: 'Click search', expectedResult: 'Focused' }], assignedTo: 'Sarah Smith', tags: ['feature'] },
    { id: 'tc-003', projectId: 'proj-1', title: 'Payment Processing', description: 'Test payment', priority: 'critical', status: 'active', category: 'Payment', createdAt: '2024-02-01', lastExecuted: '2024-05-21', executionCount: 15, passCount: 14, failCount: 1, steps: [{ id: 1, action: 'Add to cart', expectedResult: 'Added' }], assignedTo: 'Mike Johnson', tags: ['critical'] },
    { id: 'tc-004', projectId: 'proj-2', title: 'User Login', description: 'Test login', priority: 'critical', status: 'active', category: 'Auth', createdAt: '2024-02-05', lastExecuted: '2024-05-20', executionCount: 32, passCount: 31, failCount: 1, steps: [{ id: 1, action: 'Open login', expectedResult: 'Visible' }], assignedTo: 'John Doe', tags: ['smoke'] },
    { id: 'tc-005', projectId: 'proj-2', title: 'Fund Transfer', description: 'Test transfer', priority: 'high', status: 'active', category: 'Features', createdAt: '2024-02-10', lastExecuted: '2024-05-19', executionCount: 12, passCount: 10, failCount: 2, steps: [{ id: 1, action: 'Navigate', expectedResult: 'Loads' }], assignedTo: 'Sarah Smith', tags: ['feature'] },
    { id: 'tc-006', projectId: 'proj-3', title: 'Dashboard Performance', description: 'Test load', priority: 'medium', status: 'active', category: 'Performance', createdAt: '2024-03-01', lastExecuted: '2024-05-21', executionCount: 10, passCount: 10, failCount: 0, steps: [{ id: 1, action: 'Login', expectedResult: 'OK' }], assignedTo: 'Mike Johnson', tags: ['perf'] },
  ],
  teamMembers: [
    { id: 'tm-1', name: 'John Doe', email: 'john@test.com', role: 'QA Lead', avatar: '👨‍💼', joinedAt: '2024-01-10', status: 'active' },
    { id: 'tm-2', name: 'Sarah Smith', email: 'sarah@test.com', role: 'QA Engineer', avatar: '👩‍💻', joinedAt: '2024-01-15', status: 'active' },
    { id: 'tm-3', name: 'Mike Johnson', email: 'mike@test.com', role: 'QA Engineer', avatar: '👨‍💼', joinedAt: '2024-02-01', status: 'active' },
  ],
  executions: [],
  currentProject: null,
  currentUser: null,
  darkMode: false,
  sidebarOpen: true,
  loading: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload, currentProject: action.payload[0] || state.currentProject };
    case "SET_TEST_CASES":
      return { ...state, testCases: action.payload };
    case "SET_TEAM_MEMBERS":
      return { ...state, teamMembers: action.payload, currentUser: action.payload[0] || state.currentUser };
    case "SET_EXECUTIONS":
      return { ...state, executions: action.payload };
    case "SET_CURRENT_PROJECT":
      return { ...state, currentProject: action.payload };
    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const setCurrentProject = useCallback(p => dispatch({ type: "SET_CURRENT_PROJECT", payload: p }), []);
  const setDarkMode = useCallback(d => dispatch({ type: "SET_DARK_MODE", payload: d }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: "TOGGLE_SIDEBAR" }), []);

  const value = {
    ...state,
    setCurrentProject,
    setDarkMode,
    toggleSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
