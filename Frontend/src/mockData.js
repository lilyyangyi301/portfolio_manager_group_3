export const mockData = {
  navMenu: [
    { id: 1, label: 'Products', href: '#' },
    { id: 2, label: 'Community', href: '#' },
    { id: 3, label: 'Markets', href: '#' },
    { id: 4, label: 'Brokers', href: '#' },
    { id: 5, label: 'More', href: '#' },
  ],

  actionCards: [
    {
      id: 1,
      title: 'Upload CSV File',
      description: 'Quickly transfer all transactions from a file',
      icon: 'upload',
    },
    {
      id: 2,
      title: 'Create Manually',
      description: 'Add only the transactions you want by hand',
      icon: 'plus',
    },
    {
      id: 3,
      title: 'Add from Watchlist',
      description: 'Choose from saved watchlists and customize transactions',
      icon: 'star',
    },
  ],

  featureShowcase: [
    {
      id: 1,
      title: 'Main Portfolio',
    },
    {
      id: 2,
      title: 'Investment Performance',
    },
    {
      id: 3,
      title: 'Holdings Performance',
    },
    {
      id: 4,
      title: 'Portfolio Distribution',
    },
    {
      id: 5,
      title: 'Risk Assessment',
    },
  ],

  portfolioOverview: {
    totalValue: 125430.50,
    unrealizedGain: 12540.75,
    realizedGain: 3200.25,
    totalGain: 15740.99,
    gainPercentage: 14.35,
    chartData: [
      { date: 'Jan 1', value: 110000 },
      { date: 'Jan 8', value: 112500 },
      { date: 'Jan 15', value: 111200 },
      { date: 'Jan 22', value: 115800 },
      { date: 'Jan 29', value: 118900 },
      { date: 'Feb 5', value: 120300 },
      { date: 'Feb 12', value: 122100 },
      { date: 'Feb 19', value: 125430 },
    ],
  },

  performanceData: {
    chartData: [
      { date: 'Jan', value: 110000 },
      { date: 'Feb', value: 112500 },
      { date: 'Mar', value: 111200 },
      { date: 'Apr', value: 115800 },
      { date: 'May', value: 118900 },
      { date: 'Jun', value: 120300 },
      { date: 'Jul', value: 122100 },
      { date: 'Aug', value: 125430 },
    ],
    timeRanges: [
      { label: '1 Month', value: 2.5, positive: true },
      { label: '3 Month', value: 5.8, positive: true },
      { label: '6 Month', value: 8.2, positive: true },
      { label: 'YTD', value: 14.35, positive: true },
      { label: '1 Year', value: 18.9, positive: true },
      { label: 'All Time', value: 24.5, positive: true },
    ],
  },

  holdingsPerformance: {
    all: [
      { symbol: 'NVDA', name: 'NVIDIA', value: 28500, change: 45.2, positive: true },
      { symbol: 'MSFT', name: 'Microsoft', value: 22300, change: 18.5, positive: true },
      { symbol: 'NFLX', name: 'Netflix', value: 18900, change: 12.3, positive: true },
      { symbol: 'AAPL', name: 'Apple', value: 16200, change: 8.7, positive: true },
      { symbol: 'BTCUSD', name: 'Bitcoin', value: 24500, change: 35.6, positive: true },
      { symbol: 'TSLA', name: 'Tesla', value: 15030, change: -5.2, positive: false },
    ],
    gainers: [
      { symbol: 'NVDA', name: 'NVIDIA', value: 28500, change: 45.2, positive: true },
      { symbol: 'BTCUSD', name: 'Bitcoin', value: 24500, change: 35.6, positive: true },
      { symbol: 'MSFT', name: 'Microsoft', value: 22300, change: 18.5, positive: true },
    ],
    losers: [
      { symbol: 'TSLA', name: 'Tesla', value: 15030, change: -5.2, positive: false },
    ],
  },

  diversification: {
    byAssetType: [
      { name: 'Stocks', value: 65, color: '#3b82f6' },
      { name: 'Crypto', value: 20, color: '#f59e0b' },
      { name: 'Bonds', value: 10, color: '#10b981' },
      { name: 'Cash', value: 5, color: '#6b7280' },
    ],
    byAssets: [
      { name: 'US Equities', value: 45, color: '#3b82f6' },
      { name: 'International', value: 20, color: '#8b5cf6' },
      { name: 'Crypto', value: 20, color: '#f59e0b' },
      { name: 'Bonds', value: 10, color: '#10b981' },
      { name: 'Cash', value: 5, color: '#6b7280' },
    ],
    bySectors: [
      { name: 'Technology', value: 40, color: '#3b82f6' },
      { name: 'Finance', value: 20, color: '#8b5cf6' },
      { name: 'Healthcare', value: 15, color: '#ec4899' },
      { name: 'Energy', value: 15, color: '#f59e0b' },
      { name: 'Other', value: 10, color: '#6b7280' },
    ],
    byCurrency: [
      { name: 'USD', value: 85, color: '#3b82f6' },
      { name: 'EUR', value: 10, color: '#8b5cf6' },
      { name: 'GBP', value: 5, color: '#10b981' },
    ],
    holdings: [
      { type: 'Stocks', value: 81529.45, allocation: 65, gain: 12540.75 },
      { type: 'Crypto', value: 25086.10, allocation: 20, gain: 2508.61 },
      { type: 'Bonds', value: 12543.05, allocation: 10, gain: 627.15 },
      { type: 'Cash', value: 6271.90, allocation: 5, gain: 0 },
    ],
  },

  riskMetrics: {
    beta: {
      value: 1.24,
      benchmark: 1.0,
      label: 'Beta',
      description: 'Portfolio volatility vs market',
    },
    sharpeRatio: {
      value: 1.85,
      benchmark: 1.0,
      label: 'Sharpe Ratio',
      description: 'Risk-adjusted return',
    },
    sortinoRatio: {
      value: 2.42,
      benchmark: 1.5,
      label: 'Sortino Ratio',
      description: 'Downside risk-adjusted return',
    },
  },
};
