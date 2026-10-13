"use client";

import { useEffect, useRef, useState } from "react";

import { readThemeColor } from "@/lib/theme-color";

/** Off-screen grid the silhouette is sampled from. */
const ASCII_COLUMNS = 120;
const ASCII_ROWS = 80;
/** How long each gallop pose stays on screen. */
const FRAME_INTERVAL_MS = 115;
const GALLOP_FRAME_COUNT = 8;
const MONOSPACE_FONT =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace";
const MOTION_STORAGE_KEY = "portfolio-motion";

/** One character cell in a gallop frame. */
type AsciiGlyph = {
  column: number;
  row: number;
  inkDensity: number;
  character: string;
};

/** Darker pixels use heavier characters; faint pixels use dots. */
function charactersForDensity(inkDensity: number) {
  if (inkDensity > 0.55) return "A0GC2%&#";
  if (inkDensity > 0.22) return "+x*:;=";
  return ".:·";
}

function pickCharacter(inkDensity: number) {
  const characterSet = charactersForDensity(inkDensity);
  const randomIndex = Math.floor(Math.random() * characterSet.length);
  return characterSet[randomIndex]!;
}

/**
 * Draws one side-view gallop pose, facing right, in solid black on white.
 * `frameIndex` selects the leg phase inside the 8-frame loop.
 */
function drawGallopSilhouette(
  drawingContext: CanvasRenderingContext2D,
  frameIndex: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  const gallopPhase = (frameIndex / GALLOP_FRAME_COUNT) * Math.PI * 2;
  const bodyCenterX = canvasWidth * 0.48;
  const bodyCenterY =
    canvasHeight * 0.52 + Math.sin(gallopPhase) * canvasHeight * 0.02;
  const bodyScale = Math.min(canvasWidth, canvasHeight);

  drawingContext.fillStyle = "#fff";
  drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
  drawingContext.fillStyle = "#000";
  drawingContext.strokeStyle = "#000";
  drawingContext.lineJoin = "round";
  drawingContext.lineCap = "round";

  const drawLimbSegment = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    radius: number,
  ) => {
    const segmentAngle = Math.atan2(endY - startY, endX - startX);
    drawingContext.lineWidth = radius * 2;
    drawingContext.beginPath();
    drawingContext.moveTo(startX, startY);
    drawingContext.lineTo(endX, endY);
    drawingContext.stroke();
    drawingContext.beginPath();
    drawingContext.arc(startX, startY, radius, 0, Math.PI * 2);
    drawingContext.arc(
      endX,
      endY,
      radius,
      segmentAngle - Math.PI / 2,
      segmentAngle + Math.PI / 2,
    );
    drawingContext.fill();
  };

  const rearLegPhaseA = gallopPhase;
  const rearLegPhaseB = gallopPhase + 0.95;
  const frontLegPhaseA = gallopPhase + Math.PI;
  const frontLegPhaseB = gallopPhase + Math.PI + 0.9;

  const drawLeg = (
    legPhase: number,
    hipX: number,
    hipY: number,
    isFrontLeg: boolean,
  ) => {
    const reach = Math.sin(legPhase);
    const lift = Math.max(0, Math.cos(legPhase));
    const facing = isFrontLeg ? 1 : -1;
    const kneeX = hipX + facing * bodyScale * (0.04 + reach * 0.07);
    const kneeY = hipY + bodyScale * (0.12 - lift * 0.07);
    const hoofX = hipX + facing * bodyScale * (0.08 + reach * 0.13);
    const hoofY = hipY + bodyScale * (0.26 - lift * 0.11);
    drawLimbSegment(hipX, hipY, kneeX, kneeY, bodyScale * 0.028);
    drawLimbSegment(kneeX, kneeY, hoofX, hoofY, bodyScale * 0.022);
    drawingContext.beginPath();
    drawingContext.ellipse(hoofX, hoofY, bodyScale * 0.03, bodyScale * 0.018, 0, 0, Math.PI * 2);
    drawingContext.fill();
  };

  drawLeg(rearLegPhaseA, bodyCenterX - bodyScale * 0.14, bodyCenterY + bodyScale * 0.04, false);
  drawLeg(rearLegPhaseB, bodyCenterX - bodyScale * 0.05, bodyCenterY + bodyScale * 0.05, false);
  drawLeg(frontLegPhaseA, bodyCenterX + bodyScale * 0.1, bodyCenterY + bodyScale * 0.03, true);
  drawLeg(frontLegPhaseB, bodyCenterX + bodyScale * 0.18, bodyCenterY + bodyScale * 0.03, true);

  drawingContext.beginPath();
  drawingContext.ellipse(bodyCenterX, bodyCenterY, bodyScale * 0.24, bodyScale * 0.115, -0.1, 0, Math.PI * 2);
  drawingContext.fill();

  drawingContext.beginPath();
  drawingContext.ellipse(
    bodyCenterX + bodyScale * 0.12,
    bodyCenterY + bodyScale * 0.01,
    bodyScale * 0.1,
    bodyScale * 0.1,
    0.15,
    0,
    Math.PI * 2,
  );
  drawingContext.fill();

  drawingContext.beginPath();
  drawingContext.ellipse(
    bodyCenterX - bodyScale * 0.14,
    bodyCenterY,
    bodyScale * 0.11,
    bodyScale * 0.1,
    -0.2,
    0,
    Math.PI * 2,
  );
  drawingContext.fill();

  drawingContext.beginPath();
  drawingContext.moveTo(bodyCenterX + bodyScale * 0.14, bodyCenterY - bodyScale * 0.02);
  drawingContext.quadraticCurveTo(
    bodyCenterX + bodyScale * 0.22,
    bodyCenterY - bodyScale * 0.14,
    bodyCenterX + bodyScale * 0.28,
    bodyCenterY - bodyScale * 0.15,
  );
  drawingContext.lineTo(bodyCenterX + bodyScale * 0.32, bodyCenterY - bodyScale * 0.08);
  drawingContext.quadraticCurveTo(
    bodyCenterX + bodyScale * 0.24,
    bodyCenterY - bodyScale * 0.02,
    bodyCenterX + bodyScale * 0.18,
    bodyCenterY + bodyScale * 0.04,
  );
  drawingContext.closePath();
  drawingContext.fill();

  drawingContext.beginPath();
  drawingContext.ellipse(
    bodyCenterX + bodyScale * 0.33,
    bodyCenterY - bodyScale * 0.1,
    bodyScale * 0.09,
    bodyScale * 0.055,
    0.35,
    0,
    Math.PI * 2,
  );
  drawingContext.fill();

  drawingContext.beginPath();
  drawingContext.moveTo(bodyCenterX + bodyScale * 0.3, bodyCenterY - bodyScale * 0.14);
  drawingContext.lineTo(bodyCenterX + bodyScale * 0.31, bodyCenterY - bodyScale * 0.21);
  drawingContext.lineTo(bodyCenterX + bodyScale * 0.35, bodyCenterY - bodyScale * 0.13);
  drawingContext.closePath();
  drawingContext.fill();

  drawLimbSegment(
    bodyCenterX + bodyScale * 0.12,
    bodyCenterY - bodyScale * 0.06,
    bodyCenterX + bodyScale * 0.27,
    bodyCenterY - bodyScale * 0.16,
    bodyScale * 0.02,
  );
  drawLimbSegment(
    bodyCenterX + bodyScale * 0.16,
    bodyCenterY - bodyScale * 0.04,
    bodyCenterX + bodyScale * 0.25,
    bodyCenterY - bodyScale * 0.13,
    bodyScale * 0.016,
  );

  const tailSwing = Math.sin(gallopPhase * 1.35) * bodyScale * 0.05;
  drawLimbSegment(
    bodyCenterX - bodyScale * 0.22,
    bodyCenterY - bodyScale * 0.02,
    bodyCenterX - bodyScale * 0.34 + tailSwing,
    bodyCenterY + bodyScale * 0.02,
    bodyScale * 0.022,
  );
  drawingContext.beginPath();
  drawingContext.ellipse(
    bodyCenterX - bodyScale * 0.36 + tailSwing,
    bodyCenterY + bodyScale * 0.07,
    bodyScale * 0.055,
    bodyScale * 0.09,
    -0.45 + tailSwing / bodyScale,
    0,
    Math.PI * 2,
  );
  drawingContext.fill();
}

