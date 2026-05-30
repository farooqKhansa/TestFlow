import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle, Wifi } from 'lucide-react';
import { toast } from 'react-toastify';

const EnvironmentManagement = () => {
  const [environments, setEnvironments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseUrl: '',
    apiEndpoint: '',
    status: 'healthy'
  });

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/environments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setEnvironments(data);
    } catch (error) {
      console.error('Error fetching environments:', error);
      toast.error('Failed to fetch environments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/environments/${editingId}`
        : '/api/environments';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save environment');

      toast.success(editingId ? 'Environment updated' : 'Environment created');
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        baseUrl: '',
        apiEndpoint: '',
        status: 'healthy'
      });
      fetchEnvironments();
    } catch (error) {
      console.error('Error saving environment:', error);
      toast.error('Failed to save environment');
    }
  };

  const handleEdit = (env) => {
    setFormData(env);
    setEditingId(env._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/environments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Environment deleted');
      fetchEnvironments();
    } catch (error) {
      console.error('Error deleting environment:', error);
      toast.error('Failed to delete environment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'offline':
        return <Wifi className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Environment Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              baseUrl: '',
              apiEndpoint: '',
              status: 'healthy'
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Environment
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8 border-l-4 border-blue-600">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Environment' : 'Create New Environment'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment Name *
                </label>
                <select
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Environment</option>
                  <option value="Development">Development</option>
                  <option value="Staging">Staging</option>
                  <option value="QA">QA</option>
                  <option value="Production">Production</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="healthy">Healthy</option>
                  <option value="degraded">Degraded</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base URL *
                </label>
                <input
                  type="url"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Endpoint
                </label>
                <input
                  type="url"
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Environment description"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Environments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {environments.map(env => (
          <div key={env._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{env.name}</h3>
                <p className="text-sm text-gray-600">{env.description || 'No description'}</p>
              </div>
              <div className="flex gap-2">
                {getStatusIcon(env.status)}
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Base URL:</span> {env.baseUrl}
              </p>
              {env.apiEndpoint && (
                <p className="text-gray-600">
                  <span className="font-medium">API:</span> {env.apiEndpoint}
                </p>
              )}
              <p className="text-gray-600">
                <span className="font-medium">Status:</span>{' '}
                <span className={`capitalize ${
                  env.status === 'healthy' ? 'text-green-600' :
                  env.status === 'degraded' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {env.status}
                </span>
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEdit(env)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(env._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {environments.length === 0 && !showForm && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No environments yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default EnvironmentManagement;