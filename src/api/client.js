const API_BASE = 'http://localhost:5000/api';

// ===== PROJECTS =====
export const projectsAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      return res.json();
    } catch (err) {
      console.error('Error fetching projects:', err);
      return [];
    }
  },
  get: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`);
      return res.json();
    } catch (err) {
      console.error('Error fetching project:', err);
      return null;
    }
  },
  create: async (project) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return res.json();
  }
};

// ===== TEST CASES =====
export const testCasesAPI = {
  getAll: async (projectId) => {
    try {
      const url = projectId ? `${API_BASE}/testcases?projectId=${projectId}` : `${API_BASE}/testcases`;
      const res = await fetch(url);
      return res.json();
    } catch (err) {
      console.error('Error fetching test cases:', err);
      return [];
    }
  },
  get: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/testcases/${id}`);
      return res.json();
    } catch (err) {
      console.error('Error fetching test case:', err);
      return null;
    }
  },
  create: async (testCase) => {
    const res = await fetch(`${API_BASE}/testcases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCase)
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/testcases/${id}`, { method: 'DELETE' });
    return res.json();
  }
};

// ===== TEAM =====
export const teamAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/team`);
      return res.json();
    } catch (err) {
      console.error('Error fetching team:', err);
      return [];
    }
  },
  create: async (member) => {
    const res = await fetch(`${API_BASE}/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/team/${id}`, { method: 'DELETE' });
    return res.json();
  }
};

// ===== EXECUTIONS =====
export const executionsAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/executions`);
      return res.json();
    } catch (err) {
      console.error('Error fetching executions:', err);
      return [];
    }
  },
  create: async (execution) => {
    const res = await fetch(`${API_BASE}/executions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(execution)
    });
    return res.json();
  }
};
