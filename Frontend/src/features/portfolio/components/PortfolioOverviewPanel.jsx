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
        <div className="terminal-loading flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-accent"></div>
            <p className="mt-2 text-sm terminal-muted">Loading portfolio data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !portfolio) {
    return (
      <div className="animate-fadeIn">
        <div className="terminal-error">
          <p className="text-sm font-medium text-[#FFD7DD]">Error loading portfolio data:</p>
          <p className="mt-1 text-xs text-[#FFB5BF]">{error}</p>
          <p className="mt-2 text-xs text-[#FF9CAA]">Using mock data as fallback</p>
        </div>
      </div>
    );
  }

  // If no portfolio data, show empty state
  if (!portfolio) {
    return (
      <div className="animate-fadeIn">
        <div className="terminal-empty">
          <p className="terminal-muted">No portfolio data available</p>
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold tracking-[0.1em] text-[#E8F0FB]">{portfolio.name}</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[#6F86A6]">{metric.label}</p>
            <p className={`text-base font-bold ${metric.positive ? 'text-positive' : 'text-[#E8F0FB]'}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="terminal-surface rounded-[20px] p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-[#E8F0FB]">Portfolio Trend</h4>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#22314A" />
              <XAxis dataKey="date" stroke="#6F86A6" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6F86A6" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1726',
                  border: '1px solid #22314A',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#E8F0FB',
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
            <p className="text-sm terminal-muted">No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
