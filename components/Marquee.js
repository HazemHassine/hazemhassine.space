import React from 'react';

export default function Marquee({ items = ["OPEN TO WORK", "AVAILABLE FOR FREELANCE", "CREATIVE DEVELOPER"] }) {
  // We don't need to duplicate too many times if the items array is already populated, but for safety:
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden border-y border-border-primary bg-surface py-3 flex group">
      {/* First block */}
      <div className="flex shrink-0 animate-[marquee_20s_linear_infinite] group-hover:[animation-play-state:paused]">
        {repeatedItems.map((item, index) => (
          <div key={`first-${index}`} className="flex items-center px-4">
            <span className="font-[family-name:var(--font-mono)] text-primary font-bold uppercase whitespace-nowrap text-sm md:text-base">
              {item}
            </span>
            <span className="ml-8 text-primary-fixed text-lg">•</span>
          </div>
        ))}
      </div>
      {/* Second block (identical) */}
      <div aria-hidden="true" className="flex shrink-0 animate-[marquee_20s_linear_infinite] group-hover:[animation-play-state:paused]">
        {repeatedItems.map((item, index) => (
          <div key={`second-${index}`} className="flex items-center px-4">
            <span className="font-[family-name:var(--font-mono)] text-primary font-bold uppercase whitespace-nowrap text-sm md:text-base">
              {item}
            </span>
            <span className="ml-8 text-primary-fixed text-lg">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
