import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Download, Upload, Trash2, Database } from 'lucide-react';
import * as storage from '../../utils/storage';

export function DataManagement() {
  const [lastBackup, setLastBackup] = useState(localStorage.getItem('lastBackup'));
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    try {
      setLoading(true);
      storage.exportData();
      setLastBackup(new Date().toLocaleString());
      localStorage.setItem('lastBackup', new Date().toLocaleString());
    } catch (error) {
      alert('Error exporting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      try {
        setLoading(true);
        const file = e.target.files[0];
        const text = await file.text();
        storage.importData(text);
        alert('Data imported successfully!');
        window.location.reload();
      } catch (error) {
        alert('Error importing data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    if (storage.clearAllData()) {
      alert('All data cleared');
      window.location.reload();
    }
  };

  const data = storage.getAllData();
  const stats = {
    projects: data.projects?.length || 0,
    testCases: data.testCases?.length || 0,
    executions: data.executions?.length || 0,
    team: data.team?.length || 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Data Management</h2>
        <p className="text-slate-400">Backup, restore, and manage your test data</p>
      </div>

      {/* Data Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{stats.projects}</p>
            <p className="text-sm text-slate-400 mt-1">Projects</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">{stats.testCases}</p>
            <p className="text-sm text-slate-400 mt-1">Test Cases</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">{stats.executions}</p>
            <p className="text-sm text-slate-400 mt-1">Executions</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-400">{stats.team}</p>
            <p className="text-sm text-slate-400 mt-1">Team Members</p>
          </div>
        </Card>
      </div>

      {/* Export/Import Section */}
      <Card>
        <h3 className="text-lg font-bold text-slate-100 mb-4">Backup & Restore</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">Export your data as JSON for backup</p>
            <Button
              variant="primary"
              onClick={handleExport}
              loading={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export Data
            </Button>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-2">Import previously exported data</p>
            <Button
              variant="secondary"
              onClick={handleImport}
              loading={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              Import Data
            </Button>
          </div>
        </div>

        {lastBackup && (
          <div className="mt-4 p-3 bg-slate-700 rounded-lg">
            <p className="text-xs text-slate-400">Last backup: {lastBackup}</p>
          </div>
        )}
      </Card>

      {/* Storage Info */}
      <Card>
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Database size={20} />
          Storage Info
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-slate-400">
            Total stored data: <span className="text-slate-200">{(JSON.stringify(data).length / 1024).toFixed(2)} KB</span>
          </p>
          <p className="text-slate-400">
            Browser storage limit: <span className="text-slate-200">~5-10 MB</span>
          </p>
          <p className="text-slate-400">
            Status: <Badge variant="success" size="sm">Normal</Badge>
          </p>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-900">
        <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
        <p className="text-sm text-slate-400 mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
        <Button
          variant="danger"
          onClick={handleClearAll}
          className="w-full flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete All Data
        </Button>
      </Card>
    </div>
  );
}
