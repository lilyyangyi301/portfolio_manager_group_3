import React from 'react';
import { mockData } from '../../../data/mockData';

export const RiskPanel = () => {
  const risks = mockData.risks;

  const riskMetrics = [
    {
      name: 'Beta',
      data: risks.beta,
      description: 'Volatility relative to market',
    },
    {
      name: 'Sharpe Ratio',
      data: risks.sharpeRatio,
      description: 'Risk-adjusted return metric',
    },
    {
      name: 'Sortino Ratio',
      data: risks.sortinoRatio,
      description: 'Downside risk-adjusted return',
    },
  ];

  const getScalePercentage = (value, max = 3) => Math.min((value / max) * 100, 100);

  const getRiskColor = (name, value) => {
    if (name === 'Beta') {
      if (value < 1) return 'text-success';
      if (value < 1.5) return 'text-accent';
      return 'text-danger';
    }
    if (value > 2) return 'text-success';
    if (value > 1) return 'text-accent';
    return 'text-danger';
  };

  return (
    <div className="animate-fadeIn space-y-4">
      {riskMetrics.map((metric, idx) => (
        <div key={idx} className="terminal-surface rounded-[20px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-[#E8F0FB]">{metric.name}</h4>
              <p className="text-xs text-[#8FA2BC]">{metric.description}</p>
            </div>
            <div className={`text-2xl font-bold ${getRiskColor(metric.name, metric.data.value)}`}>
              {metric.data.value.toFixed(2)}
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6F86A6]">Low</span>
              <span className="text-xs text-[#6F86A6]">Benchmark: {metric.data.benchmark}</span>
              <span className="text-xs text-[#6F86A6]">High</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#162133]">
              <div
                className="absolute bottom-0 top-0 w-0.5 bg-[#6F86A6]"
                style={{ left: `${getScalePercentage(metric.data.benchmark)}%` }}
              />
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  getRiskColor(metric.name, metric.data.value) === 'text-success'
                    ? 'bg-success'
                    : getRiskColor(metric.name, metric.data.value) === 'text-accent'
                      ? 'bg-accent'
                      : 'bg-danger'
                }`}
                style={{ width: `${getScalePercentage(metric.data.value)}%` }}
              />
            </div>
          </div>

          <p className="rounded-lg border border-[#162133] bg-[#0F1726] p-2 text-xs text-[#8FA2BC]">
            {metric.data.description}
          </p>
        </div>
      ))}

      <div className="rounded-[20px] border border-[#1C2940] bg-[linear-gradient(180deg,rgba(16,25,39,0.98),rgba(11,18,32,0.98))] p-4">
        <h4 className="mb-2 text-sm font-semibold text-[#E8F0FB]">Portfolio Risk Summary</h4>
        <ul className="space-y-2 text-xs text-[#DCE7F5]">
          <li className="flex items-start gap-2">
            <span className="font-bold text-accent">*</span>
            <span>Your portfolio has moderate volatility with a Beta of 1.24, indicating slightly higher risk than the market.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-success">*</span>
            <span>Strong risk-adjusted returns with a Sharpe Ratio of 1.85, showing good compensation for risk taken.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-success">*</span>
            <span>Excellent downside protection with a Sortino Ratio of 2.42, demonstrating strong performance during market downturns.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
