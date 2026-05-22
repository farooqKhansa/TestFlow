import { useState } from 'react';
import { useApp } from '../hooks/useApp.js';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Trash2 } from 'lucide-react';

export function SettingsPage() {
  const { teamMembers } = useApp();
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'QA Engineer' });

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      console.log('Adding member:', newMember);
      setNewMember({ name: '', email: '', role: 'QA Engineer' });
      alert('Team member added successfully!');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">Manage your TestFlow settings</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Team Members</h2>
          <div className="space-y-3">
            {teamMembers.map(member => (
              <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Member Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
          <div className="space-y-4">
            <Input 
              label="Name"
              value={newMember.name}
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              placeholder="John Doe"
            />
            <Input 
              label="Email"
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              placeholder="john@example.com"
            />
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select 
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>QA Engineer</option>
                <option>QA Lead</option>
              </select>
            </div>
            <Button variant="primary" onClick={handleAddMember} className="w-full">
              ➕ Add Member
            </Button>
          </div>
        </Card>
      </div>

      {/* Data Section */}
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Data</h2>
        <p className="text-gray-600 mb-4">Download a backup of your test data</p>
        <Button variant="primary">
          ⬇️ Export Data
        </Button>
      </Card>
    </div>
  );
}
