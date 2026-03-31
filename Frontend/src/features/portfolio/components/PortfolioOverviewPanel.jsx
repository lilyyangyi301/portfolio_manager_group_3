import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockData } from '../../../data/mockData';
import { getPortfolioOverview } from '../services/portfolioService';

export const PortfolioOverviewPanel = () => {
  const [chartType, setChartType] = useState('value');
  const [portfolio, setPortfolio] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPortfolioOverview();

        // Bind response fields to state
        setPortfolio({
          name: data.portfolioName || '',
          value: data.portfolioValue || 0,
          unrealizedGain: data.unrealizedGain || 0,
          realizedGain: data.realizedGain || 0,
          totalGain: data.totalGain || 0,
        });

        // Set chart data
        setHistory(data.chartData || []);

        console.log('Dashboard data loaded successfully:', data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);

        // Fallback to mock data if API fails
        console.log('Falling back to mock data...');
        setPortfolio(mockData.portfolio);
        setHistory(mockData.portfolioHistory);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="animate-fadeIn">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p className="text-secondary mt-2 text-sm">Loading portfolio data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !portfolio) {
    return (
      <div className="animate-fadeIn">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm font-medium">Error loading portfolio data:</p>
          <p className="text-red-700 text-xs mt-1">{error}</p>
          <p className="text-red-600 text-xs mt-2">Using mock data as fallback</p>
        </div>
      </div>
    );
  }

  // If no portfolio data, show empty state
  if (!portfolio) {
    return (
      <div className="animate-fadeIn">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-secondary">No portfolio data available</p>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Portfolio Value', value: `$${portfolio.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
    { label: 'Unrealized Gain', value: `$${portfolio.unrealizedGain.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, positive: true },
    { label: 'Realized Gain', value: `$${portfolio.realizedGain.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, positive: true },
    { label: 'Total Gain', value: `$${portfolio.totalGain.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, positive: true },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">{portfolio.name}</h3>
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
          <h4 className="font-semibold text-primary text-sm"></h4>
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

        {history.length > 0 ? (
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
        ) : (
          <div className="flex items-center justify-center h-56">
            <p className="text-secondary text-sm">No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
