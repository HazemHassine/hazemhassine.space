"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[role='menuitem']",
  ".cursor-pointer",
  "[data-cursor='pointer']",
  "[data-clickable]",
].join(", ");

function isClickable(element) {
  if (!element || !(element instanceof Element)) return false;

  // Disabled elements are not clickable
  if (element.closest(":disabled, [aria-disabled='true']")) {
    return false;
  }

  if (element.closest(INTERACTIVE_SELECTOR)) {
    return true;
  }

  try {
    const cursor = window.getComputedStyle(element).cursor;
    if (cursor === "pointer") return true;
  } catch {
    // Fallback for detached nodes or unhandled errors
  }

  return false;
}

export default function CustomCursor() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const lastPosRef = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const setHoverState = useCallback((hovered) => {
    if (isHoveredRef.current !== hovered) {
      isHoveredRef.current = hovered;
      setIsHovered(hovered);
    }
  }, []);

  const checkHoverAtCurrentPos = useCallback(() => {
    const { x, y } = lastPosRef.current;
    if (x < 0 || y < 0) return;
    const el = document.elementFromPoint(x, y);
    setHoverState(isClickable(el));
  }, [setHoverState]);

  useEffect(() => {
    let checkRafId = null;
    let timerId = null;

    const scheduleCheck = () => {
      if (checkRafId) cancelAnimationFrame(checkRafId);
      checkRafId = requestAnimationFrame(() => {
        checkHoverAtCurrentPos();
      });
    };

    const moveCursor = (e) => {
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
      setHoverState(isClickable(e.target));
    };

    const handleMouseOver = (e) => {
      setHoverState(isClickable(e.target));
    };

    const handleMouseOut = (e) => {
      if (!e.relatedTarget) {
        setHoverState(false);
      } else {
        setHoverState(isClickable(e.relatedTarget));
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setHoverState(false);
    };

    const handleWindowBlur = () => {
      setIsVisible(false);
      setHoverState(false);
    };

    const handleClick = () => {
      scheduleCheck();
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(checkHoverAtCurrentPos, 60);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        scheduleCheck();
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(checkHoverAtCurrentPos, 60);
      }
    };

    const handleCursorReset = () => {
      setHoverState(false);
      scheduleCheck();
    };

    // Detect DOM removals (e.g. modals unmounting) and re-evaluate hover state immediately
    const observer = new MutationObserver(() => {
      scheduleCheck();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("cursor:reset", handleCursorReset);

    return () => {
      if (checkRafId) cancelAnimationFrame(checkRafId);
      if (timerId) clearTimeout(timerId);
      observer.disconnect();

      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("cursor:reset", handleCursorReset);
    };
  }, [cursorX, cursorY, checkHoverAtCurrentPos, setHoverState]);

  // Reset hover state and re-evaluate on pathname change
  useEffect(() => {
    setHoverState(false);
    const timeout = setTimeout(() => {
      checkHoverAtCurrentPos();
    }, 100);
    return () => clearTimeout(timeout);
  }, [pathname, checkHoverAtCurrentPos, setHoverState]);

  // Handle SSR by not rendering until mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || pathname === "/admin" || pathname === "/admin/login") return null;

  const variants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: "#ccf200",
      border: "0px solid #ccf200",
      mixBlendMode: "normal",
      opacity: isVisible ? 1 : 0
    },
    hovered: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(204, 242, 0, 0)",
      border: "2px solid #ccf200",
      mixBlendMode: "difference",
      opacity: isVisible ? 1 : 0
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] max-md:hidden"
      variants={variants}
      initial="default"
      animate={isHovered ? "hovered" : "default"}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
        x: "-50%",
        y: "-50%",
      }}
    />
  );
}