/**
 * Paints each gallop pose onto a tiny canvas, then keeps only the dark pixels
 * as ASCII glyphs. White background is skipped.
 */
function sampleGallopFrames(): AsciiGlyph[][] {
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = ASCII_COLUMNS;
  sampleCanvas.height = ASCII_ROWS;
  const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampleContext) return [];

  const gallopFrames: AsciiGlyph[][] = [];
  for (let frameIndex = 0; frameIndex < GALLOP_FRAME_COUNT; frameIndex += 1) {
    drawGallopSilhouette(sampleContext, frameIndex, ASCII_COLUMNS, ASCII_ROWS);
    const pixelBytes = sampleContext.getImageData(0, 0, ASCII_COLUMNS, ASCII_ROWS).data;
    const frameGlyphs: AsciiGlyph[] = [];
    for (let row = 0; row < ASCII_ROWS; row += 1) {
      for (let column = 0; column < ASCII_COLUMNS; column += 1) {
        const byteOffset = (row * ASCII_COLUMNS + column) * 4;
        const luminance =
          (pixelBytes[byteOffset]! * 0.2126 +
            pixelBytes[byteOffset + 1]! * 0.7152 +
            pixelBytes[byteOffset + 2]! * 0.0722) /
          255;
        const inkDensity = 1 - luminance;
        if (inkDensity > 0.07) {
          frameGlyphs.push({
            column,
            row,
            inkDensity,
            character: pickCharacter(inkDensity),
          });
        }
      }
    }
    gallopFrames.push(frameGlyphs);
  }
  return gallopFrames;
}

/**
 * ASCII galloping horse.
 * Builds the frames once, then redraws them on a timer unless motion is paused,
 * the tab is hidden, or the canvas is off screen.
 */
