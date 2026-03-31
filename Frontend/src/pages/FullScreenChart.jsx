import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { ArrowLeft, Moon, Sun, TrendingUp, TrendingDown } from 'lucide-react';
import { getStockPrice, getOHLCData } from '../services/stockService';

export const FullScreenChart = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const chartContainerRef = useRef(null);

  const [stock, setStock] = useState(null);
  const [ohlcData, setOhlcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  const isPositive = stock?.changePercent >= 0;

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      const [details, ohlc] = await Promise.all([
        getStockPrice(ticker),
        getOHLCData(ticker),
      ]);

      if (!isMounted) return;

      if (!details) {
        navigate('/'); // Redirect if invalid ticker
        return;
      }

      setStock(details);
      setOhlcData(ohlc);
      setLoading(false);
    };

    if (ticker) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [ticker, navigate]);

  // Render chart
  useEffect(() => {
    if (loading || !chartContainerRef.current || ohlcData.length === 0) return;

    // Clear previous chart instance if it exists
    chartContainerRef.current.innerHTML = '';

    const isDark = theme === 'dark';
    const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';
    const textColor = isDark ? '#D1D5DB' : '#374151';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: backgroundColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: isDark ? '#374151' : '#F3F4F6' },
        horzLines: { color: isDark ? '#374151' : '#F3F4F6' },
      },
      timeScale: {
        borderColor: isDark ? '#4B5563' : '#D1D5DB',
      },
      rightPriceScale: {
        borderColor: isDark ? '#4B5563' : '#D1D5DB',
      },
      autoSize: true, 
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981', 
      downColor: '#EF4444', 
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    // Make sure data is sorted by time ascending
    const sortedData = [...ohlcData].sort((a, b) => new Date(a.time) - new Date(b.time));
    candlestickSeries.setData(sortedData);

    chart.timeScale().fitContent();

    // Auto-resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Trigger initial resize

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [loading, ohlcData, theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
        <p className="text-secondary font-medium">Loading historical data for {ticker}...</p>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className={`w-full min-h-screen flex flex-col pt-6 pb-8 animate-fadeIn ${isDark ? 'bg-gray-900' : 'bg-neutral'}`}>
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-secondary hover:bg-white bg-white shadow-sm'}`}
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            
            <div className={`h-8 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

            <div className="flex items-baseline gap-3">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-primary'}`}>
                {stock.ticker}
              </h2>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-secondary'}`}>
                {stock.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-primary'}`}>
                ${stock.price.toFixed(2)}
              </span>
              <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isDark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-200 bg-white shadow-sm border border-gray-100'}`}
              title="Toggle Chart Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div 
          className={`flex-1 w-full rounded-2xl border overflow-hidden shadow-sm relative ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          style={{ minHeight: '600px' }}
        >
          <div ref={chartContainerRef} className="absolute inset-0"></div>
        </div>
      </div>
    </div>
  );
};
