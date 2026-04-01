import React from 'react';
import { WatchlistButton } from '../../watchlist/components/WatchlistButton';

export const StockTable = ({
  stocks,
  selectedStock,
  onSelectStock,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist,
  isLoading,
}) => {
  if (stocks.length === 0) {
    return (
      <div className="terminal-empty">
        <p className="terminal-muted text-sm">No stocks found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="terminal-surface overflow-hidden rounded-[20px]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1C2940] bg-[#0F1726]">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F86A6]">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F86A6]">
                Company
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F86A6]">
                Price
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F86A6]">
                Change
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F86A6]">
                Sector
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F86A6]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className={`cursor-pointer border-b border-[#162133] transition-colors ${
                  selectedStock?.symbol === stock.symbol
                    ? 'bg-[rgba(95,168,255,0.12)]'
                    : 'hover:bg-[rgba(17,25,40,0.96)]'
                }`}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-8 w-1 rounded-full ${
                        selectedStock?.symbol === stock.symbol ? 'bg-[#5FA8FF]' : 'bg-transparent'
                      }`}
                    />
                    <span className="font-semibold tracking-[0.14em] text-[#E8F0FB]">{stock.symbol}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-[#DCE7F5]">{stock.companyName}</span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="font-semibold text-[#F3F8FF]">
                    ${stock.currentPrice.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span
                    className={`text-sm font-semibold ${
                      stock.priceChangePercent >= 0
                        ? 'text-positive'
                        : 'text-negative'
                    }`}
                  >
                    {stock.priceChangePercent >= 0 ? '+' : ''}
                    {stock.priceChangePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-[#8FA2BC]">{stock.sector}</span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <WatchlistButton
                    stock={stock}
                    onAddToWatchlist={onAddToWatchlist}
                    onRemoveFromWatchlist={onRemoveFromWatchlist}
                    isInWatchlist={isInWatchlist(stock.symbol)}
                    isLoading={isLoading(stock.symbol)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
