import api from '../../../api/axios';
import { mockData } from '../../../data/mockData';

// Mock data for initial watchlist testing
const mockStocks = {
  AAPL: { ticker: 'AAPL', name: 'Apple Inc.', price: 173.5, change: 1.25, changePercent: 0.72 },
  MSFT: { ticker: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: -2.1, changePercent: -0.62 },
  GOOGL: { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 138.4, change: 0.85, changePercent: 0.62 },
  AMZN: { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 143.2, change: 1.5, changePercent: 1.06 },
  TSLA: { ticker: 'TSLA', name: 'Tesla Inc.', price: 235.45, change: -5.3, changePercent: -2.2 },
};

export const getInitialWatchlist = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.values(mockStocks).slice(0, 3));
    }, 400);
  });

export const subscribeToPriceUpdates = (tickers, callback) => {
  const intervalId = setInterval(() => {
    const updates = tickers
      .map((ticker) => {
        const stock = mockStocks[ticker];
        if (!stock) return null;

        const fluctuation = 1 + (Math.random() * 0.02 - 0.01);
        const newPrice = stock.price * fluctuation;
        const changeDiff = newPrice - stock.price;

        return {
          ...stock,
          price: newPrice,
          change: stock.change + changeDiff,
          changePercent: ((stock.change + changeDiff) / (newPrice - stock.change - changeDiff)) * 100,
        };
      })
      .filter(Boolean);

    callback(updates);
  }, 3000);

  return () => clearInterval(intervalId);
};

export const searchTicker = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    return await api.get('/stocks/search', {
      params: { q: query },
    });
  } catch (error) {
    const lowerQuery = query.toLowerCase();
    return Object.values(mockStocks).filter(
      (stock) =>
        stock.ticker.toLowerCase().includes(lowerQuery) ||
        stock.name.toLowerCase().includes(lowerQuery),
    );
  }
};

export const getStockPrice = async (ticker) => {
  try {
    return await api.get(`/stocks/${ticker}`);
  } catch (error) {
    let stock = mockStocks[ticker];

    if (!stock) {
      const fallback = mockData.stocks.find((item) => item.symbol === ticker);
      if (fallback) {
        stock = {
          ticker: fallback.symbol,
          name: fallback.companyName,
          price: fallback.currentPrice,
          change: fallback.priceChange,
          changePercent: fallback.priceChangePercent,
        };
        mockStocks[ticker] = stock;
      }
    }

    return stock || null;
  }
};

export const getOHLCData = async (ticker) => {
  try {
    return await api.get(`/stocks/${ticker}/ohlc`);
  } catch (error) {
    const stock = mockStocks[ticker] || { price: 150 };
    const data = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let currentPrice = stock.price * 0.8;
    const volatility = 0.02;

    for (let i = 100; i >= 0; i -= 1) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const open = currentPrice;
      const change = currentPrice * (Math.random() * volatility * 2 - volatility);
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * currentPrice * volatility;
      const low = Math.min(open, close) - Math.random() * currentPrice * volatility;

      data.push({
        time: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
      });

      currentPrice = close;
    }

    if (data.length > 0 && mockStocks[ticker]) {
      const last = data[data.length - 1];
      last.close = mockStocks[ticker].price;
      last.high = Math.max(last.high, last.close);
      last.low = Math.min(last.low, last.close);
    }

    return data;
  }
};
