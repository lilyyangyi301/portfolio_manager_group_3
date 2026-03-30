import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export const CarouselControls = ({ currentIndex, totalItems, onPrevious, onNext, isPlaying, onTogglePlay }) => {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          className="btn btn-secondary p-2 hover:bg-gray-200 transition-colors"
          aria-label="Previous"
          title="Previous view"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          className="btn btn-secondary p-2 hover:bg-gray-200 transition-colors"
          aria-label="Next"
          title="Next view"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <button
        onClick={onTogglePlay}
        className={`btn p-2 transition-all ${
          isPlaying
            ? 'bg-accent text-white hover:bg-blue-600'
            : 'btn-secondary hover:bg-gray-200'
        }`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause auto-rotation' : 'Start auto-rotation'}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <div className="text-sm font-medium text-secondary">
        {currentIndex + 1} / {totalItems}
      </div>
    </div>
  );
};
