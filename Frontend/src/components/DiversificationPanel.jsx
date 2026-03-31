import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { mockData } from '../data/mockData';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const DiversificationPanel = () => {
  const [activeTab, setActiveTab] = useState('Assets');

  const diversificationData = {
    Assets: mockData.diversification.byAssets,
    'Asset types': mockData.diversification.byAssetTypes,
    Sectors: mockData.diversification.bySectors,
    Currency: mockData.diversification.byCurrency,
  };

  const currentData = diversificationData[activeTab];

  return (
    <div className="animate-fadeIn">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {Object.keys(diversificationData).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button whitespace-nowrap text-xs ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4 border border-gray-100">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Table */}
        <div className="space-y-2">
          {currentData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-primary text-sm">{item.name}</p>
                <p className="text-xs font-bold text-accent">{item.percentage}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-accent rounded-full h-1.5 transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="text-xs text-secondary mt-1">${item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Asset type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Holding value</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Allocation</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Unrealized gain</th>
              </tr>
            </thead>
            <tbody>
              {mockData.diversificationTable.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 font-medium text-primary text-sm">{row.type}</td>
                  <td className="px-4 py-2 text-primary text-sm">{row.value}</td>
                  <td className="px-4 py-2 text-primary text-sm">{row.allocation}</td>
                  <td className="px-4 py-2 text-positive font-medium text-sm">{row.gain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
