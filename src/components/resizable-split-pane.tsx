"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";

interface ResizableSplitPaneProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

export default function ResizableSplitPane({
  leftPane,
  rightPane,
  initialLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
}: ResizableSplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;

      const newLeftWidthPercent = (newWidth / containerWidth) * 100;
      const clampedWidth = Math.min(
        Math.max(newLeftWidthPercent, minLeftWidth),
        maxLeftWidth,
      );

      setLeftWidth(clampedWidth);
    },
    [isDragging, minLeftWidth, maxLeftWidth],
  );

  const handleDoubleClick = useCallback(() => {
    setLeftWidth(initialLeftWidth);
  }, [initialLeftWidth]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="flex h-lvh w-full overflow-hidden border-3 border-solid border-gray-300 rounded-2xl"
    >
      <div
        className="overflow-auto bg-white"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPane}
      </div>
      <div
        className="cursor-col-resize bg-gray-300 hover:bg-gray-400 transition-colors"
        style={{ width: "4px" }}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
      />
      <div className="flex-1 overflow-auto bg-white">{rightPane}</div>
    </div>
  );
}