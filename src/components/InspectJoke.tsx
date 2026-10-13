"use client";

import { useEffect, useState } from "react";

const INSPECT_LINES = [
  "what yo wanna look at twin?",
  "looking for smth?",
  "nuh-uh no no no",
] as const;

const DOCK_GAP_PX = 170;

function devtoolsAreDocked() {
  const widthGap = window.outerWidth - window.innerWidth;
  const heightGap = window.outerHeight - window.innerHeight;
  const sideDock = widthGap > DOCK_GAP_PX && heightGap < DOCK_GAP_PX;
  const bottomDock = heightGap > DOCK_GAP_PX && widthGap < DOCK_GAP_PX;
  return sideDock || bottomDock;
}

function isInspectShortcut(event: KeyboardEvent) {
  if (event.key === "F12") return true;
  const key = event.key.toLowerCase();
  const chord = event.ctrlKey || event.metaKey;
  const macInspect = event.metaKey && event.altKey;
  return (chord && event.shiftKey && (key === "i" || key === "j" || key === "c")) ||
    (macInspect && (key === "i" || key === "j" || key === "c"));
}

function pickLine() {
  return INSPECT_LINES[Math.floor(Math.random() * INSPECT_LINES.length)];
}

/** Replaces the page when someone opens browser inspect tools. */
export function InspectJoke() {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    const reveal = () => {
      setLine((current) => current ?? pickLine());
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isInspectShortcut(event)) reveal();
    };

    const watchDock = () => {
      if (devtoolsAreDocked()) reveal();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", watchDock);
    const timer = window.setInterval(watchDock, 400);
    watchDock();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", watchDock);
      window.clearInterval(timer);
    };
  }, []);

  if (!line) return null;

  return (
    <div className="inspect-joke" role="alert">
      <img src="/inspect-cat.gif" alt="" width={480} height={360} />
      <p>{line}</p>
    </div>
  );
}
