import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRightLeft } from 'lucide-react';
import { mockData } from '../../../data/mockData';
import { StockTable } from './StockTable';
import { StockDetailCard } from './StockDetailCard';
import { TransactionModal } from '../../../components/common/TransactionModal';

export const StockFinderPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(new Set());
  const [transactionStock, setTransactionStock] = useState(null);

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
    if (watchlist.some((s) => s.symbol === stock.symbol)) return;

    setLoadingStocks((prev) => new Set(prev).add(stock.symbol));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setWatchlist((prev) => [...prev, stock]);
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

  const handleRemoveFromWatchlist = async (stock) => {
    setLoadingStocks((prev) => new Set(prev).add(stock.symbol));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setWatchlist((prev) => prev.filter(s => s.symbol !== stock.symbol));
      if (selectedStock?.symbol === stock.symbol) {
        setSelectedStock(null);
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
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
    <div className="animate-fadeIn relative">
      
      {/* Watchlist Section */}
      {watchlist.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary mb-4">My Watchlist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {watchlist.map(stock => {
              const isPositive = stock.priceChangePercent >= 0;
              return (
                <div 
                  key={stock.symbol} 
                  className={`bg-white p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${selectedStock?.symbol === stock.symbol ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-200'}`}
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-primary">{stock.symbol}</h4>
                      <p className="text-xs text-secondary truncate w-24">{stock.companyName}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveFromWatchlist(stock); }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      disabled={isLoading(stock.symbol)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="font-bold text-lg">${stock.currentPrice.toFixed(2)}</p>
                    <p className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                      {isPositive ? '+' : ''}{stock.priceChangePercent.toFixed(2)}%
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setTransactionStock(stock); }}
                      className="w-full py-1.5 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ArrowRightLeft size={14} /> Trade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Explorer Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-primary">Market Explorer</h3>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
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
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
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
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              isInWatchlist={isInWatchlist(selectedStock.symbol)}
              isLoading={isLoading(selectedStock.symbol)}
              onTransactionClick={() => setTransactionStock(selectedStock)}
            />
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full flex items-center justify-center">
              <p className="text-secondary text-center">Select a stock to view details</p>
            </div>
          )}
        </div>
      </div>

      {transactionStock && (
        <TransactionModal 
          stock={transactionStock} 
          onClose={() => setTransactionStock(null)} 
        />
      )}
    </div>
  );
};
