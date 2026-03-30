import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';
import { mockData } from '../data/mockData';

export const PortfolioOverviewPanel = () => {
  const [chartType, setChartType] = useState('value');

  const portfolio = mockData.portfolio;
  const history = mockData.portfolioHistory;

  const metrics = [
    { label: 'Portfolio value', value: `$${portfolio.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
    { label: 'Unrealized gain', value: `$${portfolio.unrealizedGain.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, positive: true },
    { label: 'Realized gain', value: `$${portfolio.realizedGain.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, positive: true },
    { label: 'Total gain', value: `$${portfolio.totalGain.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, positive: true },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">{portfolio.name}</h3>
        <button className="btn btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Add transaction
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <p className="text-xs text-secondary mb-2">{metric.label}</p>
            <p className={`text-base font-bold ${metric.positive ? 'text-positive' : 'text-primary'}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-primary text-sm">Portfolio change</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('value')}
              className={`tab-button text-xs ${chartType === 'value' ? 'active' : ''}`}
            >
              Value
            </button>
            <button
              onClick={() => setChartType('performance')}
              className={`tab-button text-xs ${chartType === 'performance' ? 'active' : ''}`}
            >
              Performance
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '11px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Line
              type="monotone"
              dataKey={chartType === 'value' ? 'value' : 'performance'}
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
