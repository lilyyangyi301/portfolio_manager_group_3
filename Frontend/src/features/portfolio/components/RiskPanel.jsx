import React, { useEffect, useMemo, useState } from 'react';
import { mockData } from '../../../data/mockData';
import { getRiskAssessment } from '../services/portfolioService';

const getBetaComment = (value) => {
  if (value < 0.8) return 'Lower volatility than market';
  if (value < 1.05) return 'In line with market volatility';
  if (value < 1.3) return 'Slightly more volatile than market';
  if (value < 1.6) return 'More volatile than market';
  return 'High volatility relative to market';
};

const getSharpeComment = (value) => {
  if (value < 0) return 'Negative risk-adjusted returns';
  if (value < 1) return 'Weak risk-adjusted returns';
  if (value < 2) return 'Good risk-adjusted returns';
  if (value < 3) return 'Very strong risk-adjusted returns';
  return 'Exceptional risk-adjusted returns';
};

const getSortinoComment = (value) => {
  if (value < 0) return 'Poor downside risk control';
  if (value < 1) return 'Weak downside protection';
  if (value < 2) return 'Moderate downside protection';
  if (value < 3) return 'Good downside protection';
  return 'Excellent downside protection';
};

export const RiskPanel = () => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackRisks = mockData.risks;

  useEffect(() => {
    let isMounted = true;

    const loadRiskData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getRiskAssessment();
        if (!isMounted) return;
        setRiskData(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching risk assessment:', err);
        setError(err.message || 'Failed to load risk assessment');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRiskData();

    return () => {
      isMounted = false;
    };
  }, []);

  const risks = useMemo(() => {
    if (!riskData) {
      return fallbackRisks;
    }

    return {
      beta: {
        value: Number(riskData.beta ?? fallbackRisks.beta.value),
        benchmark: fallbackRisks.beta.benchmark,
        description: getBetaComment(Number(riskData.beta ?? fallbackRisks.beta.value)),
      },
      sharpeRatio: {
        value: Number(riskData.sharpeRatio ?? fallbackRisks.sharpeRatio.value),
        benchmark: fallbackRisks.sharpeRatio.benchmark,
        description: getSharpeComment(Number(riskData.sharpeRatio ?? fallbackRisks.sharpeRatio.value)),
      },
      sortinoRatio: {
        value: Number(riskData.sortinoRatio ?? fallbackRisks.sortinoRatio.value),
        benchmark: fallbackRisks.sortinoRatio.benchmark,
        description: getSortinoComment(Number(riskData.sortinoRatio ?? fallbackRisks.sortinoRatio.value)),
      },
    };
  }, [riskData, fallbackRisks]);

  const riskSummary = riskData?.riskSummary;

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

  if (loading) {
    return (
      <div className="terminal-loading">
        <p className="text-sm terminal-muted">Loading risk assessment...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-4">
      {error && (
        <div className="terminal-error">
          <p className="text-sm text-[#FFD7DD]">Risk API unavailable, using fallback data.</p>
        </div>
      )}

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
        {riskSummary ? (
          <p className="text-xs leading-relaxed text-[#DCE7F5]">{riskSummary}</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};
