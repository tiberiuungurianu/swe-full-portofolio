"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  INTRO_GREETING,
  INTRO_PROMPT,
  INTRO_TITLE,
  clearIntroDocumentFlag,
  isHomePath,
  markIntroCompleted,
  readIntroCompleted,
  setIntroDocumentFlag,
} from "@/lib/intro";

/** Hidden, typing on screen, or fading out after Enter. */
type IntroPhase = "idle" | "active" | "leaving";

/** Keeps the return-key arrow in the accent colour while the prompt types out. */
function PromptText({ text }: { text: string }) {
  const arrowCharacter = "↵";
  const arrowIndex = text.indexOf(arrowCharacter);
  if (arrowIndex === -1) return text;
  return (
    <>
      {text.slice(0, arrowIndex)}
      <span className="terminal-intro__arrow">{text.slice(arrowIndex)}</span>
    </>
  );
}

function userPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Slightly uneven delay so the typed lines do not look metronomic. */
function randomTypingDelayMs() {
  return 40 + Math.floor(Math.random() * 21);
}

function subscribeToIntroStore(onStoreChange: () => void) {
  window.addEventListener("portfolio-intro-change", onStoreChange);
  return () =>
    window.removeEventListener("portfolio-intro-change", onStoreChange);
}

function notifyIntroStoreChanged() {
  window.dispatchEvent(new Event("portfolio-intro-change"));
}

/** True only on the home page, and only before this session has dismissed the intro. */
function shouldOfferIntro(pathname: string) {
  return isHomePath(pathname) && !readIntroCompleted();
}

/**
 * Full-screen terminal greeting on the home page.
 * Types a line, then waits for Enter (or the button) before revealing the site.
 * Skipped for the rest of the browser session once completed.
 */
