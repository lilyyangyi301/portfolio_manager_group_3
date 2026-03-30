import React from 'react';
import { FeatureShowcase } from './components/FeatureShowcase';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-neutral flex flex-col">
      <main className="flex-1 flex items-center justify-center py-8">
        <FeatureShowcase />
      </main>
    </div>
  );
}

export default App;
