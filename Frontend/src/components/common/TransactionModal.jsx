import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { getBalanceData } from '../../features/portfolio/services/portfolioService';
import { executeTrade } from '../../features/stock/services/stockService';

export const TransactionModal = ({ stock, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [transactionType, setTransactionType] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchBalance = async () => {
      try {
        const data = await getBalanceData();
        if (isMounted) {
          const balance = data?.account_balance ?? data?.accountBalance ?? data?.balance ?? data?.amount ?? (typeof data === 'number' ? data : 0);
          setCurrentBalance(Number(balance));
        }
      } catch (error) {
        if (isMounted) setCurrentBalance(0);
      } finally {
        if (isMounted) setBalanceLoading(false);
      }
    };
    fetchBalance();
    return () => { isMounted = false; };
  }, []);

  // fallback to generic price if not easily resolvable from mocked data
  const price = stock.currentPrice || stock.price || 0;
  const totalValue = (price * quantity).toFixed(2);
  const priceChange = stock.priceChangePercent ?? stock.changePercent ?? 0;
  const isPositive = priceChange >= 0;

  const postTradeBalance = currentBalance !== null 
    ? (transactionType === 'buy' ? currentBalance - parseFloat(totalValue) : currentBalance + parseFloat(totalValue))
    : null;

  const handleInitiateTransaction = (type) => {
    if (quantity <= 0) return;
    setTransactionType(type);
    setStatus('confirm');
  };

  const handleTransaction = async () => {
    if (quantity <= 0) return;

    if (transactionType === 'buy' && currentBalance !== null && currentBalance - parseFloat(totalValue) < 0) {
      setErrorMessage("Insufficient Funds: Your account balance will fall below $0.00 after this trade.");
      setStatus('error');
      return;
    }

    setLoading(true);
    
    const tradeQuantity = transactionType === 'buy' ? Number(quantity) : -Number(quantity);
    const finalAssetType = stock.assetType || 'STOCKS';
    const finalSector = stock.sector || 'Unknown';
    const actionStr = transactionType === 'buy' ? '1' : '-1';
    
    try {
      const response = await executeTrade({
        symbol: stock.symbol || stock.ticker,
        quantity: tradeQuantity,
        price: Number(price),
        assetType: finalAssetType,
        sector: finalSector,
        action: actionStr
      });
      
      if (typeof response === 'string') {
        setSuccessMessage(response);
      } else {
        setSuccessMessage(`Your order for ${quantity} share(s) has been successfully executed.`);
      }
      
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Trade failed:', error);
      let backendMsg = '';
      if (error.response?.data) {
        backendMsg = typeof error.response.data === 'string' ? error.response.data : (error.response.data.message || '');
      }
      
      if (transactionType === 'sell') {
        setErrorMessage(backendMsg || "Transaction Failed: You do not hold enough shares of this stock to complete the sale.");
      } else {
        setErrorMessage(backendMsg || "Trade execution failed. Please check the backend server.");
      }
      setStatus('error');
      setLoading(false);
    }
  };

  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-[100] flex animate-fadeIn items-center justify-center bg-[rgba(3,7,13,0.72)] p-4 backdrop-blur-sm">
      <div
        className="terminal-surface relative w-full max-w-md overflow-hidden rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1C2940] p-6">
          <div>
            <h2 className="text-2xl font-bold tracking-[0.16em] text-[#E8F0FB]">{stock.symbol || stock.ticker}</h2>
            <p className="text-[#8FA2BC]">{stock.companyName || stock.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 font-bold text-[#8FA2BC] hover:bg-[#121C2D] hover:text-[#E8F0FB]"
          >
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-[#1F4C38] bg-[rgba(47,203,137,0.12)] text-[#2FCB89]">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#E8F0FB]">Transaction Complete</h3>
            <p className="text-[#8FA2BC]">{successMessage}</p>
          </div>
        ) : status === 'error' ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-[#C84F5A] bg-[rgba(200,79,90,0.12)] text-[#C84F5A]">
              <X size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#FF6B6B]">Transaction Failed</h3>
            <p className="text-[#8FA2BC]">{errorMessage}</p>
            <button
               onClick={() => setStatus('idle')}
               className="mt-6 rounded-xl bg-[#1C2940] px-6 py-2 font-bold text-[#E8F0FB] hover:bg-[#23314A] transition-colors"
            >
               Try Again
            </button>
          </div>
        ) : status === 'confirm' ? (
          <div className="p-6">
            <h3 className="mb-4 text-xl font-bold text-[#E8F0FB]">
              Confirm {transactionType === 'buy' ? 'Purchase' : 'Sale'}
            </h3>
            <div className="mb-8 rounded-xl border border-[#1C2940] bg-[#0F1726] p-5 text-[#8FA2BC] shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                <div className="mb-3 flex flex-row justify-between items-center pb-3 border-b border-[#1C2940]">
                  <span>Action</span>
                  <span className={`font-bold uppercase tracking-[0.1em] text-sm ${transactionType === 'buy' ? 'text-[#1F9A6A]' : 'text-[#C84F5A]'}`}>
                    {transactionType === 'buy' ? 'Buy' : 'Sell'}
                  </span>
                </div>
                <div className="mb-3 flex flex-row justify-between items-center">
                  <span>Stock</span>
                  <span className="font-bold text-[#F3F8FF]">{stock.symbol || stock.ticker}</span>
                </div>
                <div className="mb-3 flex flex-row justify-between items-center">
                  <span>Shares</span>
                  <span className="font-bold text-[#F3F8FF]">{quantity}</span>
                </div>
                <div className="mb-3 flex flex-row justify-between items-center">
                  <span>Price at Market</span>
                  <span className="font-bold text-[#F3F8FF]">${price.toFixed(2)}</span>
                </div>
                <div className="mb-3 flex flex-row justify-between items-center">
                    <span>Current Balance</span>
                    <span className="font-bold text-[#F3F8FF]">
                      {balanceLoading ? '...' : currentBalance !== null ? `$${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                    </span>
                </div>
                <div className="mb-3 flex flex-row justify-between items-center">
                    <span>Post-Trade Balance</span>
                    <span className={`font-bold ${transactionType === 'buy' ? 'text-[#C84F5A]' : 'text-[#1F9A6A]'}`}>
                      {balanceLoading ? '...' : postTradeBalance !== null ? `$${postTradeBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                    </span>
                </div>
                <div className="mt-4 border-t border-[#1C2940] pt-4 flex flex-row justify-between items-center gap-4">
                    <span className="font-semibold text-[#8FA2BC]">Estimated Total</span>
                    <span className="text-2xl font-bold text-[#F3F8FF]">${totalValue}</span>
                </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStatus('idle')}
                disabled={loading}
                className="flex flex-1 items-center justify-center rounded-xl border border-[#1C2940] bg-transparent py-3 text-lg font-bold text-[#8FA2BC] transition-colors hover:bg-[#1C2940] hover:text-[#E8F0FB] disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleTransaction}
                disabled={loading}
                className={`flex flex-1 items-center justify-center rounded-xl py-3 text-lg font-bold text-[#F3F8FF] transition-colors disabled:opacity-50 ${transactionType === 'buy' ? 'bg-[#1F9A6A] hover:bg-[#28B77F] shadow-[0_0_20px_rgba(31,154,106,0.3)]' : 'bg-[#C84F5A] hover:bg-[#E1626E] shadow-[0_0_20px_rgba(200,79,90,0.3)]'}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#F3F8FF] border-t-transparent"></span>
                    Processing
                  </span>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="mb-1 text-sm text-[#6F86A6]">Current Price</p>
                <p className="text-3xl font-bold text-[#F3F8FF]">${price.toFixed(2)}</p>
              </div>
              <div
                className={`flex items-center rounded px-2 py-1 text-sm font-semibold ${
                  isPositive
                    ? 'bg-[rgba(47,203,137,0.12)] text-success'
                    : 'bg-[rgba(255,107,107,0.12)] text-danger'
                }`}
              >
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[#8FA2BC]" htmlFor="quantity">
                Shares Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                step="1"
                className="w-full rounded-xl border border-[#23314A] bg-[#0F1726] p-3 text-lg text-[#E8F0FB] outline-none focus:border-[#5FA8FF] focus:ring-2 focus:ring-[rgba(95,168,255,0.25)]"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || ''))}
              />
            </div>

            <div className="mb-6 flex items-center justify-between rounded-xl border border-[#1C2940] bg-[#0F1726] p-4">
              <span className="font-semibold text-[#8FA2BC]">Estimated Total</span>
              <span className="text-xl font-bold text-[#F3F8FF]">${totalValue}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleInitiateTransaction('buy')}
                disabled={loading || !quantity}
                className="flex flex-1 items-center justify-center rounded-xl bg-[#1F9A6A] py-3 text-lg font-bold text-[#F3F8FF] hover:bg-[#28B77F] disabled:opacity-50"
              >
                Buy
              </button>
              <button
                onClick={() => handleInitiateTransaction('sell')}
                disabled={loading || !quantity}
                className="flex flex-1 items-center justify-center rounded-xl bg-[#C84F5A] py-3 text-lg font-bold text-[#F3F8FF] hover:bg-[#E1626E] disabled:opacity-50"
              >
                Sell
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
