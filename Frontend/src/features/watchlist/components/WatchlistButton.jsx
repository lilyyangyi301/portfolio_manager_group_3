import React from 'react';
import { Star } from 'lucide-react';

export const WatchlistButton = ({
  stock,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist,
  isLoading,
  fullWidth = false,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (isLoading) return;

    if (isInWatchlist && onRemoveFromWatchlist) {
      onRemoveFromWatchlist(stock);
    } else if (!isInWatchlist && onAddToWatchlist) {
      onAddToWatchlist(stock);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
        fullWidth ? 'w-full' : ''
      } ${
        isLoading
          ? 'bg-gray-100 text-secondary border border-gray-200 cursor-wait'
          : isInWatchlist
            ? 'bg-green-50 text-positive border border-green-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 group'
            : 'bg-accent text-white border border-accent hover:bg-blue-600 active:scale-95'
      }`}
    >
      <Star size={16} fill={isInWatchlist ? 'currentColor' : 'none'} className="group-hover:hidden" />
      <span className="hidden group-hover:block transition-all">Done</span>
      {isLoading ? 'Processing...' : isInWatchlist ? <span className="group-hover:hidden">In Watchlist</span> : 'Add to Watchlist'}
      {isInWatchlist && !isLoading && <span className="hidden group-hover:block">Remove</span>}
    </button>
  );
};
