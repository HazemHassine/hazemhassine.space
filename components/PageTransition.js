'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useContext, useRef, useState, useEffect } from 'react';

// FrozenRoute prevents the route context from updating during the exit animation,
// ensuring the old page doesn't instantly swap its content to the new page.
function FrozenRoute({ children }) {
  const context = useContext(LayoutRouterContext ?? {});
  // eslint-disable-next-line react-hooks/refs
  const frozen = useRef(context).current;

  if (!LayoutRouterContext) {
    return <>{children}</>;
  }

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

const numRows = 5;

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="h-full">
        <FrozenRoute>{children}</FrozenRoute>

        {/* Exit Overlay (Slides in from left to cover the screen) */}
        <div className="fixed top-0 left-0 w-full h-screen z-[9999] pointer-events-none flex flex-col">
          {[...Array(numRows)].map((_, i) => (
            <motion.div
              key={`exit-${i}`}
              className="w-full h-1/5 bg-[#ccf200] origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 0 }}
              exit={{
                scaleX: 1,
                // slight glitch jitter when animating
                y: [0, -2, 2, -1, 0],
                x: [0, 2, -2, 1, 0]
              }}
              transition={{
                scaleX: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
                y: { duration: 0.3, ease: "linear", delay: i * 0.08 + 0.2, times: [0, 0.2, 0.5, 0.8, 1] },
                x: { duration: 0.3, ease: "linear", delay: i * 0.08 + 0.2, times: [0, 0.2, 0.5, 0.8, 1] }
              }}
            />
          ))}
          {/* Subtle text on bottom right during exit */}
          <motion.div
            className="absolute bottom-4 right-4 text-black font-mono text-sm font-bold tracking-widest pointer-events-none z-[10000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1, x: [0, -3, 3, -1, 0] }}
            transition={{
              opacity: { duration: 0.2, delay: 0.4 },
              x: { duration: 0.2, delay: 0.4, repeat: 2 }
            }}
          >
            [ SYSTEM READY ]
          </motion.div>
        </div>

        {/* Enter Overlay (Slides out to right to reveal the screen) */}
        <div className="fixed top-0 left-0 w-full h-screen z-[9998] pointer-events-none flex flex-col">
          {[...Array(numRows)].map((_, i) => (
            <motion.div
              key={`enter-${i}`}
              className="w-full h-1/5 bg-[#ccf200] origin-right"
              initial={{ scaleX: 1 }}
              animate={{
                scaleX: 0,
                y: [0, 1, -1, 0],
                x: [0, -2, 2, 0]
              }}
              exit={{ scaleX: 0 }}
              transition={{
                scaleX: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
                y: { duration: 0.2, ease: "linear", delay: i * 0.08 },
                x: { duration: 0.2, ease: "linear", delay: i * 0.08 }
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
