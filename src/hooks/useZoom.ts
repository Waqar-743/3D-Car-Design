import { useState, useCallback, useRef, useEffect } from "react";
import { viewerSettings } from "../utils/config";

interface UseZoomOptions {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  onZoomChange?: (zoom: number) => void;
}

interface UseZoomReturn {
  zoom: number;
  isZooming: boolean;
  handleWheel: (e: React.WheelEvent) => void;
  handlePinchStart: (e: React.TouchEvent) => void;
  handlePinchMove: (e: React.TouchEvent) => void;
  handlePinchEnd: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (level: number) => void;
  resetZoom: () => void;
}

// Calculate distance between two touch points
const getTouchDistance = (touches: React.TouchList): number => {
  if (touches.length < 2) return 0;
  
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const useZoom = ({
  initialZoom = 1,
  minZoom = viewerSettings.minZoom,
  maxZoom = viewerSettings.maxZoom,
  zoomStep = viewerSettings.zoomStep,
  onZoomChange,
}: UseZoomOptions = {}): UseZoomReturn => {
  const [zoom, setZoomState] = useState(initialZoom);
  const [isZooming, setIsZooming] = useState(false);
  
  const pinchStartDistance = useRef<number>(0);
  const pinchBaseZoom = useRef<number>(initialZoom);

  // Clamp zoom to min/max bounds
  const clampZoom = useCallback(
    (value: number): number => {
      return Math.min(Math.max(value, minZoom), maxZoom);
    },
    [minZoom, maxZoom]
  );

  // Set zoom with clamping
  const setZoom = useCallback(
    (level: number) => {
      const clampedZoom = clampZoom(level);
      setZoomState(clampedZoom);
      onZoomChange?.(clampedZoom);
    },
    [clampZoom, onZoomChange]
  );

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      
      // Determine zoom direction
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      const newZoom = clampZoom(zoom + delta);
      
      if (newZoom !== zoom) {
        setZoomState(newZoom);
        onZoomChange?.(newZoom);
      }
    },
    [zoom, zoomStep, clampZoom, onZoomChange]
  );

  // Handle pinch zoom start
  const handlePinchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 2) return;
      
      setIsZooming(true);
      pinchStartDistance.current = getTouchDistance(e.touches);
      pinchBaseZoom.current = zoom;
    },
    [zoom]
  );

  // Handle pinch zoom move
  const handlePinchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isZooming || e.touches.length !== 2) return;
      
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / pinchStartDistance.current;
      const newZoom = clampZoom(pinchBaseZoom.current * scale);
      
      if (newZoom !== zoom) {
        setZoomState(newZoom);
        onZoomChange?.(newZoom);
      }
    },
    [isZooming, zoom, clampZoom, onZoomChange]
  );

  // Handle pinch zoom end
  const handlePinchEnd = useCallback(() => {
    setIsZooming(false);
    pinchBaseZoom.current = zoom;
  }, [zoom]);

  // Zoom in by step
  const zoomIn = useCallback(() => {
    setZoom(zoom + zoomStep);
  }, [zoom, zoomStep, setZoom]);

  // Zoom out by step
  const zoomOut = useCallback(() => {
    setZoom(zoom - zoomStep);
  }, [zoom, zoomStep, setZoom]);

  // Reset to initial zoom
  const resetZoom = useCallback(() => {
    setZoom(initialZoom);
  }, [initialZoom, setZoom]);

  // Prevent default scroll when zooming
  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      if (isZooming) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    return () => window.removeEventListener("wheel", preventScroll);
  }, [isZooming]);

  return {
    zoom,
    isZooming,
    handleWheel,
    handlePinchStart,
    handlePinchMove,
    handlePinchEnd,
    zoomIn,
    zoomOut,
    setZoom,
    resetZoom,
  };
};

export default useZoom;
