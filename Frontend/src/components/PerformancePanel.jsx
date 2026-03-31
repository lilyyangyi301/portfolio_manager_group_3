import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PerformancePanel = () => {
  const [chartType, setChartType] = useState('value');
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const [history, setHistory] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchControlInvestmentData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/v1/dashboard/ControlInvestment');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Bind chartData to existing line chart
        setHistory(Array.isArray(data.chartData) ? data.chartData : []);

        // Bind performanceMetrics to right cards
        const metrics = data.performanceMetrics || {};
        setPeriods([
          { period: '1 month', return: Number(metrics.oneMonth || 0) },
          { period: '3 month', return: Number(metrics.threeMonth || 0) },
          { period: '6 month', return: Number(metrics.sixMonth || 0) },
          { period: 'YTD', return: Number(metrics.ytd || 0) },
          { period: '1 year', return: Number(metrics.oneYear || 0) },
          { period: 'All time', return: Number(metrics.allTime || 0) },
        ]);
      } catch (err) {
        console.error('Error fetching Control Investment data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchControlInvestmentData();
  }, []);

  if (loading) {
    return (
      <div className="animate-fadeIn">
        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-secondary text-sm">Loading investment performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeIn">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm font-medium">Failed to load Control Investment data</p>
          <p className="text-red-700 text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

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
                formatter={(value) => {
                  const num = Number(value || 0);
                  return chartType === 'value'
                    ? `$${num.toLocaleString()}`
                    : `${num.toFixed(2)}%`;
                }}
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
          {periods.map((period) => {
            const isPositive = period.return >= 0;
            return (
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
                <p className={`font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                  {isPositive ? '+' : ''}{period.return.toFixed(2)}%
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
