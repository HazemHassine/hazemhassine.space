'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './PortfolioChat.module.css';

const starterQuestions = [
  'What is Hazem working on?',
  "Tell me about Arbiter's architecture",
  'Summarize his experience at Siemens & Imperial',
];

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
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const {
    clearError,
    error,
    messages,
    sendMessage,
    setMessages,
    status,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';

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

  const submitMessage = (text) => {
    const question = text.trim();
    if (!question || isBusy) return;

    clearError();
    setInput('');
    sendMessage({ text: question });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage(input);
  };

  const resetChat = () => {
    stop();
    clearError();
    setMessages([]);
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

    return null;
  };

  return (
    <>
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

