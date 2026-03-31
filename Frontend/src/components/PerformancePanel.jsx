import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockData } from '../data/mockData';

export const PerformancePanel = () => {
  const [chartType, setChartType] = useState('value');
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');

  const history = mockData.portfolioHistory;
  const periods = mockData.performanceByPeriod;

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
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

          <ResponsiveContainer width="100%" height={280} className="mt-8">
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
                formatter={(value) => `${chartType === 'value' ? '$' : ''}${value.toLocaleString()}`}
              />
              <Line
                type="monotone"
                dataKey={chartType === 'value' ? 'value' : 'performance'}
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance by Period */}
        <div className="space-y-2">
          {periods.map((period) => (
            <button
              key={period.period}
              onClick={() => setSelectedPeriod(period.period)}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left text-sm ${
                selectedPeriod === period.period
                  ? 'border-accent bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-xs text-secondary mb-1">{period.period}</p>
              <p className={`font-bold ${period.positive ? 'text-positive' : 'text-negative'}`}>
                +{period.return}%
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
