import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft, Maximize2 } from 'lucide-react';
import { WatchlistButton } from '../../watchlist/components/WatchlistButton';

export const StockDetailCard = ({
  stock,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist,
  isLoading,
  onTransactionClick,
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
    { label: 'Average Volume', value: (stock.volume / 1000000).toFixed(1) + 'M' },
  ];

  return (
    <div className="terminal-surface sticky top-0 rounded-[22px] p-6">
      <div className="mb-6 border-b border-[#1C2940] pb-6">
        <h4 className="mb-1 text-lg font-semibold tracking-[0.16em] text-[#E8F0FB]">{stock.symbol}</h4>
        <p className="mb-4 text-sm text-[#8FA2BC]">{stock.companyName}</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-[#F3F8FF]">
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
        <p className="text-xs leading-relaxed text-[#8FA2BC]">{stock.description}</p>
      </div>

      <div className="space-y-3 mb-6">
        {detailItems.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between gap-4 rounded-xl border border-[#162133] bg-[#0F1726] px-3 py-2.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#6F86A6]">{item.label}</span>
            <span
              className={`text-right text-xs font-semibold ${
                item.positive !== undefined
                  ? item.positive
                    ? 'text-positive'
                    : 'text-negative'
                  : 'text-[#E8F0FB]'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <WatchlistButton
          stock={stock}
          onAddToWatchlist={onAddToWatchlist}
          onRemoveFromWatchlist={onRemoveFromWatchlist}
          isInWatchlist={isInWatchlist}
          isLoading={isLoading}
          fullWidth
        />

        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/chart/${stock.symbol}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#23314A] bg-[#0F1726] py-2.5 text-sm font-semibold text-[#DCE7F5] hover:border-[#385173] hover:bg-[#121C2D]"
          >
            <Maximize2 size={16} />
            Full Chart
          </Link>
          <button
            onClick={() => onTransactionClick?.()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5FA8FF] py-2.5 text-sm font-semibold text-[#09111D] hover:bg-[#7BB8FF]"
          >
            <ArrowRightLeft size={16} />
            Trade
          </button>
        </div>
      </div>
    </div>
  );
};
