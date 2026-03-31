import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

export const TransactionModal = ({ stock, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');

  // fallback to generic price if not easily resolvable from mocked data
  const price = stock.currentPrice || stock.price || 0; 
  const totalValue = (price * quantity).toFixed(2);
  const priceChange = stock.priceChangePercent ?? stock.changePercent ?? 0;
  const isPositive = priceChange >= 0;

  const handleTransaction = () => {
    if (quantity <= 0) return;
    
    setLoading(true);
    // Simulate API transaction delay
    setTimeout(() => {
      setLoading(false);
      setStatus('success');
      
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
  };

  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-primary">{stock.symbol || stock.ticker}</h2>
            <p className="text-secondary">{stock.companyName || stock.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors font-bold"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status / Content */}
        {status === 'success' ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-2">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary">Transaction Complete</h3>
            <p className="text-secondary">Your order for {quantity} share(s) has been successfully executed.</p>
          </div>
        ) : (
          <div className="p-6">
            
            {/* Price Info */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm text-secondary mb-1">Current Price</p>
                <p className="text-3xl font-bold text-primary">${price.toFixed(2)}</p>
              </div>
              <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded ${isPositive ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>

            {/* Inputs */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2" htmlFor="quantity">
                Shares Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                step="1"
                className="w-full text-lg p-3 border border-gray-200 rounded-xl focus:ring-accent focus:border-transparent outline-none transition-all"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || '' ))}
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center">
              <span className="font-semibold text-secondary">Estimated Total</span>
              <span className="text-xl font-bold text-primary">${totalValue}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleTransaction}
                disabled={loading || !quantity}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-lg transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Buy'}
              </button>
              <button
                onClick={handleTransaction}
                disabled={loading || !quantity}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-lg transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Sell'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
