import React, { useEffect, useMemo, useState } from 'react';
import { Search, X, ArrowRightLeft } from 'lucide-react';
import { StockTable } from './StockTable';
import { StockDetailCard } from './StockDetailCard';
import { TransactionModal } from '../../../components/common/TransactionModal';
import {
  addToWatchlist,
  getAllStocks,
  getInitialWatchlist,
  removeFromWatchlist,
} from '../services/stockService';

export const StockFinderPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(new Set());
  const [transactionStock, setTransactionStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStockData = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const [allStocks, watchlistStocks] = await Promise.all([
          getAllStocks(),
          getInitialWatchlist(),
        ]);

        if (!isMounted) return;

        const stocksBySymbol = new Map(
          allStocks.map((stock) => [stock.symbol, stock]),
        );
        const mergedWatchlist = watchlistStocks.map(
          (stock) => stocksBySymbol.get(stock.symbol) || stock,
        );

        setStocks(allStocks);
        setWatchlist(mergedWatchlist);

        if (mergedWatchlist.length > 0) {
          setSelectedStock(mergedWatchlist[0]);
        } else if (allStocks.length > 0) {
          setSelectedStock(allStocks[0]);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error loading stock explorer data:', error);
        setLoadError('Unable to load stock data.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStockData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stocks;

    const query = searchQuery.toLowerCase();
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.companyName.toLowerCase().includes(query),
    );
  }, [searchQuery, stocks]);

  const handleAddToWatchlist = async (stock) => {
    if (watchlist.some((s) => s.symbol === stock.symbol)) return;

    setLoadingStocks((prev) => new Set(prev).add(stock.symbol));

    try {
      await addToWatchlist(stock.symbol);
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
      await removeFromWatchlist(stock.symbol);
      setWatchlist((prev) => prev.filter((s) => s.symbol !== stock.symbol));
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
    <div className="animate-fadeIn relative rounded-[24px] border border-[#1C2940] bg-[rgba(9,15,26,0.88)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:p-6">
      {loading && (
        <div className="terminal-loading mb-6">
          <p className="text-sm terminal-muted">Loading market data...</p>
        </div>
      )}

      {!loading && loadError && (
        <div className="terminal-error mb-6">
          <p className="text-sm text-[#FFD7DD]">{loadError}</p>
        </div>
      )}
      
      {watchlist.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-[#E8F0FB]">My Watchlist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {watchlist.map(stock => {
              const isPositive = stock.priceChangePercent >= 0;
              return (
                <div 
                  key={stock.symbol} 
                  className={`rounded-xl border bg-[#101927] p-4 cursor-pointer transition-all hover:border-[#314766] hover:shadow-[0_16px_32px_rgba(0,0,0,0.2)] ${selectedStock?.symbol === stock.symbol ? 'border-[#5FA8FF] ring-1 ring-[#5FA8FF]' : 'border-[#1C2940]'}`}
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-[#E8F0FB]">{stock.symbol}</h4>
                      <p className="text-xs text-[#8FA2BC] truncate w-24">{stock.companyName}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveFromWatchlist(stock); }}
                      className="text-[#6F86A6] hover:text-[#FF6B6B] transition-colors p-1"
                      disabled={isLoading(stock.symbol)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="font-bold text-lg text-[#F5FAFF]">${stock.currentPrice.toFixed(2)}</p>
                    <p className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                      {isPositive ? '+' : ''}{stock.priceChangePercent.toFixed(2)}%
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#1C2940]">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setTransactionStock(stock); }}
                      className="w-full py-1.5 flex items-center justify-center gap-2 rounded-lg border border-[#27415D] bg-[#132238] text-[#8FC2FF] text-sm font-medium transition-colors hover:bg-[#182A43]"
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

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-[#E8F0FB]">Market Explorer</h3>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F86A6]" size={18} />
          <input
            type="text"
            placeholder="Search by ticker or company name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#1C2940] bg-[#101927] pl-10 pr-4 py-2.5 text-[#E8F0FB] placeholder:text-[#6F86A6] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <div className="rounded-xl border border-[#1C2940] bg-[#101927] p-6 h-full flex items-center justify-center">
              <p className="text-[#8FA2BC] text-center">
                {loading ? 'Loading stock details...' : 'Select a stock to view details'}
              </p>
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
