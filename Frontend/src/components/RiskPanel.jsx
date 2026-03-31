import React from 'react';
import { mockData } from '../data/mockData';

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

  const getScalePercentage = (value, max = 3) => {
    return Math.min((value / max) * 100, 100);
  };

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
        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-primary text-sm">{metric.name}</h4>
              <p className="text-xs text-secondary">{metric.description}</p>
            </div>
            <div className={`text-2xl font-bold ${getRiskColor(metric.name, metric.data.value)}`}>
              {metric.data.value.toFixed(2)}
            </div>
          </div>

          {/* Scale Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-secondary">Low</span>
              <span className="text-xs text-secondary">Benchmark: {metric.data.benchmark}</span>
              <span className="text-xs text-secondary">High</span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              {/* Benchmark marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                style={{ left: `${getScalePercentage(metric.data.benchmark)}%` }}
              />
              {/* Current value bar */}
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

          {/* Description */}
          <p className="text-xs text-secondary bg-gray-50 rounded-lg p-2">
            {metric.data.description}
          </p>
        </div>
      ))}

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4">
        <h4 className="font-semibold text-primary text-sm mb-2">Portfolio Risk Summary</h4>
        <ul className="space-y-1 text-xs text-primary">
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold">•</span>
            <span>Your portfolio has moderate volatility with a Beta of 1.24, indicating slightly higher risk than the market.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success font-bold">•</span>
            <span>Strong risk-adjusted returns with a Sharpe Ratio of 1.85, showing good compensation for risk taken.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success font-bold">•</span>
            <span>Excellent downside protection with a Sortino Ratio of 2.42, demonstrating strong performance during market downturns.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
