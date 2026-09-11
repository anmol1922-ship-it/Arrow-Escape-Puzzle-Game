import { useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";

export interface ResponsiveGameBoardOptions {
  maxBoardSize?: number;
  minBoardSize?: number;
  horizontalPadding?: number;
  reservedHeight?: number;
  gap?: number;
  padding?: number;
}

export interface ResponsiveGameBoardState {
  logicalBoardSize: number;
  boardDimension: number;
  boardWidth: number;
  boardHeight: number;
  cellSize: number;
  gap: number;
  padding: number;
  availableWidth: number;
  availableHeight: number;
  orientation: "portrait" | "landscape";
  boardStyle: CSSProperties;
  containerRef: RefObject<HTMLDivElement | null>;
}

interface ViewportSize {
  width: number;
  height: number;
}

function readViewport(): ViewportSize {
  if (typeof window === "undefined") return { width: 320, height: 640 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function useResponsiveGameBoard(
  logicalBoardSize: number,
  {
    maxBoardSize = 590,
    minBoardSize = 180,
    horizontalPadding = 28,
    reservedHeight = 240,
    gap = 7,
    padding = 9,
  }: ResponsiveGameBoardOptions = {},
): ResponsiveGameBoardState {
  const [viewport, setViewport] = useState(readViewport);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateViewport = () => setViewport(readViewport());
    window.addEventListener("resize", updateViewport);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateViewport)
        : null;
    if (observer && boardRef.current) observer.observe(boardRef.current);
    updateViewport();
    return () => {
      window.removeEventListener("resize", updateViewport);
      observer?.disconnect();
    };
  }, []);

  const availableWidth = Math.max(0, viewport.width - horizontalPadding * 2);
  const availableHeight = Math.max(0, viewport.height - reservedHeight);
  const usableDimension = Math.min(
    maxBoardSize,
    availableWidth,
    availableHeight,
  );
  const boardDimension =
    usableDimension < minBoardSize
      ? usableDimension
      : Math.min(maxBoardSize, usableDimension);
  const safeBoardSize = Math.max(1, logicalBoardSize);
  const cellSize = Math.max(
    0,
    (boardDimension - padding * 2 - gap * (safeBoardSize - 1)) / safeBoardSize,
  );
  const orientation =
    viewport.width >= viewport.height ? "landscape" : "portrait";

  return {
    logicalBoardSize,
    boardDimension,
    boardWidth: boardDimension,
    boardHeight: boardDimension,
    cellSize,
    gap,
    padding,
    availableWidth,
    availableHeight,
    orientation,
    containerRef: boardRef,
    boardStyle: {
      width: `${boardDimension}px`,
      height: `${boardDimension}px`,
      gap: `${gap}px`,
      padding: `${padding}px`,
    },
  };
}
