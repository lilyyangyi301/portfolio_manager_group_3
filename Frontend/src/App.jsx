import React, { useState } from 'react';
import { FeatureShowcase } from './components/FeatureShowcase';
import { WatchlistPage } from './pages/WatchlistPage';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-neutral flex flex-col">
      {/* Simple Navigation Menu */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <h1 className="text-xl font-bold text-primary mr-4">InvestPro</h1>
          <nav className="flex gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('watchlist')}
              className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
            >
              Watchlist
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
          <WatchlistPage />
        )}
      </main>
    </div>
  );
}

export default App;
