import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Zap, Link2 } from 'lucide-react';
import { toast } from 'react-toastify';

const IntegrationsManagement = () => {
  const [integrations, setIntegrations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [testingId, setTestingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'github',
    name: '',
    description: '',
    apiKey: '',
    configuration: {}
  });

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/integrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setIntegrations(data);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to fetch integrations');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/integrations/${editingId}`
        : '/api/integrations';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save integration');

      toast.success(editingId ? 'Integration updated' : 'Integration created');
      setShowForm(false);
      setEditingId(null);
      setFormData({
        type: 'github',
        name: '',
        description: '',
        apiKey: '',
        configuration: {}
      });
      fetchIntegrations();
    } catch (error) {
      console.error('Error saving integration:', error);
      toast.error('Failed to save integration');
    }
  };

  const handleTestConnection = async (id) => {
    setTestingId(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/integrations/${id}/test`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.isConnected) {
        toast.success('Connection successful: ' + data.message);
      } else {
        toast.error('Connection failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Failed to test connection');
    } finally {
      setTestingId(null);
    }
  };

  const handleSync = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/integrations/${id}/sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      toast.success(data.message);
      fetchIntegrations();
    } catch (error) {
      console.error('Error syncing integration:', error);
      toast.error('Failed to sync integration');
    }
  };

  const handleEdit = (integration) => {
    setFormData(integration);
    setEditingId(integration._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/integrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Integration deleted');
      fetchIntegrations();
    } catch (error) {
      console.error('Error deleting integration:', error);
      toast.error('Failed to delete integration');
    }
  };

  const getIntegrationIcon = (type) => {
    switch (type) {
      case 'github':
        return '🐙';
      case 'jira':
        return '⚙️';
      case 'jenkins':
        return '🔨';
      case 'github_actions':
        return '⚡';
      case 'slack':
        return '💬';
      default:
        return '🔗';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              type: 'github',
              name: '',
              description: '',
              apiKey: '',
              configuration: {}
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Integration
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8 border-l-4 border-blue-600">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Integration' : 'Create New Integration'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="github">GitHub</option>
                  <option value="jira">Jira</option>
                  <option value="jenkins">Jenkins</option>
                  <option value="github_actions">GitHub Actions</option>
                  <option value="slack">Slack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Integration name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key / Token *
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter API key or token"
                  required
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
                  placeholder="Integration description"
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

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <div key={integration._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getIntegrationIcon(integration.type)}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{integration.description || 'No description'}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Type:</span> {integration.type.toUpperCase()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Status:</span>{' '}
                <span className={`capitalize ${
                  integration.syncStatus === 'success' ? 'text-green-600' :
                  integration.syncStatus === 'failed' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {integration.syncStatus}
                </span>
              </p>
              {integration.lastSync && (
                <p className="text-gray-600">
                  <span className="font-medium">Last Sync:</span> {new Date(integration.lastSync).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleTestConnection(integration._id)}
                disabled={testingId === integration._id}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-yellow-300 text-yellow-700 rounded hover:bg-yellow-50 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                Test
              </button>
              <button
                onClick={() => handleSync(integration._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-green-300 text-green-700 rounded hover:bg-green-50"
              >
                <Link2 className="w-4 h-4" />
                Sync
              </button>
              <button
                onClick={() => handleEdit(integration)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(integration._id)}
                className="px-3 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {integrations.length === 0 && !showForm && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No integrations yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default IntegrationsManagement;