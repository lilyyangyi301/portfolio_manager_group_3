import React, { useState, useEffect } from 'react';
import { FeatureMenu } from './FeatureMenu';
import { CarouselControls } from './CarouselControls';
import { PortfolioOverviewPanel } from './PortfolioOverviewPanel';
import { PerformancePanel } from './PerformancePanel';
import { PotentialPanel } from './PotentialPanel';
import { DiversificationPanel } from './DiversificationPanel';
import { RiskPanel } from './RiskPanel';
import { mockData } from '../data/mockData';

const PANELS = [
  PortfolioOverviewPanel,
  PerformancePanel,
  PotentialPanel,
  DiversificationPanel,
  RiskPanel,
];

export const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const ActivePanel = PANELS[activeFeature - 1];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev === mockData.features.length ? 1 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePrevious = () => {
    setActiveFeature((prev) => (prev === 1 ? mockData.features.length : prev - 1));
  };

  const handleNext = () => {
    setActiveFeature((prev) => (prev === mockData.features.length ? 1 : prev + 1));
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

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

        {/* Carousel Controls */}
        <CarouselControls
          currentIndex={activeFeature - 1}
          totalItems={mockData.features.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
        />
      </div>
    </div>
  );
};
