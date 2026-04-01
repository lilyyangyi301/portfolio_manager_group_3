import React from 'react';
import { Star, X } from 'lucide-react';

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
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
        fullWidth ? 'w-full' : ''
      } ${
        isLoading
          ? 'bg-[#101927] text-secondary border border-[#1c2940] cursor-wait opacity-60'
          : isInWatchlist
            ? 'bg-success/10 text-success border border-success/20 hover:bg-danger/10 hover:text-danger hover:border-danger/30 shadow-[0_0_15px_rgba(47,203,137,0.1)] hover:shadow-[0_0_15px_rgba(255,107,107,0.15)] active:scale-95 group'
            : 'bg-[#101927] text-primary border border-[#22314a] hover:bg-[#152033] hover:border-accent/40 hover:text-accent hover:shadow-[0_0_15px_rgba(95,168,255,0.1)] active:scale-95 group'
      }`}
    >
      <Star 
        size={16} 
        fill={isInWatchlist ? 'currentColor' : 'none'} 
        className={`${isInWatchlist ? 'group-hover:hidden' : 'group-hover:scale-110 transition-transform duration-300'}`} 
      />
      {isInWatchlist && !isLoading && <X size={16} className="hidden group-hover:block" />}
      
      <span>
        {isLoading 
          ? 'Processing...' 
          : isInWatchlist 
            ? <><span className="group-hover:hidden">In Watchlist</span><span className="hidden group-hover:inline">Remove</span></>
            : 'Add to Watchlist'}
      </span>
    </button>
  );
};
