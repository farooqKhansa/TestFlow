import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { COLORS } from '../../utils/constants';

export function TesterWorkloadChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 bg-slate-800 rounded-lg flex items-center justify-center">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-bold text-slate-100 mb-4">Tester Workload</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" width={180} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#f1f5f9' }}
          />
          <Legend />
          <Bar dataKey="pass" stackId="a" fill={COLORS.pass} name="Pass" />
          <Bar dataKey="fail" stackId="a" fill={COLORS.fail} name="Fail" />
          <Bar dataKey="skip" stackId="a" fill={COLORS.skip} name="Skip" />
          <Bar dataKey="blocked" stackId="a" fill={COLORS.blocked} name="Blocked" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
