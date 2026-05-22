import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Plus, Trash2, Mail, User } from 'lucide-react';

export function TeamManagement() {
  const [team, setTeam] = useState([
    { id: 'tm-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'QA Lead' },
    { id: 'tm-2', name: 'Bob Smith', email: 'bob@example.com', role: 'QA Engineer' },
    { id: 'tm-3', name: 'Carol White', email: 'carol@example.com', role: 'Test Automation' }
  ]);

  const [newMember, setNewMember] = useState({ name: '', email: '' });

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      setTeam([...team, {
        id: `tm-${Date.now()}`,
        ...newMember,
        role: 'QA Engineer'
      }]);
      setNewMember({ name: '', email: '' });
    }
  };

  const handleRemoveMember = (id) => {
    if (confirm('Remove this team member?')) {
      setTeam(team.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Team Management</h2>
        <p className="text-slate-400">Manage your testing team members</p>
      </div>

      {/* Add Member Form */}
      <Card>
        <h3 className="text-lg font-bold text-slate-100 mb-4">Add Team Member</h3>
        <div className="space-y-3">
          <Input
            icon={User}
            placeholder="Full name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
          />
          <Button
            variant="primary"
            onClick={handleAddMember}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Member
          </Button>
        </div>
      </Card>

      {/* Team Members List */}
      <Card>
        <h3 className="text-lg font-bold text-slate-100 mb-4">Team Members ({team.length})</h3>
        <div className="space-y-2">
          {team.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-slate-100">{member.name}</p>
                <p className="text-sm text-slate-400">{member.email}</p>
                <Badge variant="info" size="sm" className="mt-1">
                  {member.role}
                </Badge>
              </div>
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-2 hover:bg-red-900 rounded transition-colors"
              >
                <Trash2 size={18} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