export function TerminalIntro() {
  const pathname = usePathname();
  const isIntroOffered = useSyncExternalStore(
    subscribeToIntroStore,
    () => shouldOfferIntro(pathname),
    () => false,
  );

  const [introPhase, setIntroPhase] = useState<IntroPhase>("idle");
  const [typedGreeting, setTypedGreeting] = useState("");
  const [typedPrompt, setTypedPrompt] = useState("");
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const typingTimeoutIdsRef = useRef<number[]>([]);
  const leaveTimeoutIdRef = useRef<number | null>(null);
  const isLeavingRef = useRef(false);
  const finishIntroRef = useRef<() => void>(() => {});
  const enterButtonRef = useRef<HTMLButtonElement>(null);

  const clearTypingTimeouts = useCallback(() => {
    for (const timeoutId of typingTimeoutIdsRef.current) window.clearTimeout(timeoutId);
    typingTimeoutIdsRef.current = [];
  }, []);

  const scheduleTypingStep = useCallback((step: () => void, delayMs: number) => {
    const timeoutId = window.setTimeout(step, delayMs);
    typingTimeoutIdsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  /** Blocks clicks on the page underneath while the dialog is up. */
  const setPageShellInert = useCallback((isInert: boolean) => {
    const pageShellNodes = document.querySelectorAll(
      ".site-header, .site-main, .site-footer, .skip-link",
    );
    pageShellNodes.forEach((pageShellNode) => {
      if (isInert) pageShellNode.setAttribute("inert", "");
      else pageShellNode.removeAttribute("inert");
    });
  }, []);

  const finishIntro = useCallback(() => {
    if (isLeavingRef.current || introPhase === "idle") return;
    isLeavingRef.current = true;
    clearTypingTimeouts();
    markIntroCompleted();
    notifyIntroStoreChanged();

    const skipExitAnimation = userPrefersReducedMotion();
    if (skipExitAnimation) {
      clearIntroDocumentFlag();
      setPageShellInert(false);
      setIntroPhase("idle");
      isLeavingRef.current = false;
      window.requestAnimationFrame(() => {
        document.getElementById("main")?.focus({ preventScroll: true });
      });
      return;
    }

    setIntroPhase("leaving");
    if (leaveTimeoutIdRef.current !== null) {
      window.clearTimeout(leaveTimeoutIdRef.current);
    }
    leaveTimeoutIdRef.current = window.setTimeout(() => {
      leaveTimeoutIdRef.current = null;
      clearIntroDocumentFlag();
      setPageShellInert(false);
      setIntroPhase("idle");
      isLeavingRef.current = false;
      document.getElementById("main")?.focus({ preventScroll: true });
    }, 280);
  }, [introPhase, clearTypingTimeouts, setPageShellInert]);

  useEffect(() => {
    finishIntroRef.current = finishIntro;
  }, [finishIntro]);

  useEffect(() => {
    if (!isIntroOffered) {
      if (introPhase === "active" || introPhase === "leaving") return;
      clearIntroDocumentFlag();
      setPageShellInert(false);
      return;
    }

    if (introPhase !== "idle") return;

    const skipTypingAnimation = userPrefersReducedMotion();
    setIntroDocumentFlag("active");
    setPageShellInert(true);
    isLeavingRef.current = false;

    const startupFrameId = window.requestAnimationFrame(() => {
      setIsReducedMotion(skipTypingAnimation);
      if (skipTypingAnimation) {
        setTypedGreeting(INTRO_GREETING);
        setTypedPrompt(INTRO_PROMPT);
      } else {
        setTypedGreeting("");
        setTypedPrompt("");
      }
      setIntroPhase("active");
    });

    return () => window.cancelAnimationFrame(startupFrameId);
  }, [isIntroOffered, introPhase, setPageShellInert]);

  useEffect(() => {
    if (introPhase !== "active" || isReducedMotion) return;

    clearTypingTimeouts();
    let greetingCharacterIndex = 0;

    const typeNextGreetingCharacter = () => {
      if (greetingCharacterIndex >= INTRO_GREETING.length) {
        scheduleTypingStep(() => {
          let promptCharacterIndex = 0;
          const typeNextPromptCharacter = () => {
            if (promptCharacterIndex >= INTRO_PROMPT.length) return;
            promptCharacterIndex += 1;
            setTypedPrompt(INTRO_PROMPT.slice(0, promptCharacterIndex));
            scheduleTypingStep(typeNextPromptCharacter, randomTypingDelayMs());
          };
          typeNextPromptCharacter();
        }, 420);
        return;
      }
      greetingCharacterIndex += 1;
      setTypedGreeting(INTRO_GREETING.slice(0, greetingCharacterIndex));
      scheduleTypingStep(typeNextGreetingCharacter, randomTypingDelayMs());
    };

    typeNextGreetingCharacter();
    return clearTypingTimeouts;
  }, [introPhase, isReducedMotion, clearTypingTimeouts, scheduleTypingStep]);

  useEffect(() => {
    if (introPhase !== "active" && introPhase !== "leaving") return;

    const finishOnEnter = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      const eventTarget = event.target as HTMLElement | null;
      if (eventTarget?.closest("input, textarea, select, a")) return;
      // Enter dismisses the intro from the skip button and from the rest of the dialog.
      // isLeavingRef stops a second Enter from starting the exit twice.
      event.preventDefault();
      finishIntroRef.current();
    };

    window.addEventListener("keydown", finishOnEnter);
    return () => window.removeEventListener("keydown", finishOnEnter);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "active") return;
    enterButtonRef.current?.focus({ preventScroll: true });
  }, [introPhase]);

  useEffect(() => {
    return () => {
      clearTypingTimeouts();
      if (leaveTimeoutIdRef.current !== null) {
        window.clearTimeout(leaveTimeoutIdRef.current);
        leaveTimeoutIdRef.current = null;
      }
      setPageShellInert(false);
    };
  }, [clearTypingTimeouts, setPageShellInert]);

  if (introPhase === "idle") return null;

  const isGreetingCaretVisible =
    !isReducedMotion &&
    introPhase === "active" &&
    typedGreeting.length < INTRO_GREETING.length;
  const isPromptCaretVisible =
    !isReducedMotion &&
    introPhase === "active" &&
    typedGreeting.length >= INTRO_GREETING.length &&
    typedPrompt.length < INTRO_PROMPT.length;
  const isIdleCaretVisible =
    !isReducedMotion &&
    introPhase === "active" &&
    typedPrompt.length >= INTRO_PROMPT.length;

  return (
    <div
      className={
        introPhase === "leaving"
          ? "terminal-intro terminal-intro--leaving"
          : "terminal-intro"
      }
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio introduction"
    >
      <div className="terminal-intro__window">
        <div className="terminal-intro__titlebar">
          <div className="terminal-intro__traffic" aria-hidden="true">
            <span className="terminal-intro__dot terminal-intro__dot--red" />
            <span className="terminal-intro__dot terminal-intro__dot--yellow" />
            <span className="terminal-intro__dot terminal-intro__dot--green" />
          </div>
          <p className="terminal-intro__title">{INTRO_TITLE}</p>
        </div>

        <div className="terminal-intro__body">
          <p className="sr-only">{INTRO_GREETING}</p>
          <p className="terminal-intro__line" aria-hidden="true">
            <span>{typedGreeting}</span>
            {isGreetingCaretVisible ? (
              <span className="terminal-intro__cursor" />
            ) : null}
          </p>

          <button
            ref={enterButtonRef}
            type="button"
            className="terminal-intro__enter"
            onClick={() => finishIntroRef.current()}
            aria-label={INTRO_PROMPT}
          >
            <span aria-hidden="true">
              <PromptText text={typedPrompt} />
              {isPromptCaretVisible || isIdleCaretVisible ? (
                <span className="terminal-intro__cursor" />
              ) : null}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
