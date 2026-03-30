import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { mockData } from '../data/mockData';
import { StockTable } from './StockTable';
import { StockDetailCard } from './StockDetailCard';

export const StockFinderPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(new Set());

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return mockData.stocks;

    const query = searchQuery.toLowerCase();
    return mockData.stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.companyName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleAddToWatchlist = async (stock) => {
    if (watchlist.some((s) => s.symbol === stock.symbol)) {
      return;
    }

    setLoadingStocks((prev) => new Set(prev).add(stock.symbol));

    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: stock.symbol,
          companyName: stock.companyName,
        }),
      });

      if (response.ok) {
        setWatchlist((prev) => [...prev, stock]);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    } finally {
      setLoadingStocks((prev) => {
        const updated = new Set(prev);
        updated.delete(stock.symbol);
        return updated;
      });
    }
  };

  const isInWatchlist = (symbol) => watchlist.some((s) => s.symbol === symbol);
  const isLoading = (symbol) => loadingStocks.has(symbol);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Stock Finder</h3>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search by ticker or company name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Table */}
        <div className="lg:col-span-2">
          <StockTable
            stocks={filteredStocks}
            selectedStock={selectedStock}
            onSelectStock={setSelectedStock}
            onAddToWatchlist={handleAddToWatchlist}
            isInWatchlist={isInWatchlist}
            isLoading={isLoading}
          />
        </div>

        {/* Stock Detail Card */}
        <div className="lg:col-span-1">
          {selectedStock ? (
            <StockDetailCard
              stock={selectedStock}
              onAddToWatchlist={handleAddToWatchlist}
              isInWatchlist={isInWatchlist(selectedStock.symbol)}
              isLoading={isLoading(selectedStock.symbol)}
            />
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full flex items-center justify-center">
              <p className="text-secondary text-center">Select a stock to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
