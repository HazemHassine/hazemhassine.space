"use client";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileMenu from "@/components/MobileMenu";
import SectionReveal from "@/components/SectionReveal";
import ProtectedEmail from "@/components/ProtectedEmail";
import { useCms } from "@/components/CmsProvider";
import Link from "next/link";
import dynamic from "next/dynamic";

import { useState } from "react";

const Hero3DObject = dynamic(() => import("@/components/Hero3DObject"), { ssr: false });

export default function Contact() {
  const { siteConfig, pageContent } = useCms();
  const copy = pageContent?.contact || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      <Sidebar />
      <main className="md:ml-[180px] min-h-screen flex flex-col relative z-10">
        <TopBar />
        <MobileMenu />

        <div className="flex-1 p-[28px] lg:p-12">
          <SectionReveal>
            <div className="mb-12 border-b border-border-primary pb-4">
              <h1 className="font-[family-name:var(--font-display)] text-[32px] font-bold uppercase text-primary tracking-tight">
                {copy.eyebrow || '/ GET IN TOUCH'}
              </h1>
              <p className="font-[family-name:var(--font-mono)] text-[14px] text-text-muted max-w-2xl mt-2">
                {copy.introduction || 'Have a project in mind, a question, or just want to say hello? Drop a message below or reach out directly via email.'}
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-6xl">
            {/* Left Column: Contact Info */}
            <SectionReveal delay={0.1}>
              <div data-highlight-id="contact-details" className="flex flex-col space-y-12">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-[64px] md:text-[80px] font-extrabold leading-[0.85] tracking-[-0.04em] text-outline uppercase">
                    {(copy.displayTitle || "LET'S\nTALK").split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
                  </h2>
                </div>

                <div className="space-y-6 border-l border-primary-fixed pl-6">
                  <div>
                    <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-primary-fixed mb-1">
                      EMAIL
                    </h3>
                    <ProtectedEmail
                      showTextOnReveal={true}
                      className="font-[family-name:var(--font-mono)] text-[17px] text-primary hover:text-primary-fixed transition-colors"
                    >
                      [ REVEAL EMAIL ]
                    </ProtectedEmail>
                  </div>

                  <div>
                    <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-primary-fixed mb-1">
                      LOCATION
                    </h3>
                    <p className="font-[family-name:var(--font-mono)] text-[17px] text-text-muted">
                      {siteConfig.location}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-primary-fixed mb-1">
                      SOCIAL
                    </h3>
                    <div className="flex space-x-6 mt-2">
                      <a
                        href={siteConfig.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-muted hover:text-primary-fixed transition-colors"
                      >
                        <span className="material-symbols-outlined text-2xl">code</span>
                      </a>
                      <a
                        href={siteConfig.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-muted hover:text-primary-fixed transition-colors"
                      >
                        <span className="material-symbols-outlined text-2xl">groups</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Right Column: Contact Form & 3D Background */}
            <SectionReveal delay={0.2}>
              <div className="relative">
                {/* 3D Object placed to the right in the background with lower opacity */}
                <div className="absolute top-12 -right-96 w-[400px] h-[400px] opacity-40 pointer-events-none z-0 hidden lg:block">
                  <Hero3DObject />
                </div>
              <form
                data-highlight-id="contact-form"
                className="relative z-10 flex flex-col space-y-6 bg-surface/90 backdrop-blur-sm p-8 border border-border-primary"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  setIsSubmitting(true);

                  try {
                    const res = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: form.name.value,
                        email: form.email.value,
                        message: form.message.value,
                      }),
                    });

                    if (res.ok) {
                      alert(copy.successMessage || "Message sent successfully!");
                      form.reset();
                    } else {
                      const data = await res.json();
                      alert("Failed to send message: " + data.error);
                    }
                  } catch (err) {
                    alert("An error occurred. Please try again.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase mb-2 tracking-wider">
                    NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="bg-background border border-border-primary p-3 font-[family-name:var(--font-mono)] text-[14px] text-primary focus:border-primary-fixed focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase mb-2 tracking-wider">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="bg-background border border-border-primary p-3 font-[family-name:var(--font-mono)] text-[14px] text-primary focus:border-primary-fixed focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="message" className="font-[family-name:var(--font-mono)] text-[11px] text-text-muted uppercase mb-2 tracking-wider">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    className="bg-background border border-border-primary p-3 font-[family-name:var(--font-mono)] text-[14px] text-primary focus:border-primary-fixed focus:outline-none transition-colors resize-y"
                    placeholder="Hello, I'd like to discuss..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="mt-4 bg-primary-fixed text-background px-6 py-4 font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-wider hover:bg-primary transition-colors uppercase self-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "[ SENDING... ]" : (copy.submitLabel || "[ SEND MESSAGE ]")}
                </button>
              </form>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-border-primary p-[28px] flex justify-between items-center text-text-dim font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider">
          <div>{siteConfig.copyright}</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary-fixed transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:text-primary-fixed transition-colors">
              TERMS
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
