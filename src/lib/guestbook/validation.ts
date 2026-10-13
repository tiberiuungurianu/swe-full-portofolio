export type ValidationResult =
  | { ok: true; name: string; message: string }
  | { ok: false; error: string };

const NAME_MIN = 2;
const NAME_MAX = 40;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function validateGuestbookInput(input: {
  name?: unknown;
  message?: unknown;
}): ValidationResult {
  if (typeof input.name !== "string" || typeof input.message !== "string") {
    return { ok: false, error: "Name and message are required." };
  }

  const name = collapseWhitespace(input.name);
  const message = collapseWhitespace(input.message);

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return {
      ok: false,
      error: `Name must be between ${NAME_MIN} and ${NAME_MAX} characters.`,
    };
  }

  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    return {
      ok: false,
      error: `Message must be between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters.`,
    };
  }

  // Reject obvious control characters while keeping plain text.
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(name + message)) {
    return { ok: false, error: "Message contains unsupported characters." };
  }

  return { ok: true, name, message };
}

export const guestbookLimits = {
  nameMin: NAME_MIN,
  nameMax: NAME_MAX,
  messageMin: MESSAGE_MIN,
  messageMax: MESSAGE_MAX,
} as const;
