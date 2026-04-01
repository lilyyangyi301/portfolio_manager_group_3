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
    <div className="dashboard-shell">
      <div className="dashboard-sidebar">
        <div className="dashboard-nav-card">
          <div className="lg:col-span-1">
            <FeatureMenu activeFeature={activeFeature} onSelectFeature={setActiveFeature} />
          </div>
        </div>
      </div>

      <div className="dashboard-stage">
        <div className="dashboard-panel-frame">
          <div className="lg:col-span-2">
            <ActivePanel />
          </div>
        </div>
      </div>
    </div>
  );
};
