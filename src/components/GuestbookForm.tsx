"use client";

import { useState, type FormEvent } from "react";

import { guestbookLimits } from "@/lib/guestbook/validation";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; detail: string }
  | { status: "error"; detail: string };

export function GuestbookForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = (await response.json()) as { error?: string; detail?: string };

      if (!response.ok) {
        setState({
          status: "error",
          detail: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setName("");
      setMessage("");
      setState({
        status: "success",
        detail:
          data.detail ??
          "Thanks — your note was submitted for review and will appear once approved.",
      });
    } catch {
      setState({
        status: "error",
        detail: "Network error. Please try again in a moment.",
      });
    }
  }

  return (
    <form className="guestbook-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="guestbook-name">Display name</label>
        <input
          id="guestbook-name"
          name="name"
          type="text"
          autoComplete="nickname"
          required
          minLength={guestbookLimits.nameMin}
          maxLength={guestbookLimits.nameMax}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <p className="field__hint">
          {guestbookLimits.nameMin}–{guestbookLimits.nameMax} characters.
        </p>
      </div>

      <div className="field">
        <label htmlFor="guestbook-message">Message</label>
        <textarea
          id="guestbook-message"
          name="message"
          required
          minLength={guestbookLimits.messageMin}
          maxLength={guestbookLimits.messageMax}
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <p className="field__hint">
          {guestbookLimits.messageMin}–{guestbookLimits.messageMax} characters.
          Plain text only.
        </p>
      </div>

      <button
        type="submit"
        className="button button--primary"
        disabled={state.status === "submitting"}
      >
        {state.status === "submitting" ? "sending…" : "leave a note"}
      </button>

      <div className="form-status" aria-live="polite">
        {state.status === "success" ? (
          <p className="form-status__success">{state.detail}</p>
        ) : null}
        {state.status === "error" ? (
          <p className="form-status__error">{state.detail}</p>
        ) : null}
      </div>
    </form>
  );
}
