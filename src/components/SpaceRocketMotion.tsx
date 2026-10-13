"use client";

import { useEffect, useRef, useState } from "react";

import { readThemeColor } from "@/lib/theme-color";

type SpaceRocketMotionProps = {
  /** `pixel` draws blocks. `binary` draws 0/1 in the same cells. */
  mode?: "pixel" | "binary";
  /** Hull colour. Defaults to primary text. The rest of the sprite follows the theme. */
  colour?: string;
  className?: string;
};

/** 14-column sprite. `.` is empty. Letters map to colours in `drawRocket`. */
const ROCKET_SPRITE = [
  "......AA......",
  ".....AAAA.....",
  "....AAAAAA....",
  "....ABBBBA....",
  "...ABBBBBBA...",
  "...ABCCCCBA...",
  "...ABCSSCBA...",
  "...ABCCCCBA...",
  "...ABBBBBBA...",
  "..AABBBBBBAA..",
  ".AAABBBBBBAAA.",
  "AAAABBBBBBAAAA",
  "AAAABBBBBBAAAA",
  "...ABBBBBBA...",
  "....AAAAAA....",
  ".....FFFF.....",
  ".....FGGF.....",
  "......GG......",
] as const;

const ROCKET_SPRITE_WIDTH = 14;
/** Full launch-and-return loop, in seconds. */
const FLIGHT_LOOP_SECONDS = 10;

/**
 * Footer rocket that launches, shrinks toward a distant point, pauses, then returns.
 * Pixel or binary cells. Respects reduced motion and the pause button.
 */
