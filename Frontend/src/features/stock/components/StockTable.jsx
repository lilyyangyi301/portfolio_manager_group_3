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
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 text-center">
        <p className="text-secondary">No stocks found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wide">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wide">
                Company
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-secondary uppercase tracking-wide">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-secondary uppercase tracking-wide">
                Change
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wide">
                Sector
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className={`border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedStock?.symbol === stock.symbol
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3">
                  <span className="font-bold text-primary">{stock.symbol}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-primary">{stock.companyName}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold text-primary">
                    ${stock.currentPrice.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
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
                <td className="px-4 py-3">
                  <span className="text-sm text-secondary">{stock.sector}</span>
                </td>
                <td className="px-4 py-3 text-center">
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
