import React from 'react';
import { WatchlistButton } from './WatchlistButton';
import { Link } from 'react-router-dom';
import { ArrowRightLeft, Maximize2 } from 'lucide-react';

export const StockDetailCard = ({
  stock,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist,
  isLoading,
  onTransactionClick
}) => {
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const detailItems = [
    { label: 'Current Price', value: `$${stock.currentPrice.toFixed(2)}` },
    {
      label: 'Daily Change',
      value: `${stock.priceChange >= 0 ? '+' : ''}${stock.priceChange.toFixed(2)} (${stock.priceChangePercent >= 0 ? '+' : ''}${stock.priceChangePercent.toFixed(2)}%)`,
      positive: stock.priceChangePercent >= 0,
    },
    { label: 'Sector', value: stock.sector },
    { label: 'Industry', value: stock.industry },
    { label: 'Exchange', value: stock.exchange },
    { label: 'Market Cap', value: formatNumber(stock.marketCap) },
    { label: 'P/E Ratio', value: stock.peRatio.toFixed(2) },
    { label: 'Dividend Yield', value: `${stock.dividendYield.toFixed(2)}%` },
    { label: '52-Week High', value: `$${stock.weekHigh52.toFixed(2)}` },
    { label: '52-Week Low', value: `$${stock.weekLow52.toFixed(2)}` },
    { label: 'Avg Volume', value: (stock.volume / 1000000).toFixed(1) + 'M' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-0">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h4 className="text-lg font-bold text-primary mb-1">{stock.symbol}</h4>
        <p className="text-sm text-secondary mb-4">{stock.companyName}</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">
            ${stock.currentPrice.toFixed(2)}
          </span>
          <span
            className={`text-sm font-semibold ${
              stock.priceChangePercent >= 0 ? 'text-positive' : 'text-negative'
            }`}
          >
            {stock.priceChangePercent >= 0 ? '+' : ''}
            {stock.priceChangePercent.toFixed(2)}%
          </span>
        </div>
        <p className="text-xs text-secondary leading-relaxed">{stock.description}</p>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 mb-6">
        {detailItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start">
            <span className="text-xs text-secondary font-medium">{item.label}</span>
            <span
              className={`text-xs font-semibold text-right ${
                item.positive !== undefined
                  ? item.positive
                    ? 'text-positive'
                    : 'text-negative'
                  : 'text-primary'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {/* Add/Remove from Watchlist Button */}
        <WatchlistButton
          stock={stock}
          onAddToWatchlist={onAddToWatchlist}
          onRemoveFromWatchlist={onRemoveFromWatchlist}
          isInWatchlist={isInWatchlist}
          isLoading={isLoading}
          fullWidth
        />

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Link 
            to={`/chart/${stock.symbol}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-primary hover:bg-gray-50 transition-colors"
          >
            <Maximize2 size={16} />
            Full Chart
          </Link>
          <button
            onClick={() => onTransactionClick?.()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            <ArrowRightLeft size={16} />
            Trade
          </button>
        </div>
      </div>
    </div>
  );
};
