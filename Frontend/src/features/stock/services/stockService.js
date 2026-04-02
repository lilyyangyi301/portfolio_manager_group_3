import api from '../../../api/axios';
import { mockData } from '../../../data/mockData';

const STOCKS_ENDPOINT = '/api/v1/dashboard/StockFinder/AllStocks';
const STOCK_SEARCH_ENDPOINT = '/api/v1/dashboard/StockFinder/SearchForTickerOrCompanyname';
const WATCHLIST_ENDPOINT = '/api/v1/dashboard/Watchlist';
const WATCHLIST_ALL_ENDPOINT = '/api/v1/dashboard/Watchlist/AllStocks';
const TRADE_ENDPOINT = '/api/v1/dashboard/Trade';

const parseAbbreviatedNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;

  const trimmed = value.trim().toUpperCase();
  const match = trimmed.match(/^([\d.]+)\s*([TMBK])?$/);

  if (!match) {
    const parsed = Number(trimmed.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const base = Number(match[1]);
  const multiplierMap = {
    T: 1_000_000_000_000,
    B: 1_000_000_000,
    M: 1_000_000,
    K: 1_000,
  };

  return base * (multiplierMap[match[2]] || 1);
};

const normalizeStock = (stock = {}) => {
  const symbol = (stock.symbol || stock.ticker || '').toUpperCase();
  const currentPrice = Number(stock.currentPrice ?? stock.price ?? 0);
  const priceChange =
    Number(
      stock.priceChange ??
      stock.changeAmount ??
      stock.change ??
      0,
    );
  const priceChangePercent =
    Number(
      stock.priceChangePercent ??
      stock.changePct ??
      stock.changePercent ??
      0,
    );

  return {
    symbol,
    ticker: symbol,
    companyName: stock.companyName || stock.name || symbol,
    name: stock.companyName || stock.name || symbol,
    currentPrice,
    price: currentPrice,
    priceChange,
    change: priceChange,
    priceChangePercent,
    changePercent: priceChangePercent,
    sector: stock.sector || 'Unknown',
    industry: stock.industry || 'Unknown',
    exchange: stock.exchange || 'N/A',
    marketCap: parseAbbreviatedNumber(stock.marketCap),
    peRatio: Number(stock.peRatio ?? 0),
    dividendYield: Number(stock.dividendYield ?? 0),
    weekHigh52: Number(stock.weekHigh52 ?? stock.week52High ?? 0),
    weekLow52: Number(stock.weekLow52 ?? stock.week52Low ?? 0),
    volume: parseAbbreviatedNumber(stock.volume ?? stock.avgVolume),
    description: stock.description || `${stock.companyName || stock.name || symbol} stock overview.`,
  };
};

const normalizeMockStock = (stock) => normalizeStock(stock);

const getMockStocks = () => mockData.stocks.map(normalizeMockStock);

export const getAllStocks = async () => {
  try {
    const data = await api.get(STOCKS_ENDPOINT);
    return Array.isArray(data) ? data.map(normalizeStock) : [];
  } catch (error) {
    return getMockStocks();
  }
};

export const getInitialWatchlist = async () => {
  try {
    const data = await api.get(WATCHLIST_ALL_ENDPOINT);
    return Array.isArray(data) ? data.map(normalizeStock) : [];
  } catch (error) {
    return getMockStocks().slice(0, 3);
  }
};

export const addToWatchlist = async (symbol) => {
  await api.post(`${WATCHLIST_ENDPOINT}/${symbol}`);
  return true;
};

export const removeFromWatchlist = async (symbol) => {
  await api.delete(`${WATCHLIST_ENDPOINT}/${symbol}`);
  return true;
};

export const executeTrade = async (tradeData) => {
  return await api.post(TRADE_ENDPOINT, tradeData);
};

export const subscribeToPriceUpdates = (tickers, callback) => {
  const intervalId = setInterval(async () => {
    try {
      const allStocks = await getAllStocks();
      const updates = allStocks.filter((stock) => tickers.includes(stock.symbol));
      callback(updates);
    } catch (error) {
      const fallbackUpdates = getMockStocks().filter((stock) => tickers.includes(stock.symbol));
      callback(fallbackUpdates);
    }
  }, 5000);

  return () => clearInterval(intervalId);
};

export const searchTicker = async (query) => {
  if (!query || query.trim() === '') {
    return getAllStocks();
  }

  try {
    const data = await api.get(STOCK_SEARCH_ENDPOINT, {
      params: {
        q: query,
        keyword: query,
      },
    });
    return Array.isArray(data) ? data.map(normalizeStock) : [];
  } catch (error) {
    const allStocks = await getAllStocks();
    const lowerQuery = query.toLowerCase();
    return allStocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(lowerQuery) ||
        stock.companyName.toLowerCase().includes(lowerQuery),
    );
  }
};

export const getStockPrice = async (ticker) => {
  const allStocks = await getAllStocks();
  const matched = allStocks.find((stock) => stock.symbol === ticker?.toUpperCase());
  return matched || null;
};

export const getOHLCData = async (ticker) => {
  try {
    return await api.get(`/stocks/${ticker}/ohlc`);
  } catch (error) {
    const stock = (await getStockPrice(ticker)) || { price: 150 };
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

    if (data.length > 0) {
      const last = data[data.length - 1];
      last.close = stock.price;
      last.high = Math.max(last.high, last.close);
      last.low = Math.min(last.low, last.close);
    }

    return data;
  }
};
