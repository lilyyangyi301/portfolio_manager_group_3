import React from 'react';
import { mockData } from '../data/mockData';

export const FeatureMenu = ({ activeFeature, onSelectFeature }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-4">Dashboard Views</h3>
      {mockData.features.map((feature) => (
        <button
          key={feature.id}
          onClick={() => onSelectFeature(feature.id)}
          className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
            activeFeature === feature.id
              ? 'bg-accent text-white shadow-lg scale-105'
              : 'bg-white text-primary hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <h4
            className={`font-bold transition-all ${
              activeFeature === feature.id ? 'text-lg' : 'text-base'
            }`}
          >
            {feature.title}
          </h4>
          <p
            className={`text-sm mt-1 transition-colors ${
              activeFeature === feature.id ? 'text-blue-100' : 'text-secondary'
            }`}
          >
            {feature.description}
          </p>
        </button>
      ))}
    </div>
  );
};
