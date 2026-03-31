import React from 'react';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

export const WatchlistItem = ({ stock, onRemove }) => {
  const isPositive = stock.change >= 0;

  return (
    <div className="card p-4 flex items-center justify-between mb-2 hover:bg-gray-50 group animate-fadeIn">
      {/* 
        Changing from cursor-pointer to a static item with a specific delete button
        so we don't accidentally trigger row actions when deleting.
      */}
      <div className="flex flex-col">
        <span className="font-bold text-lg text-primary">{stock.ticker}</span>
        <span className="text-sm text-secondary truncate w-32 md:w-48">{stock.name}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="font-semibold text-lg text-primary">${stock.price.toFixed(2)}</span>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            <span>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)}{' '}
              ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Delete button (hidden by default, shown on group hover) */}
        <button 
          onClick={() => onRemove(stock.ticker)}
          className="text-gray-300 hover:text-danger hover:bg-red-50 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          title="Remove from Watchlist"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
