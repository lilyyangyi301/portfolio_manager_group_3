import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FeatureShowcase } from './features/portfolio/components/FeatureShowcase';
import { StockFinderPanel } from './features/stock/components/StockFinderPanel';
import { FullScreenChart } from './features/stock/pages/FullScreenChart';
import { WatchlistPage } from './features/watchlist/pages/WatchlistPage';
import './index.css';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-neutral flex flex-col animate-fadeIn">
      {/* Navigation Menu */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-10 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center text-primary">
            <span className="material-symbols-outlined mr-2" style={{ fontSize: '24px', color: '#1f1f1f' }}>
              finance_mode
            </span>
            <h1 className="text-xl font-bold">InvestPro</h1>
          </div>
          <nav className="flex gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('stock-finder')}
              className={`tab-button ${activeTab === 'stock-finder' ? 'active' : ''}`}
            >
              Stock Finder
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex py-8">
        {activeTab === 'dashboard' ? (
          <div className="w-full flex items-center justify-center">
            <FeatureShowcase />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
              <StockFinderPanel />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/chart/:ticker" element={<FullScreenChart />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
