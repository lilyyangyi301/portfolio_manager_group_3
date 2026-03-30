import React from 'react';
import { Star } from 'lucide-react';

export const WatchlistButton = ({
  stock,
  onAddToWatchlist,
  isInWatchlist,
  isLoading,
  fullWidth = false,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (!isInWatchlist && !isLoading) {
      onAddToWatchlist(stock);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isInWatchlist || isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
        fullWidth ? 'w-full' : ''
      } ${
        isInWatchlist
          ? 'bg-green-50 text-positive border border-green-200 cursor-default'
          : isLoading
            ? 'bg-gray-100 text-secondary border border-gray-200 cursor-wait'
            : 'bg-accent text-white border border-accent hover:bg-blue-600 active:scale-95'
      }`}
    >
      <Star size={16} fill={isInWatchlist ? 'currentColor' : 'none'} />
      {isLoading ? 'Adding...' : isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </button>
  );
};
