import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { getPerformanceData } from '../services/portfolioService';

export const PerformancePanel = () => {
  const [chartType, setChartType] = useState('value');
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const [history, setHistory] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const targetPointDetails = useMemo(() => {
    if (!history.length || selectedPeriod === 'All time') return null;
    
    // Assuming history is sorted oldest to newest
    const now = new Date(history[history.length - 1].date);
    let targetDate = new Date(now);

    switch (selectedPeriod) {
      case '1 month': targetDate.setMonth(now.getMonth() - 1); break;
      case '3 month': targetDate.setMonth(now.getMonth() - 3); break;
      case '6 month': targetDate.setMonth(now.getMonth() - 6); break;
      case 'YTD': targetDate = new Date(now.getFullYear(), 0, 1); break;
      case '1 year': targetDate.setFullYear(now.getFullYear() - 1); break;
      default: return null;
    }

    const targetTime = targetDate.getTime();
    let bestIndex = -1;
    let minDiff = Infinity;

    // Find the closest data point to the target date
    for (let i = 0; i < history.length; i++) {
      const diff = Math.abs(new Date(history[i].date).getTime() - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        bestIndex = i;
      }
    }
    
    return bestIndex !== -1 ? history[bestIndex] : null;
  }, [history, selectedPeriod]);

  // Fetch data on mount
  useEffect(() => {
    const fetchControlInvestmentData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPerformanceData();

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
        <div className="terminal-loading flex h-80 items-center justify-center">
          <p className="text-sm terminal-muted">Loading investment performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeIn">
        <div className="terminal-error">
          <p className="text-sm font-medium text-[#FFD7DD]">Failed to load Control Investment data</p>
          <p className="mt-1 text-xs text-[#FFB5BF]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="terminal-surface rounded-[20px] p-4 lg:col-span-2">
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
                activeDot={{ r: 6, fill: "#5FA8FF", stroke: "#101927", strokeWidth: 2 }}
                isAnimationActive={true}
              />
              {targetPointDetails && (
                <ReferenceDot
                  x={targetPointDetails.date}
                  y={targetPointDetails[chartType === 'value' ? 'value' : 'performance']}
                  r={6}
                  fill="#0F1726"
                  stroke="#5FA8FF"
                  strokeWidth={3}
                  label={{ position: 'top', value: selectedPeriod, fill: '#8FA2BC', fontSize: 11, dy: -10 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {periods.map((period) => {
            const isPositive = period.return >= 0;
            return (
              <button
                key={period.period}
                onClick={() => setSelectedPeriod(period.period)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                  selectedPeriod === period.period
                    ? 'border-[#5FA8FF] bg-[rgba(95,168,255,0.12)]'
                    : 'border-[#1C2940] bg-[#0F1726] hover:border-[#385173]'
                }`}
              >
                <p className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#6F86A6]">{period.period}</p>
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
