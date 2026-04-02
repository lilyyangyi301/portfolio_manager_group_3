import React from 'react';
import { mockData } from '../../../data/mockData';
import { LayoutDashboard, TrendingUp, Activity, PieChart, ShieldCheck, Layers } from 'lucide-react';

const getIconForTitle = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('main')) return <LayoutDashboard size={18} strokeWidth={1.85} />;
  if (lowerTitle.includes('investment')) return <TrendingUp size={18} strokeWidth={1.85} />;
  if (lowerTitle.includes('holdings')) return <Activity size={18} strokeWidth={1.85} />;
  if (lowerTitle.includes('distribution')) return <PieChart size={18} strokeWidth={1.85} />;
  if (lowerTitle.includes('risk')) return <ShieldCheck size={18} strokeWidth={1.85} />;
  return <Layers size={18} strokeWidth={1.85} />;
};

export const FeatureMenu = ({ activeFeature, onSelectFeature }) => {
  return (
    <div className="space-y-2">
      <h3 className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6F86A6]">
        Dashboard Views
      </h3>
      {mockData.features.map((feature) => {
        const isActive = activeFeature === feature.id;

        return (
          <button
            key={feature.id}
            onClick={() => onSelectFeature(feature.id)}
            className={`group w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 outline-none ${
              isActive
                ? 'border-[#22314A] bg-[#101927] text-[#E8F0FB] shadow-[0_18px_34px_rgba(0,0,0,0.22)]'
                : 'border-transparent bg-transparent text-[#8FA2BC] hover:border-[#182336] hover:bg-[#0F1726] hover:text-[#E8F0FB]'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${
                isActive ? 'bg-[#162338] text-[#5FA8FF]' : 'bg-[#0F1726] text-[#6F86A6] group-hover:bg-[#162338] group-hover:text-[#8FC2FF]'
              }`}
            >
              {getIconForTitle(feature.title)}
            </div>

            <span
              className={`font-medium tracking-wide text-sm transition-all duration-300 ${
                isActive ? 'font-semibold' : ''
              }`}
            >
              {feature.title}
            </span>

            {isActive && (
              <div className="ml-auto h-8 w-1 rounded-full bg-[#5FA8FF]"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};