export function SpaceRocketMotion({
  mode = "pixel",
  colour,
  className = "",
}: SpaceRocketMotionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedSecondsRef = useRef(0);
  const previousFrameTimeRef = useRef(0);
  const animationFrameIdRef = useRef(0);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => setIsReducedMotion(reducedMotionQuery.matches);
    syncReducedMotion();
    reducedMotionQuery.addEventListener("change", syncReducedMotion);
    return () => reducedMotionQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const drawingContext = canvas.getContext("2d");
    if (!drawingContext) return;

    const drawCell = (
      cellX: number,
      cellY: number,
      cellSize: number,
      fillColor: string,
      cellId: number,
    ) => {
      drawingContext.fillStyle = fillColor;
      if (mode === "binary") {
        drawingContext.font = `${Math.max(5, cellSize * 0.95)}px monospace`;
        drawingContext.textAlign = "center";
        drawingContext.textBaseline = "middle";
        const binaryDigit = (cellId * 13 + 7) % 5 < 2 ? "0" : "1";
        drawingContext.fillText(binaryDigit, cellX + cellSize / 2, cellY + cellSize / 2);
      } else {
        drawingContext.fillRect(
          Math.round(cellX),
          Math.round(cellY),
          Math.max(1, Math.ceil(cellSize * 0.83)),
          Math.max(1, Math.ceil(cellSize * 0.83)),
        );
      }
    };

    const drawRocket = (elapsedSeconds: number) => {
      const hullColor = colour ?? readThemeColor("--color-ink", "#f0ede6");
      const loopProgress = (elapsedSeconds % FLIGHT_LOOP_SECONDS) / FLIGHT_LOOP_SECONDS;
      let rocketScale: number;
      let rocketX: number;
      let rocketY: number;
      let rocketAngle: number;

      // Hold, launch and shrink, pause far away, then ease back to the pad.
      if (loopProgress < 0.08) {
        rocketScale = 1;
        rocketX = 183;
        rocketY = 154;
        rocketAngle = 0;
      } else if (loopProgress < 0.52) {
        const launchProgress = (loopProgress - 0.08) / 0.44;
        const easedLaunch = 1 - Math.pow(1 - launchProgress, 2);
        rocketScale = 1 - 0.93 * easedLaunch;
        rocketX = 183 + 130 * easedLaunch;
        rocketY = 154 - 115 * easedLaunch;
        rocketAngle = 0.38 * easedLaunch;
      } else if (loopProgress < 0.66) {
        rocketScale = 0.07;
        rocketX = 313;
        rocketY = 39;
        rocketAngle = 0.38;
      } else {
        const returnProgress = (loopProgress - 0.66) / 0.34;
        const easedReturn = returnProgress * returnProgress * (3 - 2 * returnProgress);
        rocketScale = 0.07 + 0.93 * easedReturn;
        rocketX = 313 - 130 * easedReturn;
        rocketY = 39 + 115 * easedReturn;
        rocketAngle = 0.38 * (1 - easedReturn);
      }

      for (let starIndex = 0; starIndex < 12; starIndex += 1) {
        const starX = 50 + ((starIndex * 97) % 330);
        const starY = 25 + ((starIndex * 43) % 165);
        drawingContext.fillStyle = hullColor;
        drawingContext.globalAlpha = 0.16 + 0.12 * Math.sin(elapsedSeconds + starIndex) ** 2;
        drawingContext.fillRect(starX, starY, 2, 2);
      }
      drawingContext.globalAlpha = 1;

      drawingContext.save();
      drawingContext.translate(rocketX, rocketY);
      drawingContext.rotate(rocketAngle);
      const cellSize = 5 * rocketScale;
      const spriteColours: Record<string, string> = {
        A: hullColor,
        B: readThemeColor("--color-muted", "#a3a3a3"),
        C: readThemeColor("--color-line", "#303030"),
        S: readThemeColor("--color-bg", "#111111"),
        F: readThemeColor("--color-ink", "#f0ede6"),
        G: readThemeColor("--color-muted", "#a3a3a3"),
      };

      for (let spriteRow = 0; spriteRow < ROCKET_SPRITE.length; spriteRow += 1) {
        for (let spriteColumn = 0; spriteColumn < ROCKET_SPRITE_WIDTH; spriteColumn += 1) {
          const spriteKey = ROCKET_SPRITE[spriteRow]![spriteColumn]!;
          if (spriteKey === ".") continue;
          const isFlamePixel = spriteKey === "F" || spriteKey === "G";
          const isPausedFarAway = loopProgress >= 0.52 && loopProgress < 0.66;
          if (isFlamePixel && isPausedFarAway) continue;
          const flameFlicker = spriteKey === "G" ? Math.sin(elapsedSeconds * 12) * cellSize : 0;
          drawCell(
            (spriteColumn - 7) * cellSize,
            (spriteRow - 9) * cellSize + flameFlicker,
            cellSize,
            spriteColours[spriteKey]!,
            spriteRow * ROCKET_SPRITE_WIDTH + spriteColumn,
          );
        }
      }
      drawingContext.restore();
    };

    const paintScene = () => {
      drawingContext.setTransform(2, 0, 0, 2, 0, 0);
      drawingContext.clearRect(0, 0, 420, 240);
      const elapsedSeconds = isReducedMotion ? 0 : elapsedSecondsRef.current;
      drawRocket(elapsedSeconds);
    };

    const advanceFrame = (frameTime: number) => {
      if (previousFrameTimeRef.current) {
        const deltaSeconds = Math.min(frameTime - previousFrameTimeRef.current, 60) / 1000;
        elapsedSecondsRef.current += deltaSeconds;
      }
      previousFrameTimeRef.current = frameTime;
      paintScene();
      animationFrameIdRef.current = requestAnimationFrame(advanceFrame);
    };

    const syncPlayback = () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = 0;
      previousFrameTimeRef.current = 0;
      paintScene();
      const shouldKeepPlaying =
        !isPausedRef.current && !isReducedMotion && !document.hidden;
      if (shouldKeepPlaying) {
        animationFrameIdRef.current = requestAnimationFrame(advanceFrame);
      }
    };

    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [mode, colour, isReducedMotion, isPaused]);

  const playbackLabel = isReducedMotion
    ? "motion reduced"
    : isPaused
      ? "play animation"
      : "pause animation";

  return (
    <div className={`footer-motion footer-motion--rocket ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="footer-motion__canvas"
        width={840}
        height={480}
        role="img"
        aria-label={`${mode === "binary" ? "Binary" : "Pixel"} rocket flying into space and returning decoration`}
      />
      <div className="footer-motion__controls">
        <button
          type="button"
          className="footer-motion__toggle"
          onClick={() => setIsPaused((wasPaused) => !wasPaused)}
          disabled={isReducedMotion}
          aria-label={playbackLabel}
        >
          {playbackLabel}
        </button>
      </div>
    </div>
  );
}
