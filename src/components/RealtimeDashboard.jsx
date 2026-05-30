import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, CheckCircle, AlertCircle, Server } from 'lucide-react';
import io from 'socket.io-client';

const RealtimeDashboard = () => {
  const [runningTests, setRunningTests] = useState([]);
  const [socket, setSocket] = useState(null);
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchRunningTests();
    fetchEnvironments();

    // WebSocket connection for real-time updates
    const newSocket = io(API_URL);
    
    newSocket.on('connect', () => {
      console.log('✓ Socket connected');
    });

    newSocket.on('test:update', (updatedTest) => {
      console.log('Test update received:', updatedTest);
      setRunningTests(prev => {
        const idx = prev.findIndex(t => t._id === updatedTest._id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = updatedTest;
          return updated;
        }
        return [updatedTest, ...prev];
      });
    });

    newSocket.on('test:completed', (completedTest) => {
      console.log('Test completed:', completedTest);
      setRunningTests(prev => prev.filter(t => t._id !== completedTest._id));
    });

    newSocket.on('disconnect', () => {
      console.log('✗ Socket disconnected');
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const fetchRunningTests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tests/running`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRunningTests(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching running tests:', error);
      setRunningTests([]);
      setLoading(false);
    }
  };

  const fetchEnvironments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/environments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEnvironments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching environments:', error);
      // Create mock environments if API fails
      setEnvironments([
        { _id: '1', name: 'Development', status: 'healthy', running: 0 },
        { _id: '2', name: 'Staging', status: 'healthy', running: 0 },
        { _id: '3', name: 'Production', status: 'healthy', running: 0 },
      ]);
    }
  };

  const getEnvironmentName = (envId) => {
    const env = environments.find(e => e._id === envId);
    return env?.name || 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 bg-blue-50';
      case 'passed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const environmentStats = environments.map(env => ({
    name: env.name,
    running: runningTests.filter(t => t.environment === env._id).length,
    status: env.status
  }));

  return (
    <div className="space-y-6 p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Real-time Test Dashboard</h1>
        <div className="text-sm text-gray-500">
          API: {API_URL}
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          {socket?.connected ? '✓ Connected to backend' : '⚠ Connecting to backend...'}
        </p>
      </div>

      {/* Environment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {environmentStats.length > 0 ? (
          environmentStats.map(env => (
            <div key={env.name} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{env.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{env.running}</p>
                  <p className="text-xs text-gray-400 mt-1">Tests Running</p>
                </div>
                <div className={`p-3 rounded ${env.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Server className={`w-6 h-6 ${env.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
              <div className={`mt-3 text-xs font-semibold ${env.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                {env.status === 'healthy' ? '✓ Healthy' : '✗ Offline'}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">No environments configured yet</p>
          </div>
        )}
      </div>

      {/* Running Tests */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Play className="w-5 h-5 mr-2 text-blue-600" />
          Currently Running Tests ({runningTests.length})
        </h2>

        {runningTests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Test Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Environment</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                </tr>
              </thead>
              <tbody>
                {runningTests.map(test => (
                  <tr key={test._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.testName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getEnvironmentName(test.environment)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{test.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(test.status)}`}>
                        {test.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        test.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        test.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        test.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {test.priority.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            {loading ? 'Loading tests...' : 'No tests currently running'}
          </p>
        )}
      </div>

      {/* Environment Load Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Load by Environment</h2>
        {environmentStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={environmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="running" fill="#3b82f6" name="Tests Running" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No environment data available</p>
        )}
      </div>
    </div>
  );
};

export default RealtimeDashboard;
