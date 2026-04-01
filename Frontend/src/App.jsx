import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FeatureShowcase } from './features/portfolio/components/FeatureShowcase';
import { StockFinderPanel } from './features/stock/components/StockFinderPanel';
import { FullScreenChart } from './features/stock/pages/FullScreenChart';
import './index.css';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-app-shell flex flex-col animate-fadeIn">
      <header className="sticky top-0 z-20 border-b border-[#1A2538] bg-[rgba(8,13,23,0.94)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-primary">
            <span className="material-symbols-outlined mr-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#22314A] bg-[#0F1726] text-[#5FA8FF] shadow-[0_12px_30px_rgba(0,0,0,0.28)]" style={{ fontSize: '20px' }}>
              finance_mode
            </span>
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-[#E8F0FB]">InvestPro</h1>
          </div>
          <nav className="app-tabs">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`app-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('stock-finder')}
              className={`app-tab ${activeTab === 'stock-finder' ? 'active' : ''}`}
            >
              Stock Finder
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {activeTab === 'dashboard' ? (
          <div className="mx-auto w-full max-w-[1440px]">
            <FeatureShowcase />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[1440px]">
            <StockFinderPanel />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
