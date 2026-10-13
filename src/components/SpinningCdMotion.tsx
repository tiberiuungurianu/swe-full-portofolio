"use client";

import { useEffect, useRef, useState } from "react";

import { mixThemeColors, readThemeColor } from "@/lib/theme-color";

type SpinningCdMotionProps = {
  /** `pixel` draws blocks. `binary` draws 0/1 in the same cells. */
  mode?: "pixel" | "binary";
  /** Outer rim colour. Defaults to primary text. The disc face is black with a green highlight. */
  colour?: string;
  className?: string;
};

const DISC_GRID_SIZE = 32;
const DISC_CELL_SIZE = 5;

/**
 * Footer compact disc that spins in place.
 * Pixel or binary cells. Respects reduced motion and the pause button.
 */
export function SpinningCdMotion({
  mode = "pixel",
  colour,
  className = "",
}: SpinningCdMotionProps) {
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

    const drawDisc = (elapsedSeconds: number) => {
      const spinAngle = elapsedSeconds * 0.85;
      const rimColor = colour ?? readThemeColor("--color-ink", "#f0ede6");
      const hubColor = readThemeColor("--color-ink", "#f0ede6");
      const faceShadow = readThemeColor("--color-bg", "#111111");
      const faceHighlight = readThemeColor("--color-accent", "#c5f567");
      drawingContext.save();
      drawingContext.translate(210, 113);
      drawingContext.rotate(spinAngle);
      for (let gridRow = -DISC_GRID_SIZE / 2; gridRow < DISC_GRID_SIZE / 2; gridRow += 1) {
        for (
          let gridColumn = -DISC_GRID_SIZE / 2;
          gridColumn < DISC_GRID_SIZE / 2;
          gridColumn += 1
        ) {
          const distanceFromCenter = Math.hypot(gridColumn + 0.5, gridRow + 0.5);
          const isOutsideDisc = distanceFromCenter > 15.6;
          const isInsideHole = distanceFromCenter < 3;
          if (isOutsideDisc || isInsideHole) continue;
          const cellAngle = Math.atan2(gridRow + 0.5, gridColumn + 0.5);
          const sheen = (Math.sin(cellAngle * 3 + spinAngle * 0.3) + 1) / 2;
          const isOuterRim = distanceFromCenter > 14.5;
          const isHub = distanceFromCenter < 4.5;
          const fillColor = isOuterRim
            ? rimColor
            : isHub
              ? hubColor
              : mixThemeColors(faceShadow, faceHighlight, sheen * 0.82);
          drawCell(
            gridColumn * DISC_CELL_SIZE,
            gridRow * DISC_CELL_SIZE,
            DISC_CELL_SIZE,
            fillColor,
            (gridRow + 16) * DISC_GRID_SIZE + gridColumn + 16,
          );
        }
      }
      drawingContext.restore();
    };

    const paintScene = () => {
      drawingContext.setTransform(2, 0, 0, 2, 0, 0);
      drawingContext.clearRect(0, 0, 420, 240);
      const elapsedSeconds = isReducedMotion ? 0 : elapsedSecondsRef.current;
      drawDisc(elapsedSeconds);
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
    <div className={`footer-motion footer-motion--cd ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="footer-motion__canvas"
        width={840}
        height={480}
        role="img"
        aria-label={`${mode === "binary" ? "Binary" : "Pixel"} rotating compact disc decoration`}
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
