"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { guestbookLimits } from "@/lib/guestbook/validation";

type GuestbookSubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; statusMessage: string }
  | { status: "error"; statusMessage: string };

type GuestbookFormProps = {
  /** First name from the signed Google session. Absent until they sign in. */
  firstName: string | null;
  /** False when the server is missing Google OAuth settings. */
  googleReady: boolean;
  /** Opens the sign-in card after a failed attempt. */
  initiallyOpen: boolean;
  notice: string | null;
};

/** Sign-in card, then a note form that keeps the Google first name. */
export function GuestbookForm({
  firstName,
  googleReady,
  initiallyOpen,
  notice: initialNotice,
}: GuestbookFormProps) {
  const router = useRouter();
  const signButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardOpen, setCardOpen] = useState(initiallyOpen);
  const [notice, setNotice] = useState(initialNotice);
  const [signedOut, setSignedOut] = useState(false);
  const [visitorMessage, setVisitorMessage] = useState("");
  const [submissionState, setSubmissionState] = useState<GuestbookSubmissionState>({
    status: "idle",
  });

  const activeName = signedOut ? null : firstName;

  useEffect(() => {
    setSignedOut(false);
  }, [firstName]);

  useEffect(() => {
    if (activeName || !cardOpen) return;
    cardRef.current?.focus();
    const url = new URL(window.location.href);
    if (!url.searchParams.has("error")) return;
    url.searchParams.delete("error");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(null, "", next);
  }, [activeName, cardOpen]);

  function closeCard() {
    setCardOpen(false);
    setNotice(null);
    requestAnimationFrame(() => signButtonRef.current?.focus());
  }

  async function signOut() {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (!response.ok) {
        setSubmissionState({
          status: "error",
          statusMessage: "Sign-out failed. Please try again.",
        });
        return;
      }
      setSignedOut(true);
      setCardOpen(false);
      setSubmissionState({ status: "idle" });
      router.refresh();
    } catch {
      setSubmissionState({
        status: "error",
        statusMessage: "Network error. Please try again in a moment.",
      });
    }
  }

  async function submitGuestbookNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState({ status: "submitting" });

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: visitorMessage }),
      });
      const responseBody = (await response.json()) as {
        error?: string;
        detail?: string;
      };

      if (!response.ok) {
        setSubmissionState({
          status: "error",
          statusMessage: responseBody.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setVisitorMessage("");
      setSubmissionState({
        status: "success",
        statusMessage:
          responseBody.detail ??
          "Thanks — your note was submitted for review and will appear once approved.",
      });
    } catch {
      setSubmissionState({
        status: "error",
        statusMessage: "Network error. Please try again in a moment.",
      });
    }
  }

  if (activeName) {
    return (
      <form className="sign-in-card" onSubmit={submitGuestbookNote} noValidate>
        <p className="sign-in-card__lead">
          Writing as <strong>{activeName}</strong>.
        </p>

        <div className="field">
          <label htmlFor="guestbook-message">Message</label>
          <textarea
            id="guestbook-message"
            name="message"
            required
            minLength={guestbookLimits.messageMin}
            maxLength={guestbookLimits.messageMax}
            rows={5}
            value={visitorMessage}
            onChange={(event) => setVisitorMessage(event.target.value)}
          />
          <p className="field__hint">
            {guestbookLimits.messageMin}–{guestbookLimits.messageMax} characters.
            Plain text only.
          </p>
        </div>

        <div className="sign-in-card__actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={submissionState.status === "submitting"}
          >
            {submissionState.status === "submitting" ? "sending…" : "leave a note"}
          </button>
          <button type="button" className="button button--ghost" onClick={signOut}>
            sign out
          </button>
        </div>

        <p className="privacy-note">
          Your first name appears with your message. Your email stays private.
        </p>

        <div className="form-status" aria-live="polite">
          {submissionState.status === "success" ? (
            <p className="form-status__success">{submissionState.statusMessage}</p>
          ) : null}
          {submissionState.status === "error" ? (
            <p className="form-status__error">{submissionState.statusMessage}</p>
          ) : null}
        </div>
      </form>
    );
  }

  if (!cardOpen) {
    return (
      <button
        ref={signButtonRef}
        type="button"
        className="button button--primary"
        onClick={() => setCardOpen(true)}
      >
        sign the guestbook
      </button>
    );
  }

  const cardNotice = googleReady
    ? notice
    : (notice ?? "Google sign-in is not set up on this server yet.");

  return (
    <div
      className="sign-in-card"
      ref={cardRef}
      role="region"
      aria-label="Sign in"
      tabIndex={-1}
    >
      <p className="sign-in-card__lead">
        Sign in so your note shows up with your first name.
      </p>
      <div className="sign-in-card__actions">
        {googleReady ? (
          <a className="button button--primary" href="/api/auth/google">
            Sign in with Google
          </a>
        ) : (
          <button type="button" className="button button--primary" disabled>
            Sign in with Google
          </button>
        )}
        <button type="button" className="button button--ghost" onClick={closeCard}>
          cancel
        </button>
      </div>
      <p className="privacy-note">
        Your first name appears with your message. Your email stays private.
      </p>
      {cardNotice ? (
        <p className="form-status__error" role="status">
          {cardNotice}
        </p>
      ) : null}
    </div>
  );
}
