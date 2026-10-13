export const INTRO_STORAGE_KEY = "portfolio-intro-done";
export const INTRO_GREETING = "hello world, tiberiu's portfolio here";
export const INTRO_PROMPT = "press enter ↵";
export const INTRO_TITLE = "tiberiu — portfolio";

export function isHomePath(pathname: string) {
  return pathname === "/";
}

export function readIntroCompleted() {
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markIntroCompleted() {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    /* sessionStorage unavailable — allow entry without errors */
  }
}

export function clearIntroDocumentFlag() {
  document.documentElement.removeAttribute("data-intro");
}

export function setIntroDocumentFlag(value: "pending" | "active") {
  document.documentElement.dataset.intro = value;
}