export function HorseArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gallopFramesRef = useRef<AsciiGlyph[][]>([]);
  const frameIndexRef = useRef(0);
  const lastDrawAtRef = useRef(0);
  const elapsedMsRef = useRef(0);
  const isMotionOnRef = useRef(true);
  const isCanvasVisibleRef = useRef(true);
  const [isMotionOn, setIsMotionOn] = useState(true);
  const [areFramesReady, setAreFramesReady] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const storedMotionPreference = (() => {
      try {
        return localStorage.getItem(MOTION_STORAGE_KEY);
      } catch {
        return null;
      }
    })();
    const shouldAnimate = !reducedMotionQuery.matches && storedMotionPreference !== "off";
    isMotionOnRef.current = shouldAnimate;
    gallopFramesRef.current = sampleGallopFrames();

    const startupFrameId = window.requestAnimationFrame(() => {
      setIsMotionOn(shouldAnimate);
      setAreFramesReady(true);
    });

    const stopWhenReducedMotionTurnsOn = () => {
      if (reducedMotionQuery.matches) {
        isMotionOnRef.current = false;
        setIsMotionOn(false);
      }
    };
    reducedMotionQuery.addEventListener("change", stopWhenReducedMotionTurnsOn);
    return () => {
      window.cancelAnimationFrame(startupFrameId);
      reducedMotionQuery.removeEventListener("change", stopWhenReducedMotionTurnsOn);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !areFramesReady) return;

    const inkColor = () => readThemeColor("--color-ink", "#f0ede6");
    const paperColor = () => readThemeColor("--color-bg", "#111111");

    const paintFrame = (shouldFlickerCharacters: boolean) => {
      const currentGlyphs = gallopFramesRef.current[frameIndexRef.current];
      if (!currentGlyphs) return;
      if (shouldFlickerCharacters) {
        for (const glyph of currentGlyphs) {
          if (Math.random() < 0.08) glyph.character = pickCharacter(glyph.inkDensity);
        }
      }
      const paintContext = canvas.getContext("2d");
      if (!paintContext) return;
      const cellWidth = canvas.width / ASCII_COLUMNS;
      const cellHeight = canvas.height / ASCII_ROWS;
      const ink = inkColor();
      const paper = paperColor();
      paintContext.clearRect(0, 0, canvas.width, canvas.height);
      paintContext.font = `500 7.1px ${MONOSPACE_FONT}`;
      paintContext.textBaseline = "middle";
      paintContext.textAlign = "center";
      for (const glyph of currentGlyphs) {
        const cellX = glyph.column * cellWidth;
        const cellY = glyph.row * cellHeight;
        paintContext.fillStyle = ink;
        if (glyph.inkDensity > 0.48) {
          paintContext.fillRect(cellX, cellY, cellWidth + 0.15, cellHeight + 0.15);
          paintContext.fillStyle = paper;
        }
        paintContext.fillText(glyph.character, cellX + cellWidth / 2, cellY + cellHeight / 2);
      }
    };

    paintFrame(false);

    let previousTimestamp = 0;
    let animationFrameId = 0;
    const advanceGallop = (timestamp: number) => {
      const elapsedSinceLastTick = previousTimestamp
        ? Math.min(100, timestamp - previousTimestamp)
        : 0;
      previousTimestamp = timestamp;
      if (isMotionOnRef.current && isCanvasVisibleRef.current) {
        elapsedMsRef.current += elapsedSinceLastTick;
        if (timestamp - lastDrawAtRef.current > FRAME_INTERVAL_MS) {
          frameIndexRef.current =
            Math.floor(elapsedMsRef.current / FRAME_INTERVAL_MS) %
            (gallopFramesRef.current.length || 1);
          paintFrame(true);
          lastDrawAtRef.current = timestamp;
        }
      }
      animationFrameId = requestAnimationFrame(advanceGallop);
    };
    animationFrameId = requestAnimationFrame(advanceGallop);

    const pauseWhenTabHides = () => {
      isCanvasVisibleRef.current = document.visibilityState === "visible";
      previousTimestamp = 0;
    };
    document.addEventListener("visibilitychange", pauseWhenTabHides);

    const visibilityObserver = new IntersectionObserver((entries) => {
      isCanvasVisibleRef.current = entries[0]?.isIntersecting ?? true;
    });
    visibilityObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", pauseWhenTabHides);
      visibilityObserver.disconnect();
    };
  }, [areFramesReady, isMotionOn]);

  const toggleMotion = () => {
    const nextIsMotionOn = !isMotionOnRef.current;
    isMotionOnRef.current = nextIsMotionOn;
    setIsMotionOn(nextIsMotionOn);
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, nextIsMotionOn ? "on" : "off");
    } catch {
      /* Storage can be blocked; the button still toggles for this visit. */
    }
  };

  return (
    <div className="horse-art">
      <div className="horse-art__stage">
        <canvas
          ref={canvasRef}
          className="horse-art__canvas"
          width={720}
          height={480}
          aria-hidden="true"
        />
      </div>
      <button
        type="button"
        className="motion-control"
        onClick={toggleMotion}
        aria-pressed={!isMotionOn}
      >
        {isMotionOn ? "pause animation" : "resume animation"}
      </button>
    </div>
  );
}
