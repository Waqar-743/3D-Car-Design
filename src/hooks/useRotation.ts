import { useState, useCallback, useRef, useEffect } from "react";
import { viewerSettings } from "../utils/config";

interface UseRotationOptions {
  totalFrames: number;
  initialFrame?: number;
  sensitivity?: number;
  onFrameChange?: (frame: number) => void;
}

interface UseRotationReturn {
  currentFrame: number;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  setFrame: (frame: number) => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  resetRotation: () => void;
}

export const useRotation = ({
  totalFrames,
  initialFrame = 0,
  sensitivity = viewerSettings.rotationSensitivity,
  onFrameChange,
}: UseRotationOptions): UseRotationReturn => {
  const [currentFrame, setCurrentFrame] = useState(initialFrame);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartX = useRef<number>(0);
  const baseFrame = useRef<number>(initialFrame);
  const lastTouchX = useRef<number>(0);

  // Calculate frame from drag distance
  const calculateFrame = useCallback(
    (deltaX: number): number => {
      const frameDelta = Math.round(
        (deltaX / viewerSettings.pixelsPerFrame) * sensitivity
      );
      let newFrame = (baseFrame.current - frameDelta) % totalFrames;
      if (newFrame < 0) newFrame += totalFrames;
      return newFrame;
    },
    [totalFrames, sensitivity]
  );

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    baseFrame.current = currentFrame;
  }, [currentFrame]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStartX.current;
      const newFrame = calculateFrame(deltaX);
      
      if (newFrame !== currentFrame) {
        setCurrentFrame(newFrame);
        onFrameChange?.(newFrame);
      }
    },
    [isDragging, calculateFrame, currentFrame, onFrameChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    baseFrame.current = currentFrame;
  }, [currentFrame]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartX.current = touch.clientX;
    lastTouchX.current = touch.clientX;
    baseFrame.current = currentFrame;
  }, [currentFrame]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartX.current;
      const newFrame = calculateFrame(deltaX);
      
      if (newFrame !== currentFrame) {
        setCurrentFrame(newFrame);
        onFrameChange?.(newFrame);
      }
      
      lastTouchX.current = touch.clientX;
    },
    [isDragging, calculateFrame, currentFrame, onFrameChange]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    baseFrame.current = currentFrame;
  }, [currentFrame]);

  // Manual controls
  const setFrame = useCallback(
    (frame: number) => {
      const normalizedFrame = ((frame % totalFrames) + totalFrames) % totalFrames;
      setCurrentFrame(normalizedFrame);
      baseFrame.current = normalizedFrame;
      onFrameChange?.(normalizedFrame);
    },
    [totalFrames, onFrameChange]
  );

  const rotateLeft = useCallback(() => {
    setFrame((currentFrame - 1 + totalFrames) % totalFrames);
  }, [currentFrame, totalFrames, setFrame]);

  const rotateRight = useCallback(() => {
    setFrame((currentFrame + 1) % totalFrames);
  }, [currentFrame, totalFrames, setFrame]);

  const resetRotation = useCallback(() => {
    setFrame(initialFrame);
  }, [initialFrame, setFrame]);

  // Global mouse up listener to handle mouse release outside the element
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        baseFrame.current = currentFrame;
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging, currentFrame]);

  return {
    currentFrame,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setFrame,
    rotateLeft,
    rotateRight,
    resetRotation,
  };
};

export default useRotation;
