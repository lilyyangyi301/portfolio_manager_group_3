import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { searchTicker } from '../../stock/services/stockService';

export const SearchBar = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await searchTicker(query);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (stock) => {
    onAdd(stock);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent bg-white text-sm"
          placeholder="Search ticker or company (e.g., AAPL)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
        />
        {query && (
          <button 
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
          {loading ? (
             <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            results.map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => handleSelect(stock)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors focus:bg-gray-50 focus:outline-none"
              >
                <div>
                  <span className="font-bold text-primary mr-2">{stock.ticker}</span>
                  <span className="text-sm text-secondary">{stock.name}</span>
                </div>
                <Plus className="h-4 w-4 text-accent" />
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">No results found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
};
