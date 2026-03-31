import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { WatchlistItem } from '../components/WatchlistItem';
import { getInitialWatchlist, subscribeToPriceUpdates } from '../../stock/services/stockService';

export const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data (Feature A)
  useEffect(() => {
    let isMounted = true;
    
    const fetchWatchlist = async () => {
      try {
        // Try to load from localStorage first
        const saved = localStorage.getItem('investpro_watchlist');
        if (saved) {
          if (isMounted) setWatchlist(JSON.parse(saved));
        } else {
          // Fallback to mock initial data
          const data = await getInitialWatchlist();
          if (isMounted) setWatchlist(data);
        }
      } catch (error) {
        console.error("Failed to load watchlist", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWatchlist();
    return () => { isMounted = false; };
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('investpro_watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, loading]);

  // Subscribe to real-time price updates (Feature B)
  useEffect(() => {
    if (watchlist.length === 0) return;

    const tickers = watchlist.map(stock => stock.ticker);
    
    const unsubscribe = subscribeToPriceUpdates(tickers, (updatedStocks) => {
      setWatchlist(prev => {
        const updatesMap = updatedStocks.reduce((acc, stock) => {
          acc[stock.ticker] = stock;
          return acc;
        }, {});

        return prev.map(stock => updatesMap[stock.ticker] ? { ...stock, ...updatesMap[stock.ticker] } : stock);
      });
    });

    return () => unsubscribe();
  }, [watchlist.map(s => s.ticker).join(',')]);

  // Handle adding a new stock (Feature C)
  const handleAddStock = (newStock) => {
    // Prevent duplicates
    if (watchlist.some(stock => stock.ticker === newStock.ticker)) {
      return; 
    }
    setWatchlist(prev => [...prev, newStock]);
  };

  // Handle removing a stock (Feature D)
  const handleRemoveStock = (tickerToRemove) => {
    setWatchlist(prev => prev.filter(stock => stock.ticker !== tickerToRemove));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-primary">
            <Activity className="mr-3 text-accent" size={32} />
            Watchlist
          </h1>
          <p className="text-secondary mt-1">Track market movements</p>
        </div>
        
        {/* Search Bar (Feature C) */}
        <div className="w-full md:w-auto">
          <SearchBar onAdd={handleAddStock} />
        </div>
      </div>

      {/* Main List Container */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="text-secondary animate-pulse">Loading watchlist data...</div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
             <p className="text-secondary">Your watchlist is empty.</p>
             <p className="text-sm text-gray-400 mt-2">Search for a ticker above to add it to your list.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {watchlist.map((stock) => (
              <WatchlistItem 
                key={stock.ticker} 
                stock={stock} 
                onRemove={handleRemoveStock} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
