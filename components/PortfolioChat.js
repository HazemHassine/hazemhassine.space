'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './PortfolioChat.module.css';

function getStarterQuestions(pathname = '/') {
  if (pathname === '/about') {
    return [
      'Summarize his experience at Siemens & Imperial',
      'What are Hazem\'s core skills & tech stack?',
      'Tell me about his Master\'s degree in Germany',
    ];
  }
  if (pathname === '/projects') {
    return [
      'Which projects focus on Agentic AI & RAG?',
      'Tell me about Arbiter vs Forma',
      'What is RepoTrajectory and what did Hazem build?',
    ];
  }
  if (pathname?.startsWith('/projects/arbiter')) {
    return [
      'How does Arbiter evaluate agent drift?',
      'What is Arbiter\'s dual-sandbox architecture?',
      'What technologies power Arbiter?',
    ];
  }
  if (pathname?.startsWith('/projects/repotrajectory')) {
    return [
      'How does RepoTrajectory analyze Git repositories?',
      'What algorithms does RepoTrajectory use?',
      'Show me the RepoTrajectory GitHub repository',
    ];
  }
  if (pathname?.startsWith('/projects/gitaudit')) {
    return [
      'What security checks does GitAudit perform?',
      'How does automated security triage work in GitAudit?',
      'What is GitAudit\'s tech stack?',
    ];
  }
  if (pathname?.startsWith('/projects/forma')) {
    return [
      'What makes Forma\'s design system unique?',
      'What components does Forma provide?',
      'How is Forma architected?',
    ];
  }
  if (pathname?.startsWith('/projects/gemini-mcp')) {
    return [
      'What tools does Gemini-MCP expose?',
      'How does Model Context Protocol work in Gemini-MCP?',
      'How do I run Gemini-MCP locally?',
    ];
  }
  if (pathname?.startsWith('/projects/rsvp-shift')) {
    return [
      'How does RSVP-Shift handle scheduling?',
      'What is the full-stack architecture of RSVP-Shift?',
      'How does the relay backend work?',
    ];
  }
  if (pathname?.startsWith('/projects/portfolio')) {
    return [
      'How is this portfolio website built?',
      'Tell me about the 3D WebGL scenes',
      'How does the local CMS work?',
    ];
  }
  if (pathname === '/contact') {
    return [
      'What collaboration opportunities is Hazem open to?',
      'How can I reach Hazem directly?',
      'Where can I download Hazem\'s CV?',
    ];
  }
  if (pathname?.startsWith('/blog')) {
    return [
      'What technical topics does Hazem write about?',
      'Summarize his latest blog post',
      'What research in AI is Hazem focusing on?',
    ];
  }
  return [
    'What is Hazem working on right now?',
    'Tell me about Arbiter\'s architecture',
    'Summarize his experience at Siemens & Imperial',
  ];
}

function parseMessageContent(text) {
  if (!text) return { cleanText: '', suggestions: [] };

  const suggestionsRegex = /<suggestions>([\s\S]*?)<\/suggestions>/i;
  const match = text.match(suggestionsRegex);
  let cleanText = text;
  const suggestions = [];

  if (match) {
    cleanText = text.replace(suggestionsRegex, '').trim();
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(match[1])) !== null) {
      const q = itemMatch[1].trim();
      if (q) suggestions.push(q);
    }
  } else {
    cleanText = cleanText.replace(/<suggestions>[\s\S]*$/i, '').trim();
  }

  return { cleanText, suggestions };
}

function getMessagePartsData(message) {
  const textParts = [];
  const toolParts = [];

  for (const part of message.parts || []) {
    if (part.type === 'text') {
      textParts.push(part.text);
    } else if (part.type?.startsWith('tool-') || part.type === 'tool-invocation') {
      toolParts.push(part);
    }
  }

  const rawText = (
    textParts.length > 0
      ? textParts.join('\n')
      : (typeof message.content === 'string' ? message.content : '')
  ).trim();
  const { cleanText, suggestions } = parseMessageContent(rawText);

  return { cleanText, rawText, suggestions, toolParts };
}

