'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/data';

export default function ProtectedEmail({ children, className }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleClick = (e) => {
    if (isRevealed) return;

    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setShowCaptcha(true);
    setError(false);
    setAnswer('');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (parseInt(answer) === num1 + num2) {
      setIsRevealed(true);
      setShowCaptcha(false);
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div className="relative inline-block">
      <span
        onClick={handleClick}
        className={`${className} ${!isRevealed ? 'cursor-pointer' : 'cursor-text'}`}
        role={!isRevealed ? "button" : undefined}
        tabIndex={!isRevealed ? 0 : undefined}
      >
        {isRevealed ? siteConfig.email : children}
      </span>

      {showCaptcha && (
        <div className="absolute bottom-full mb-2 left-0 min-w-[220px] p-4 bg-surface border border-primary-fixed shadow-2xl z-50 flex flex-col gap-3">
          <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-primary-fixed">
            Anti-Spam Check
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[14px] text-text-muted">
            What is {num1} + {num2}?
          </div>
          <form onSubmit={handleVerify} className="flex gap-2">
            <input 
              type="text" 
              value={answer}
              onChange={(e) => { setAnswer(e.target.value); setError(false); }}
              className={`w-16 bg-background border ${error ? 'border-red-500' : 'border-border-primary'} p-2 text-[14px] font-[family-name:var(--font-mono)] text-primary focus:outline-none`}
              autoFocus
            />
            <button type="submit" className="bg-primary-fixed text-background px-3 font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider hover:bg-primary transition-colors uppercase">
              Verify
            </button>
            <button type="button" onClick={() => setShowCaptcha(false)} className="text-text-muted hover:text-primary transition-colors flex items-center justify-center px-1">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
