'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSection.module.css';

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
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto_0.6fr] border-b border-border-primary">
      {/* Left Column */}
      <div className="p-[28px] lg:p-12 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1 
            variants={itemVariants}
            className="font-[family-name:var(--font-display)] text-[64px] md:text-[120px] font-extrabold leading-[0.85] tracking-[-0.06em] text-white glitch-static"
            data-text={siteConfig.title.split(' ').slice(0, -1).join(' ')}
          >
            {siteConfig.title.split(' ').slice(0, -1).join(' ')}
          </motion.h1>
          <motion.h1 
            variants={itemVariants}
            className="font-[family-name:var(--font-display)] text-[64px] md:text-[120px] font-extrabold leading-[0.85] tracking-[-0.06em] text-outline glitch-static block"
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
              href="/projects" 
              className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary-fixed hover:text-primary transition-colors uppercase"
            >
              [ VIEW PROJECTS ]
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Middle Column */}
      <div className={`${styles.portraitStage} min-h-[500px] md:min-h-[600px] min-w-[300px] lg:min-w-[500px] border-r border-border-primary relative flex items-center justify-center p-6 md:p-12 overflow-hidden`}>
        {/* Global Grid Background */}
        <div className="grid-background absolute inset-0 pointer-events-none opacity-20"></div>
        
        {/* Decorative background block (Gray Textured Area) */}
        <div className="absolute left-[5%] md:left-[10%] bottom-[20%] w-[45%] md:w-[40%] aspect-square bg-surface-container-high border border-border-primary z-0"></div>
        
        {/* The portrait container (Uncropped/Controlled aspect ratio) */}
        <div 
          className={`${styles.portraitFrame} relative w-[320px] md:w-[460px] aspect-[4/5] z-10`}
        >
          <div className={styles.portraitFade}>
            <Image
              src="/hazem-colored.jpeg"
              alt="Portrait of Hazem Hassine"
              fill
              sizes="(max-width: 768px) 320px, 460px"
              className={`${styles.portraitPhoto} object-cover object-center`}
              preload
            />

            {/* Texture and one-shot hover scan */}
            <div className={`${styles.portraitGrid} grid-background absolute inset-0 pointer-events-none mix-blend-overlay`}></div>
            <div className={styles.scanBeam} aria-hidden="true"></div>
            <div className={styles.scanStripes} aria-hidden="true"></div>
          </div>

          <div className={styles.frameCorners} aria-hidden="true"></div>
        </div>

        {/* Accent blocks (Primary colored squares) */}
        <div className="absolute left-[10%] md:left-[15%] bottom-[15%] w-12 h-12 bg-primary-fixed z-20"></div>
        <div className="absolute right-[5%] md:right-[10%] bottom-[10%] w-16 h-16 bg-primary-fixed flex items-center justify-center z-20 shadow-lg border border-primary-fixed-dim">
          <span className="material-symbols-outlined text-background text-2xl font-bold">arrow_outward</span>
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
