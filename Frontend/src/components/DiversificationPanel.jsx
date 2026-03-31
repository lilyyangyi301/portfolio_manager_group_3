import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const TAB_CONFIG = [
  { label: 'Assets', type: 'assets' },
  { label: 'Asset types', type: 'asset-types' },
  { label: 'Sectors', type: 'sectors' },
  { label: 'Currency', type: 'currency' },
];

export const DiversificationPanel = () => {
  const [activeType, setActiveType] = useState('assets');
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stable color mapping by categoryName (same category always gets same color)
  const categoryColorMap = useMemo(() => {
    const map = {};
    currentData.forEach((item) => {
      const key = item.categoryName || '';
      const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      map[key] = COLORS[hash % COLORS.length];
    });
    return map;
  }, [currentData]);

  useEffect(() => {
    const fetchDiversification = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/v1/dashboard/ManageDiversification/${activeType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Expected response:
        // [{ categoryName, totalValue, allocationPct, unrealizedGain }]
        const normalized = Array.isArray(data)
          ? data.map((item) => ({
              categoryName: item.categoryName,
              totalValue: Number(item.totalValue || 0),
              allocationPct: Number(item.allocationPct || 0),
              unrealizedGain: Number(item.unrealizedGain || 0),
            }))
          : [];

        setCurrentData(normalized);
      } catch (err) {
        console.error('Error fetching diversification data:', err);
        setError(err.message);
        setCurrentData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiversification();
  }, [activeType]);

  const formatCurrency = (value) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const formatPct = (value) => `${value.toFixed(2)}%`;

  const activeTabLabel = TAB_CONFIG.find((tab) => tab.type === activeType)?.label || 'Assets';

  return (
    <div className="animate-fadeIn">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveType(tab.type)}
            className={`tab-button whitespace-nowrap text-xs ${activeType === tab.type ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 mb-4">
          <p className="text-secondary text-sm">Loading diversification data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">Failed to load {activeTabLabel} data: {error}</p>
        </div>
      )}

      {!loading && !error && currentData.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 mb-4">
          <p className="text-secondary text-sm">No diversification data available.</p>
        </div>
      )}

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
                dataKey="allocationPct"
                nameKey="categoryName"
              >
                {currentData.map((entry) => (
                  <Cell key={entry.categoryName} fill={categoryColorMap[entry.categoryName]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [formatPct(Number(value)), props.payload.categoryName]}
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

        {/* Distribution Table (right panel) */}
        <div className="space-y-2">
          <h4 className="font-semibold text-primary text-sm mb-3">Portfolio distribution</h4>
          {currentData.map((item) => (
            <div key={item.categoryName} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-primary text-sm">{item.categoryName}</p>
                <p className="text-xs font-bold" style={{ color: categoryColorMap[item.categoryName] }}>
                  {formatPct(item.allocationPct)}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="rounded-full h-1.5 transition-all duration-300"
                  style={{ width: `${item.allocationPct}%`, backgroundColor: categoryColorMap[item.categoryName] }}
                />
              </div>
              <p className="text-xs text-secondary mt-1">{formatCurrency(item.totalValue)}</p>
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
              {currentData.map((row) => (
                <tr key={row.categoryName} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 font-medium text-primary text-sm">{row.categoryName}</td>
                  <td className="px-4 py-2 text-primary text-sm">{formatCurrency(row.totalValue)}</td>
                  <td className="px-4 py-2 text-primary text-sm">{formatPct(row.allocationPct)}</td>
                  <td className={`px-4 py-2 font-medium text-sm ${row.unrealizedGain >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {row.unrealizedGain >= 0 ? '+' : ''}{formatCurrency(row.unrealizedGain)}
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
