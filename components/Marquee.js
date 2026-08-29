"use client";

import React, { useRef, useEffect } from 'react';

export default function Marquee({ items = ["BUILDING AGENTIC WORKFLOWS", "RAG SYSTEMS", "DEVELOPER TOOLING", "HUMAN-IN-THE-LOOP AI", "SHIPPING TOO MANY SIDE PROJECTS"] }) {
  // We don't need to duplicate too many times if the items array is already populated, but for safety:
  const repeatedItems = [...items, ...items, ...items, ...items];
  
  const BASE_SPEED = 0.0075; // Slower, calmer marquee drift speed
  const containerRef = useRef(null);
  const percentRef = useRef(0);
  const velocityRef = useRef(BASE_SPEED);
  const targetVelocityRef = useRef(BASE_SPEED);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let animationFrameId;

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Smoothly interpolate current velocity towards target velocity
      // We use a small smoothing factor. deltaTime adjustment ensures consistency across refresh rates.
      const smoothing = 0.05 * (deltaTime / 16.66);
      velocityRef.current += (targetVelocityRef.current - velocityRef.current) * Math.min(smoothing, 1);
      
      percentRef.current -= velocityRef.current * (deltaTime / 16.66);
      
      // Since container holds 2 identical blocks, moving it by -50% shifts it exactly by 1 block width
      if (percentRef.current <= -50) {
        percentRef.current += 50;
      }
      
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${percentRef.current}%)`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div 
      className="w-full overflow-hidden border-y border-border-primary bg-surface py-3 flex group"
      onMouseEnter={() => { targetVelocityRef.current = 0; }}
      onMouseLeave={() => { targetVelocityRef.current = BASE_SPEED; }}
    >
      {/* 
        We use w-max to ensure the container is exactly as wide as both blocks combined. 
        Moving this container by -50% will shift it by exactly one block's width. 
      */}
      <div className="flex shrink-0 w-max" ref={containerRef}>
        {/* First block */}
        <div className="flex shrink-0">
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
        <div aria-hidden="true" className="flex shrink-0">
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
    </div>
  );
}
