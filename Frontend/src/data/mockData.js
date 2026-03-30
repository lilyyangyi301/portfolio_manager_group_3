export const mockData = {
  portfolio: {
    name: 'My main portfolio',
    value: 125430.50,
    unrealizedGain: 12540.75,
    realizedGain: 5230.25,
    totalGain: 17771.00,
    percentageGain: 16.4,
  },

  portfolioHistory: [
    { date: 'Jan 1', value: 100000, performance: 0 },
    { date: 'Jan 8', value: 102500, performance: 2.5 },
    { date: 'Jan 15', value: 101800, performance: 1.8 },
    { date: 'Jan 22', value: 105200, performance: 5.2 },
    { date: 'Jan 29', value: 108900, performance: 8.9 },
    { date: 'Feb 5', value: 107300, performance: 7.3 },
    { date: 'Feb 12', value: 110600, performance: 10.6 },
    { date: 'Feb 19', value: 115400, performance: 15.4 },
    { date: 'Feb 26', value: 118200, performance: 18.2 },
    { date: 'Mar 5', value: 120800, performance: 20.8 },
    { date: 'Mar 12', value: 122500, performance: 22.5 },
    { date: 'Mar 19', value: 125430, performance: 25.43 },
  ],

  performanceByPeriod: [
    { period: '1 month', return: 8.2, positive: true },
    { period: '3 month', return: 15.4, positive: true },
    { period: '6 month', return: 22.8, positive: true },
    { period: 'YTD', return: 25.43, positive: true },
    { period: '1 year', return: 32.1, positive: true },
    { period: 'All time', return: 45.6, positive: true },
  ],

  holdings: [
    { symbol: 'NVDA', name: 'NVIDIA', value: 28500, change: 45.2, positive: true },
    { symbol: 'MSFT', name: 'Microsoft', value: 22300, change: 28.5, positive: true },
    { symbol: 'NFLX', name: 'Netflix', value: 18900, change: 12.3, positive: true },
    { symbol: 'AAPL', name: 'Apple', value: 16200, change: 8.7, positive: true },
    { symbol: 'BTCUSD', name: 'Bitcoin', value: 15800, change: 35.2, positive: true },
    { symbol: 'TSLA', name: 'Tesla', value: 12400, change: -5.2, positive: false },
    { symbol: 'KO', name: 'Coca-Cola', value: 8200, change: 3.1, positive: true },
    { symbol: 'NKE', name: 'Nike', value: 3100, change: -2.8, positive: false },
  ],

  diversification: {
    byAssets: [
      { name: 'Stocks', value: 85000, percentage: 67.7 },
      { name: 'Crypto', value: 15800, percentage: 12.6 },
      { name: 'ETFs', value: 18200, percentage: 14.5 },
      { name: 'Bonds', value: 6430, percentage: 5.1 },
    ],
    byAssetTypes: [
      { name: 'Tech', value: 67500, percentage: 53.8 },
      { name: 'Finance', value: 22300, percentage: 17.8 },
      { name: 'Consumer', value: 18900, percentage: 15.1 },
      { name: 'Other', value: 16730, percentage: 13.3 },
    ],
    bySectors: [
      { name: 'Technology', value: 67500, percentage: 53.8 },
      { name: 'Financial', value: 22300, percentage: 17.8 },
      { name: 'Consumer Discretionary', value: 18900, percentage: 15.1 },
      { name: 'Other', value: 16730, percentage: 13.3 },
    ],
    byCurrency: [
      { name: 'USD', value: 110230, percentage: 87.8 },
      { name: 'EUR', value: 10200, percentage: 8.1 },
      { name: 'GBP', value: 5000, percentage: 4.0 },
    ],
  },

  diversificationTable: [
    { type: 'Stocks', value: '$85,000', allocation: '67.7%', gain: '+$8,500' },
    { type: 'Crypto', value: '$15,800', allocation: '12.6%', gain: '+$5,230' },
    { type: 'ETFs', value: '$18,200', allocation: '14.5%', gain: '+$2,730' },
    { type: 'Bonds', value: '$6,430', allocation: '5.1%', gain: '+$1,311' },
  ],

  risks: {
    beta: { value: 1.24, benchmark: 1.0, description: 'More volatile than market' },
    sharpeRatio: { value: 1.85, benchmark: 1.0, description: 'Good risk-adjusted returns' },
    sortinoRatio: { value: 2.42, benchmark: 1.5, description: 'Excellent downside protection' },
  },

  navItems: [
    { label: 'Products', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Markets', href: '#' },
    { label: 'Brokers', href: '#' },
    { label: 'More', href: '#' },
  ],

  features: [
    {
      id: 1,
      title: 'Start in seconds',
      description: 'Build your investment portfolio instantly',
    },
    {
      id: 2,
      title: 'Control investment performance',
      description: 'Monitor and track your returns in real-time',
    },
    {
      id: 3,
      title: 'Measure potential',
      description: 'Analyze individual holdings and opportunities',
    },
    {
      id: 4,
      title: 'Manage diversification',
      description: 'Optimize your asset allocation strategy',
    },
    {
      id: 5,
      title: 'Assess risks and performance',
      description: 'Evaluate portfolio risk metrics and benchmarks',
    },
  ],
};
