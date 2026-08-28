'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedEmail from '@/components/ProtectedEmail';
import { useCms } from '@/components/CmsProvider';

export function MobileMenuTrigger({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center text-primary-fixed md:hidden z-40 relative"
    >
      <span className="material-symbols-outlined text-[24px]">menu</span>
    </button>
  );
}

export function MobileMenuOverlay({ isOpen, onClose }) {
  const pathname = usePathname();
  const { navigation, siteConfig } = useCms();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-background md:hidden"
        >
          <div className="flex h-16 items-center justify-between px-6 border-b border-border-primary">
            <span className="font-[family-name:var(--font-display)] text-[24px] font-bold">
              /H/
            </span>
            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center text-primary-fixed"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <nav className="flex flex-col items-center justify-center flex-1 gap-8">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`font-[family-name:var(--font-mono)] text-[24px] tracking-wider uppercase ${
                      isActive ? 'font-bold text-primary-fixed' : 'text-on-secondary-container'
                    }`}
                  >
                    {item.number}. {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex justify-center gap-8 pb-12"
          >
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-text-muted">
              <span className="material-symbols-outlined text-[28px]">code</span>
            </a>
            <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted">
              <span className="material-symbols-outlined text-[28px]">groups</span>
            </a>
            <ProtectedEmail className="text-text-muted hover:text-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-[28px]">mail</span>
            </ProtectedEmail>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 right-0 z-40 p-4 md:hidden">
        <MobileMenuTrigger onClick={() => setIsOpen(true)} />
      </div>
      <MobileMenuOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
