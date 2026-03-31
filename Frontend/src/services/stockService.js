import { mockData } from '../data/mockData';

// Mock data for initial watchlist testing
const mockStocks = {
  AAPL: { ticker: 'AAPL', name: 'Apple Inc.', price: 173.50, change: 1.25, changePercent: 0.72 },
  MSFT: { ticker: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: -2.10, changePercent: -0.62 },
  GOOGL: { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 138.40, change: 0.85, changePercent: 0.62 },
  AMZN: { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 143.20, change: 1.50, changePercent: 1.06 },
  TSLA: { ticker: 'TSLA', name: 'Tesla Inc.', price: 235.45, change: -5.30, changePercent: -2.20 }
};

/**
 * Returns a static list of default stocks so we can test the Watchlist display (Feature A)
 */
export const getInitialWatchlist = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Object.values(mockStocks).slice(0, 3)); // Return 3 mocked stocks initially
    }, 400); // Simulate network latency
  });
};

/**
 * Subscribes to simulated price updates.
 * Calls the callback every 3 seconds with updated prices for the requested tickers.
 */
export const subscribeToPriceUpdates = (tickers, callback) => {
  const intervalId = setInterval(() => {
    const updates = tickers.map(ticker => {
      const stock = mockStocks[ticker];
      if (!stock) return null;
      
      // Simulate price fluctuation (-1% to +1%)
      const fluctuation = 1 + (Math.random() * 0.02 - 0.01);
      const newPrice = stock.price * fluctuation;
      const changeDiff = newPrice - stock.price;
      
      return {
        ...stock,
        price: newPrice,
        change: stock.change + changeDiff,
        changePercent: ((stock.change + changeDiff) / (newPrice - stock.change - changeDiff)) * 100
      };
    }).filter(Boolean);

    callback(updates);
  }, 3000);

  // Return an unsubscribe function
  return () => clearInterval(intervalId);
};

/**
 * Searches for a ticker symbol or company name (Feature C)
 */
export const searchTicker = async (query) => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!query || query.trim() === '') {
        resolve([]);
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      const results = Object.values(mockStocks).filter(
        stock => stock.ticker.toLowerCase().includes(lowerQuery) || 
                 stock.name.toLowerCase().includes(lowerQuery)
      );
      
      resolve(results);
    }, 300); // Simulate network latency
  });
};

/**
 * Gets the current price details for a specific ticker
 */
export const getStockPrice = async (ticker) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let stock = mockStocks[ticker];
      if (!stock) {
        // Fallback to mockData
        const fallback = mockData.stocks.find(s => s.symbol === ticker);
        if (fallback) {
          stock = {
            ticker: fallback.symbol,
            name: fallback.companyName,
            price: fallback.currentPrice,
            change: fallback.priceChange,
            changePercent: fallback.priceChangePercent,
          };
          // Also dynamically add it to mockStocks for future queries
          mockStocks[ticker] = stock;
        }
      }
      resolve(stock || null);
    }, 200);
  });
};

/**
 * Generates mock OHLC data for the charts
 */
export const getOHLCData = async (ticker) => {
  return new Promise(resolve => {
    // Generate 100 days of mock candle data ending today
    setTimeout(() => {
      const stock = mockStocks[ticker] || { price: 150 }; // Fallback to 150 if not found
      
      const data = [];
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      let currentPrice = stock.price * 0.8; // Random start roughly 20% lower
      const volatility = 0.02; // 2% daily volatility

      // Generate 100 days of data, going backwards
      for (let i = 100; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const open = currentPrice;
        const change = currentPrice * (Math.random() * volatility * 2 - volatility);
        const close = open + change;
        const high = Math.max(open, close) + (Math.random() * currentPrice * volatility);
        const low = Math.min(open, close) - (Math.random() * currentPrice * volatility);

        data.push({
          time: date.toISOString().split('T')[0],
          open,
          high,
          low,
          close,
        });

        currentPrice = close;
      }

      // Force the last candle to match the actual current price
      if (data.length > 0 && mockStocks[ticker]) {
        const last = data[data.length - 1];
        last.close = mockStocks[ticker].price;
        // Adjust high/low if necessary
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
      }

      resolve(data);
    }, 400); // Simulate network latency
  });
};
