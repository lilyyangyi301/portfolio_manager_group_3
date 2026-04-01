import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getPotentialData } from '../services/portfolioService';

export const PotentialPanel = () => {
  const [filterType, setFilterType] = useState('All');
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPotentialData();
        setHoldings(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredHoldings = () => {
    if (filterType === 'Gainers') {
      return holdings.filter((h) => h.changePct > 0).sort((a, b) => b.changePct - a.changePct);
    }
    if (filterType === 'Losers') {
      return holdings.filter((h) => h.changePct < 0).sort((a, b) => a.changePct - b.changePct);
    }
    return holdings.sort((a, b) => b.changePct - a.changePct);
  };

  const filteredData = getFilteredHoldings();

  const chartData = filteredData.map((h) => ({
    symbol: h.symbol,
    change: Math.abs(h.changePct),
    positive: h.changePct > 0,
  }));

  const getBarColor = (entry) => {
    return entry.positive ? '#10B981' : '#EF4444';
  };

  if (loading) {
    return (
      <div className="terminal-loading">
        <p className="text-sm terminal-muted">Loading potential data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminal-error">
        <p className="text-sm font-medium text-[#FFD7DD]">Error loading potential data</p>
        <p className="mt-1 text-xs text-[#FFB5BF]">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex gap-2 mb-4">
        {['All', 'Gainers', 'Losers'].map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterType(filter)}
            className={`rounded-lg px-3 py-1 text-sm font-medium transition-all ${
              filterType === filter
                ? 'bg-[#5FA8FF] text-[#09111D]'
                : 'border border-[#1C2940] bg-[#0F1726] text-[#8FA2BC] hover:border-[#385173] hover:text-[#E8F0FB]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="terminal-surface mb-4 rounded-[20px] p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#22314A" />
            <XAxis type="number" stroke="#6F86A6" style={{ fontSize: '11px' }} />
            <YAxis dataKey="symbol" type="category" stroke="#6F86A6" style={{ fontSize: '11px' }} />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#0F1726',
                border: '1px solid #22314A',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#E8F0FB',
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

      <div className="terminal-surface overflow-hidden rounded-[20px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#1C2940] bg-[#0F1726]">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F86A6]">Symbol</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F86A6]">Name</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F86A6]">Value</th>
                <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F86A6]">Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((holding, idx) => (
                <tr key={idx} className="border-b border-[#162133] transition-colors hover:bg-[rgba(17,25,40,0.96)]">
                  <td className="px-4 py-2">
                    <p className="text-sm font-semibold tracking-[0.1em] text-[#E8F0FB]">{holding.symbol}</p>
                  </td>
                  <td className="px-4 py-2">
                    <p className="text-sm text-[#8FA2BC]">{holding.name}</p>
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-[#DCE7F5]">
                    ${holding.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={`font-bold text-sm ${holding.changePct > 0 ? 'text-positive' : 'text-negative'}`}>
                      {holding.changePct > 0 ? '+' : ''}{holding.changePct}%
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
