'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useContext, useRef } from 'react';

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

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="h-full">
        <FrozenRoute>{children}</FrozenRoute>

        {/* Exit Overlay (Slides down from top to cover the screen) */}
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-[#ccf200] z-[9999] origin-top pointer-events-none"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Enter Overlay (Slides down to bottom to reveal the screen) */}
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-[#ccf200] z-[9999] origin-bottom pointer-events-none"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
