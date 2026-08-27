'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import styles from './PortfolioChat.module.css';

const starterQuestions = [
  'What is Hazem working on?',
  'Summarize his experience',
  'Which project uses AI agents?',
];

function getMessageText(message) {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
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
                    <small><i></i> ONLINE VIA AI GATEWAY</small>
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
                    I can answer questions about Hazem&apos;s experience, education, projects, and technical work. What would you like to know?
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
                  const text = getMessageText(message);
                  if (!text) return null;

                  const isUser = message.role === 'user';
                  return (
                    <div
                      key={message.id}
                      className={`${styles.messageRow} ${isUser ? styles.userRow : styles.assistantRow}`}
                    >
                      <span className={styles.messageLabel}>
                        {isUser ? 'VISITOR' : 'HAZEM_AI'} / {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className={styles.messageBubble}>{text}</div>
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
                    <span>CONNECTION_ERROR</span>
                    The assistant is unavailable right now. Check the Gateway configuration or try again shortly.
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

              <footer className={styles.footer}>
                <span>MODEL / GEMINI 2.5 FLASH LITE</span>
                <span>ANSWERS FROM PORTFOLIO DATA</span>
              </footer>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
