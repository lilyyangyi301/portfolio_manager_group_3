import React from 'react';
import { mockData } from '../../../data/mockData';
import { LayoutDashboard, TrendingUp, Activity, PieChart, ShieldCheck, Layers } from 'lucide-react';

const getIconForTitle = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('main')) return <LayoutDashboard size={20} />;
  if (lowerTitle.includes('investment')) return <TrendingUp size={20} />;
  if (lowerTitle.includes('holdings')) return <Activity size={20} />;
  if (lowerTitle.includes('distribution')) return <PieChart size={20} />;
  if (lowerTitle.includes('risk')) return <ShieldCheck size={20} />;
  return <Layers size={20} />;
};

export const FeatureMenu = ({ activeFeature, onSelectFeature }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-4">
        Dashboard Views
      </h3>
      {mockData.features.map((feature) => {
        const isActive = activeFeature === feature.id;

        return (
          <button
            key={feature.id}
            onClick={() => onSelectFeature(feature.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 outline-none group ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/80'
            }`}
          >
            {/* Dynamic Icon */}
            <div
              className={`transition-colors duration-300 flex items-center justify-center ${
                isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
              }`}
            >
              {getIconForTitle(feature.title)}
            </div>

            {/* Title */}
            <span
              className={`font-medium tracking-wide text-sm transition-all duration-300 ${
                isActive ? 'font-semibold' : ''
              }`}
            >
              {feature.title}
            </span>

            {/* Subtle Active Indicator */}
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};
