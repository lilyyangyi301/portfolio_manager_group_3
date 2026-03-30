import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockData } from '../data/mockData';

export const PotentialPanel = () => {
  const [filterType, setFilterType] = useState('All');

  const holdings = mockData.holdings;

  const getFilteredHoldings = () => {
    if (filterType === 'Gainers') {
      return holdings.filter((h) => h.positive).sort((a, b) => b.change - a.change);
    }
    if (filterType === 'Losers') {
      return holdings.filter((h) => !h.positive).sort((a, b) => a.change - b.change);
    }
    return holdings.sort((a, b) => b.change - a.change);
  };

  const filteredData = getFilteredHoldings();

  const chartData = filteredData.map((h) => ({
    symbol: h.symbol,
    change: Math.abs(h.change),
    positive: h.positive,
  }));

  const getBarColor = (entry) => {
    return entry.positive ? '#10B981' : '#EF4444';
  };

  return (
    <div className="animate-fadeIn">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {['All', 'Gainers', 'Losers'].map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterType(filter)}
            className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${
              filterType === filter
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-secondary hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
        <h4 className="font-semibold text-primary text-sm mb-3">Holdings performance</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '11px' }} />
            <YAxis dataKey="symbol" type="category" stroke="#9ca3af" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => `${value.toFixed(1)}%`}
            />
            <Bar dataKey="change" fill="#3B82F6" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Symbol</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Value</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-secondary">Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((holding, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">
                    <div>
                      <p className="font-semibold text-primary text-sm">{holding.symbol}</p>
                      <p className="text-xs text-secondary">{holding.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-primary font-medium text-sm">
                    ${holding.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={`font-bold text-sm ${holding.positive ? 'text-positive' : 'text-negative'}`}>
                      {holding.positive ? '+' : ''}{holding.change}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
