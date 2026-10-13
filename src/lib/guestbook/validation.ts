export type NameValidation =
  | { ok: true; name: string }
  | { ok: false; error: string };

export type MessageValidation =
  | { ok: true; message: string }
  | { ok: false; error: string };

const NAME_MIN = 1;
const NAME_MAX = 40;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function hasControlCharacter(value: string): boolean {
  return /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value);
}

/** First name taken from Google. Never accepts an email address. */
export function validateDisplayName(input: unknown): NameValidation {
  if (typeof input !== "string") {
    return { ok: false, error: "A first name is required." };
  }

  const name = collapseWhitespace(input);

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return {
      ok: false,
      error: `Name must be between ${NAME_MIN} and ${NAME_MAX} characters.`,
    };
  }

  if (name.includes("@") || hasControlCharacter(name)) {
    return { ok: false, error: "That name cannot be shown on a note." };
  }

  if (!/\p{L}|\p{N}/u.test(name)) {
    return { ok: false, error: "That name cannot be shown on a note." };
  }

  return { ok: true, name };
}

export function validateGuestbookMessage(input: unknown): MessageValidation {
  if (typeof input !== "string") {
    return { ok: false, error: "A message is required." };
  }

  const message = collapseWhitespace(input);

  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    return {
      ok: false,
      error: `Message must be between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters.`,
    };
  }

  if (hasControlCharacter(message)) {
    return { ok: false, error: "Message contains unsupported characters." };
  }

  return { ok: true, message };
}

export const guestbookLimits = {
  nameMin: NAME_MIN,
  nameMax: NAME_MAX,
  messageMin: MESSAGE_MIN,
  messageMax: MESSAGE_MAX,
} as const;
