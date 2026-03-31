import React, { useState } from 'react';
import { FeatureMenu } from './FeatureMenu';
import { PortfolioOverviewPanel } from './PortfolioOverviewPanel';
import { PerformancePanel } from './PerformancePanel';
import { PotentialPanel } from './PotentialPanel';
import { DiversificationPanel } from './DiversificationPanel';
import { RiskPanel } from './RiskPanel';
const PANELS = [
  PortfolioOverviewPanel,
  PerformancePanel,
  PotentialPanel,
  DiversificationPanel,
  RiskPanel,
];

export const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(1);

  const ActivePanel = PANELS[activeFeature - 1];

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="card p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Menu */}
          <div className="lg:col-span-1">
            <FeatureMenu activeFeature={activeFeature} onSelectFeature={setActiveFeature} />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2">
            <ActivePanel />
          </div>
        </div>
      </div>
    </div>
  );
};
