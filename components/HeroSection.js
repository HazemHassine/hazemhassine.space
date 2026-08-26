'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection({ siteConfig, projects }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto_0.8fr] border-b border-border-primary">
      {/* Left Column */}
      <div className="p-[28px] lg:p-12 border-r border-border-primary">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1 
            variants={itemVariants}
            className="font-[family-name:var(--font-display)] text-[64px] md:text-[120px] font-extrabold leading-[0.85] tracking-[-0.06em] text-white glitch-hover"
            data-text={siteConfig.title.split(' ').slice(0, -1).join(' ')}
          >
            {siteConfig.title.split(' ').slice(0, -1).join(' ')}
          </motion.h1>
          <motion.h1 
            variants={itemVariants}
            className="font-[family-name:var(--font-display)] text-[64px] md:text-[120px] font-extrabold leading-[0.85] tracking-[-0.06em] text-outline glitch-hover block"
            data-text={siteConfig.title.split(' ').slice(-1)[0]}
          >
            {siteConfig.title.split(' ').slice(-1)[0]}
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="font-[family-name:var(--font-mono)] text-[17px] text-secondary-fixed-dim leading-[1.75] mt-8 mb-12 max-w-md"
          >
            {siteConfig.tagline}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link 
              href="/work" 
              className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary-fixed hover:text-primary transition-colors uppercase"
            >
              [ VIEW WORK ]
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Middle Column */}
      <div className="min-h-[400px] border-r border-border-primary bg-surface overflow-hidden relative min-w-[300px]">
        <div className="w-full h-full bg-surface-container-high relative">
          <div className="grid-background absolute inset-0 pointer-events-none opacity-30"></div>
          <div className="absolute bottom-12 left-12 w-16 h-16 bg-primary-fixed"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-fixed">arrow_outward</span>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="p-[28px] lg:p-12 bg-surface-dim flex flex-col justify-between">
        <div>
          <div className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-primary-fixed mb-4">
            SELECTED PROJECT
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[32px] font-bold leading-[1.1] tracking-[-0.02em] mb-4">
            {projects[0].title}
          </h2>
          <p className="font-[family-name:var(--font-mono)] text-[14px] font-normal leading-[1.6] text-text-muted mb-8">
            {projects[0].subtitle}
          </p>
          <Link 
            href={projects[0].href} 
            className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary-fixed hover:text-primary transition-colors"
          >
            [ VIEW CASE ]
          </Link>
        </div>
        <div className="self-end font-[family-name:var(--font-mono)] text-[12px] text-text-muted flex flex-col items-end gap-2 mt-12">
          <div className="w-8 h-[1px] bg-border-primary"></div>
          01 / 06
        </div>
      </div>
    </section>
  );
}