export default function PortfolioChat() {
  const pathname = usePathname() || '/';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [activeSpotlight, setActiveSpotlight] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const seenSpotlightsRef = useRef(new Set());
  const spotlightTimeoutRef = useRef(null);

  const starterQuestions = useMemo(() => getStarterQuestions(pathname), [pathname]);

  const triggerSpotlight = (targetId) => {
    if (typeof window === 'undefined' || !targetId) return;

    const cleanId = String(targetId).trim();

    // If target relates to a skill, also dispatch select-skill event
    if (cleanId.startsWith('skill-')) {
      window.dispatchEvent(new CustomEvent('portfolio:select-skill', { detail: { skillId: cleanId } }));
    }

    // If target relates to showcase tabs, also dispatch select-showcase-tab event
    if (cleanId.startsWith('tab-') || cleanId.startsWith('showcase-')) {
      window.dispatchEvent(new CustomEvent('portfolio:select-showcase-tab', { detail: { tabId: cleanId } }));
    }

    const element = document.querySelector(`[data-highlight-id="${cleanId}"], #${CSS.escape(cleanId)}`);
    if (!element) return;

    // Smooth center into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

    const calcRect = () => {
      const rect = element.getBoundingClientRect();
      return {
        id: cleanId,
        top: Math.max(0, rect.top - 8),
        left: Math.max(0, rect.left - 8),
        width: rect.width + 16,
        height: rect.height + 16,
      };
    };

    setActiveSpotlight(calcRect());

    // Update after smooth scroll settles
    const timer1 = setTimeout(() => {
      setActiveSpotlight(calcRect());
    }, 250);
    const timer2 = setTimeout(() => {
      setActiveSpotlight(calcRect());
    }, 500);

    element.classList.remove('chat-spotlight-active');
    void element.offsetWidth; // force DOM reflow
    element.classList.add('chat-spotlight-active');

    if (spotlightTimeoutRef.current) clearTimeout(spotlightTimeoutRef.current);
    spotlightTimeoutRef.current = setTimeout(() => {
      setActiveSpotlight(null);
      element.classList.remove('chat-spotlight-active');
      clearTimeout(timer1);
      clearTimeout(timer2);
    }, 4500);
  };

  // Keep spotlight cutout in sync during scrolling and window resizing
  useEffect(() => {
    if (!activeSpotlight?.id) return undefined;
    const element = document.querySelector(`[data-highlight-id="${activeSpotlight.id}"], #${CSS.escape(activeSpotlight.id)}`);
    if (!element) return undefined;

    const handleUpdate = () => {
      const rect = element.getBoundingClientRect();
      setActiveSpotlight((prev) => (prev ? {
        ...prev,
        top: Math.max(0, rect.top - 8),
        left: Math.max(0, rect.left - 8),
        width: rect.width + 16,
        height: rect.height + 16,
      } : null));
    };

    window.addEventListener('scroll', handleUpdate, { passive: true });
    window.addEventListener('resize', handleUpdate, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [activeSpotlight?.id]);

  const {
    clearError,
    error,
    messages,
    sendMessage,
    setMessages,
    status,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat', body: { pathname } }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts || []) {
        const toolName = part.type?.replace(/^tool-/, '') || part.toolName;
        if (toolName === 'spotlightPageElement') {
          const data = part.output || part.input || part.args || {};
          const targetId = data.targetId;
          const partKey = `${msg.id}-${targetId}`;
          if (targetId && !seenSpotlightsRef.current.has(partKey)) {
            seenSpotlightsRef.current.add(partKey);
            triggerSpotlight(targetId);
          }
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 220);
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isOpen, messages, status]);

  const submitMessage = useCallback((text) => {
    const question = text.trim();
    if (!question || isBusy) return;

    clearError();
    setInput('');
    sendMessage({ text: question }, { body: { pathname } });
  }, [clearError, isBusy, pathname, sendMessage]);

  const submitMessageRef = useRef(submitMessage);
  useEffect(() => {
    submitMessageRef.current = submitMessage;
  });

  useEffect(() => {
    const handleOpenChat = (event) => {
      setIsOpen(true);
      const prompt = event.detail?.prompt;
      if (prompt) {
        setTimeout(() => {
          submitMessageRef.current?.(prompt);
        }, 150);
      }
    };

    window.addEventListener('open-portfolio-chat', handleOpenChat);
    return () => window.removeEventListener('open-portfolio-chat', handleOpenChat);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage(input);
  };

  const resetChat = () => {
    stop();
    clearError();
    setMessages([]);
    seenSpotlightsRef.current.clear();
    setInput('');
    inputRef.current?.focus();
  };

  const renderToolPart = (part, partIdx) => {
    const toolName = part.type?.replace(/^tool-/, '') || part.toolName;
    const data = part.output || part.input || part.args || {};

    if (toolName === 'displayProjectCard') {
      return (
        <div key={partIdx} className={styles.projectCard}>
          <div className={styles.projectCardHeader}>
            <span className={styles.projectCardTag}>{data.category || 'PROJECT'}</span>
            <span className={styles.projectCardBadge}>VERIFIED SYSTEM</span>
          </div>
          <div className={styles.projectCardBody}>
            <h4 className={styles.projectCardTitle}>{data.title}</h4>
            <p className={styles.projectCardSubtitle}>{data.subtitle}</p>
            {data.techStack && data.techStack.length > 0 && (
              <div className={styles.projectCardTech}>
                {data.techStack.map((tech, tIdx) => (
                  <span key={tIdx} className={styles.techBadge}>{tech}</span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.projectCardActions}>
            <Link
              href={data.showcaseUrl || `/projects/${data.slug}`}
              className={styles.projectActionPrimary}
              onClick={() => setIsOpen(false)}
            >
              <span>VIEW SHOWCASE</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            {data.githubUrl && (
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectActionSecondary}
              >
                <span>GITHUB</span>
                <span className="material-symbols-outlined">open_in_new</span>
              </a>
            )}
          </div>
        </div>
      );
    }

    if (toolName === 'recommendNavigation') {
      return (
        <div key={partIdx} className={styles.navActionCard}>
          <div className={styles.navActionInfo}>
            <span className="material-symbols-outlined">{data.path?.includes('CV') ? 'description' : 'explore'}</span>
            <div>
              <strong>{data.label}</strong>
              <small>{data.description}</small>
            </div>
          </div>
          {data.path?.endsWith('.pdf') ? (
            <a
              href={data.path}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navActionBtn}
            >
              <span>OPEN</span>
              <span className="material-symbols-outlined">download</span>
            </a>
          ) : (
            <Link
              href={data.path || '/'}
              className={styles.navActionBtn}
              onClick={() => setIsOpen(false)}
            >
              <span>NAVIGATE</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          )}
        </div>
      );
    }

    if (toolName === 'displaySkillsProvenance') {
      return (
        <div key={partIdx} className={styles.skillCard}>
          <div className={styles.skillCardHeader}>
            <span className={styles.skillCardCategory}>{data.category}</span>
            <span className={styles.skillCardTag}>{data.tag}</span>
          </div>
          <h4 className={styles.skillCardTitle}>{data.skillName}</h4>
          <p className={styles.skillCardSummary}>{data.summary}</p>
          {data.evidence && data.evidence.length > 0 && (
            <div className={styles.skillEvidenceList}>
              <span className={styles.evidenceLabel}>VERIFIED PROVENANCE:</span>
              {data.evidence.map((ev, eIdx) => (
                <div key={eIdx} className={styles.skillEvidenceItem}>
                  <strong>{ev.entity} ({ev.role})</strong>
                  <span>{ev.summary}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (toolName === 'displayContextCard') {
      const categoryColor =
        data.category === 'achievement_metric'
          ? '#00ff9d'
          : data.category === 'experience_project'
            ? '#00f0ff'
            : data.category === 'skills_arsenal'
              ? '#ffb74d'
              : data.category === 'education_credential'
                ? '#b388ff'
                : '#ffffff';

      return (
        <div key={partIdx} className={styles.vaultCard}>
          <div className={styles.vaultCardHeader}>
            <span
              className={styles.vaultCardTag}
              style={{ color: categoryColor, borderColor: `${categoryColor}40` }}
            >
              {data.entity || 'CONTEXT VAULT'}
            </span>
            <span className={styles.vaultCardBadge}>VERIFIED FACT</span>
          </div>
          <h4 className={styles.vaultCardTitle}>{data.title}</h4>
          <p className={styles.vaultCardContent}>{data.content}</p>
          {data.metrics && data.metrics.length > 0 && (
            <div className={styles.vaultCardMetrics}>
              {data.metrics.map((m, mIdx) => (
                <span key={mIdx} className={styles.metricPill}>
                  {m}
                </span>
              ))}
            </div>
          )}
          {(data.showcaseUrl || data.githubUrl) && (
            <div className={styles.vaultCardActions}>
              {data.showcaseUrl && (
                <Link
                  href={data.showcaseUrl}
                  className={styles.vaultActionPrimary}
                  onClick={() => setIsOpen(false)}
                >
                  <span>SHOWCASE</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              )}
              {data.githubUrl && (
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.vaultActionSecondary}
                >
                  <span>SOURCE CODE</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Screen Dimming Spotlight Cutout Overlay */}
      <AnimatePresence>
        {activeSpotlight && (
          <motion.div
            key="chat-spotlight-dimming-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              if (spotlightTimeoutRef.current) clearTimeout(spotlightTimeoutRef.current);
              setActiveSpotlight(null);
            }}
            className="fixed inset-0 z-[70] cursor-pointer"
            title="Click anywhere to dismiss spotlight"
          >
            <motion.div
              layout
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: activeSpotlight.top,
                left: activeSpotlight.left,
                width: activeSpotlight.width,
                height: activeSpotlight.height,
                borderRadius: '4px',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.76), 0 0 32px rgba(220, 254, 76, 0.9), inset 0 0 18px rgba(220, 254, 76, 0.2)',
                border: '2px solid var(--color-primary-fixed, #dcfe4c)',
                pointerEvents: 'none',
              }}
            >
              {/* Cyber Corner Marks */}
              <span style={{ position: 'absolute', top: -3, left: -3, width: 8, height: 8, borderTop: '2px solid var(--color-primary-fixed, #dcfe4c)', borderLeft: '2px solid var(--color-primary-fixed, #dcfe4c)' }} />
              <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderTop: '2px solid var(--color-primary-fixed, #dcfe4c)', borderRight: '2px solid var(--color-primary-fixed, #dcfe4c)' }} />
              <span style={{ position: 'absolute', bottom: -3, left: -3, width: 8, height: 8, borderBottom: '2px solid var(--color-primary-fixed, #dcfe4c)', borderLeft: '2px solid var(--color-primary-fixed, #dcfe4c)' }} />
              <span style={{ position: 'absolute', bottom: -3, right: -3, width: 8, height: 8, borderBottom: '2px solid var(--color-primary-fixed, #dcfe4c)', borderRight: '2px solid var(--color-primary-fixed, #dcfe4c)' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerHidden : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Ask Hazem's portfolio assistant"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerIcon} aria-hidden="true">H/</span>
        <span className={styles.triggerCopy}>
          <span>ASK HAZEM_AI</span>
          <small>PORTFOLIO ASSISTANT</small>
        </span>
        <span className={styles.statusDot} aria-hidden="true"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              className={styles.backdrop}
              onClick={() => setIsOpen(false)}
              aria-label="Close portfolio assistant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.section
              className={styles.panel}
              role="dialog"
              aria-label="Hazem's portfolio assistant"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <header className={styles.header}>
                <div className={styles.identity}>
                  <span className={styles.avatar} aria-hidden="true">H/</span>
                  <span>
                    <strong>/ HAZEM_AI</strong>
                    <small><i></i> ONLINE</small>
                  </span>
                </div>
                <div className={styles.headerActions}>
                  {messages.length > 0 && (
                    <button type="button" onClick={resetChat} aria-label="Start a new chat">
                      <span className="material-symbols-outlined">refresh</span>
                    </button>
                  )}
                  <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </header>

              <div className={styles.transcript} aria-live="polite">
                <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                  <span className={styles.messageLabel}>HAZEM_AI / 00</span>
                  <div className={styles.messageBubble}>
                    I can answer questions about Hazem&apos;s experience, education, projects, and technical skills. What would you like to explore?
                  </div>
                </div>

                {messages.length === 0 && (
                  <div className={styles.suggestions}>
                    {starterQuestions.map((question) => (
                      <button
                        type="button"
                        key={question}
                        onClick={() => submitMessage(question)}
                      >
                        <span>+</span> {question}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((message, index) => {
                  const { cleanText, suggestions, toolParts } = getMessagePartsData(message);
                  const isUser = message.role === 'user';

                  if (!cleanText && toolParts.length === 0) return null;

                  return (
                    <div
                      key={message.id}
                      className={`${styles.messageRow} ${isUser ? styles.userRow : styles.assistantRow}`}
                    >
                      <span className={styles.messageLabel}>
                        {isUser ? 'VISITOR' : 'HAZEM_AI'} / {String(index + 1).padStart(2, '0')}
                      </span>

                      {cleanText && (
                        <div className={styles.messageBubble}>
                          {isUser ? (
                            cleanText
                          ) : (
                            <div className={styles.markdownContent}>
                              <ReactMarkdown
                                components={{
                                  a: ({ node, ...props }) => {
                                    const isGithub = props.href?.includes('github.com');
                                    const isLinkedin = props.href?.includes('linkedin.com');
                                    const isInternal = props.href?.startsWith('/');

                                    if (isInternal) {
                                      return (
                                        <Link
                                          href={props.href}
                                          style={{ color: 'var(--color-primary-fixed)', textDecoration: 'underline' }}
                                          onClick={() => setIsOpen(false)}
                                        >
                                          {props.children}
                                        </Link>
                                      );
                                    }

                                    return (
                                      <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          color: 'var(--color-primary-fixed)',
                                          textDecoration: 'underline',
                                        }}
                                      >
                                        {isGithub && (
                                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                        )}
                                        {isLinkedin && (
                                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                        )}
                                        {props.children}
                                      </a>
                                    );
                                  },
                                }}
                              >
                                {cleanText}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      )}

                      {toolParts.length > 0 && (
                        <div className={styles.toolPartsContainer}>
                          {toolParts.map((toolPart, pIdx) => renderToolPart(toolPart, pIdx))}
                        </div>
                      )}

                      {!isUser && suggestions.length > 0 && (
                        <div className={styles.followUpContainer}>
                          <span className={styles.followUpLabel}>SUGGESTED NEXT:</span>
                          <div className={styles.followUpList}>
                            {suggestions.map((suggestion, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                className={styles.followUpBtn}
                                onClick={() => submitMessage(suggestion)}
                                disabled={isBusy}
                              >
                                <span>+</span> {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {status === 'submitted' && (
                  <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                    <span className={styles.messageLabel}>HAZEM_AI / PROCESSING</span>
                    <div className={styles.loadingBars} aria-label="Hazem AI is thinking">
                      <i></i><i></i><i></i><i></i>
                    </div>
                  </div>
                )}

                {error && (
                  <div className={styles.errorMessage} role="alert">
                    <span>CONNECTION_NOTICE</span>
                    {error.message && !error.message.includes('[object Object]')
                      ? error.message
                      : 'The portfolio assistant is temporarily unavailable. Please verify API configuration or try again shortly.'}
                    <button type="button" onClick={clearError}>[ DISMISS ]</button>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className={styles.composer} onSubmit={handleSubmit}>
                <label htmlFor="portfolio-chat-input">YOUR QUESTION</label>
                <div className={styles.inputRow}>
                  <textarea
                    ref={inputRef}
                    id="portfolio-chat-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    maxLength={500}
                    rows={2}
                    placeholder="Ask about experience, projects, skills..."
                    disabled={isBusy}
                  />
                  <button
                    type={isBusy ? 'button' : 'submit'}
                    onClick={isBusy ? stop : undefined}
                    disabled={!isBusy && input.trim().length === 0}
                    aria-label={isBusy ? 'Stop response' : 'Send message'}
                  >
                    <span className="material-symbols-outlined">
                      {isBusy ? 'stop' : 'arrow_upward'}
                    </span>
                  </button>
                </div>
                <div className={styles.composerMeta}>
                  <span>SHIFT + ENTER FOR NEW LINE</span>
                  <span>{input.length} / 500</span>
                </div>
              </form>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

