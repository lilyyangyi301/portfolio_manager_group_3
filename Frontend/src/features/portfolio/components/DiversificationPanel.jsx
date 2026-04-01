import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getDiversificationData } from '../services/portfolioService';

const COLORS = [
  '#4C8DFF', // 主蓝（柔和亮蓝，融入背景）
  '#22C55E', // 盈利绿（但稍微压暗）
  '#F59E0B', // amber（不刺眼））
  '#8B5CF6', // 紫（高级感）
  '#06B6D4', // 青（数据感）
  '#F97316', // 橙（点缀）
  '#A78BFA', // 浅紫（层次）
  '#2DD4BF', // teal（冷色调统一）
  '#FB7185', // 柔和粉（对比但不突兀）
];

const TAB_CONFIG = [
  { label: 'Assets', type: 'assets' },
  { label: 'Asset types', type: 'asset-types' },
  { label: 'Sectors', type: 'sectors' },
  { label: 'Currency', type: 'currency' },
];

// Better hash for stable color generation
const betterHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Generate extra colors after palette is exhausted
const generateFallbackColor = (key, index) => {
  const hash = betterHash(`${key}-${index}`);
  const hue = hash % 360;
  const saturation = 60 + (hash % 10); // 60-69
  const lightness = 50 + (hash % 8);   // 50-57
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const DiversificationPanel = () => {
  const [activeType, setActiveType] = useState('assets');
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stable color mapping:
  // 1. first 10 items use designed palette
  // 2. remaining items use generated colors
  const categoryColorMap = useMemo(() => {
    const map = {};
    const usedColors = new Set();

    currentData.forEach((item, index) => {
      const key = item.categoryName || `Unknown-${index}`;

      let color;
      if (index < COLORS.length) {
        color = COLORS[index];
      } else {
        color = generateFallbackColor(key, index);

        // avoid accidental duplicate fallback colors
        while (usedColors.has(color)) {
          color = generateFallbackColor(`${key}-x`, index + usedColors.size);
        }
      }

      map[key] = color;
      usedColors.add(color);
    });

    return map;
  }, [currentData]);

  useEffect(() => {
    const fetchDiversification = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getDiversificationData(activeType);

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
        setError(err.message || 'Unknown error');
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

  const activeTabLabel =
    TAB_CONFIG.find((tab) => tab.type === activeType)?.label || 'Assets';

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
        <div className="terminal-loading mb-4">
          <p className="text-sm terminal-muted">Loading diversification data...</p>
        </div>
      )}

      {error && (
        <div className="terminal-error mb-4">
          <p className="text-sm text-[#FFD7DD]">
            Failed to load {activeTabLabel} data: {error}
          </p>
        </div>
      )}

      {!loading && !error && currentData.length === 0 && (
        <div className="terminal-empty mb-4">
          <p className="text-sm terminal-muted">No diversification data available.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-surface flex items-center justify-center rounded-[20px] p-4">
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
                {currentData.map((entry, index) => {
                  const key = entry.categoryName || `Unknown-${index}`;
                  return <Cell key={key} fill={categoryColorMap[key]} />;
                })}
              </Pie>

              <Tooltip
                formatter={(value, name, props) => [
                  formatPct(Number(value)),
                  props.payload.categoryName,
                ]}
                contentStyle={{
                  backgroundColor: '#0F1726',
                  border: '1px solid #22314A',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#E8F0FB',
                }}
                itemStyle={{
                  color: '#FFFFFF',
                }}
              />

              <Legend wrapperStyle={{ fontSize: '12px', color: '#8FA2BC' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {currentData.map((item, index) => {
            const key = item.categoryName || `Unknown-${index}`;

            return (
              <div
                key={key}
                className="rounded-lg border border-[#1C2940] bg-[#0F1726] p-3 transition-shadow hover:border-[#385173]"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#E8F0FB]">{item.categoryName}</p>
                  <p className="text-xs font-bold" style={{ color: categoryColorMap[key] }}>
                    {formatPct(item.allocationPct)}
                  </p>
                </div>

                <div className="h-1.5 w-full rounded-full bg-[#162133]">
                  <div
                    className="rounded-full h-1.5 transition-all duration-300"
                    style={{
                      width: `${item.allocationPct}%`,
                      backgroundColor: categoryColorMap[key],
                    }}
                  />
                </div>

                <p className="mt-1 text-xs text-[#8FA2BC]">
                  {formatCurrency(item.totalValue)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="terminal-surface mt-4 overflow-hidden rounded-[20px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#1C2940] bg-[#0F1726]">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F86A6]">
                  Asset type
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F86A6]">
                  Holding value
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F86A6]">
                  Allocation
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F86A6]">
                  Unrealized gain
                </th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((row, index) => {
                const key = row.categoryName || `Unknown-${index}`;

                return (
                  <tr
                    key={key}
                    className="border-b border-[#162133] transition-colors hover:bg-[rgba(17,25,40,0.96)]"
                  >
                    <td className="px-4 py-2 text-sm font-medium text-[#E8F0FB]">
                      {row.categoryName}
                    </td>
                    <td className="px-4 py-2 text-sm text-[#DCE7F5]">
                      {formatCurrency(row.totalValue)}
                    </td>
                    <td className="px-4 py-2 text-sm text-[#DCE7F5]">
                      {formatPct(row.allocationPct)}
                    </td>
                    <td
                      className={`px-4 py-2 font-medium text-sm ${
                        row.unrealizedGain >= 0 ? 'text-positive' : 'text-negative'
                      }`}
                    >
                      {row.unrealizedGain >= 0 ? '+' : ''}
                      {formatCurrency(row.unrealizedGain)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};