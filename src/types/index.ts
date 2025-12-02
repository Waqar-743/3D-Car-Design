// Type definitions for the 360° Car Viewer

export interface ViewState {
  currentView: string;
  currentFrame: number;
  isLoading: boolean;
  imagesLoaded: boolean;
}

export interface ZoomState {
  level: number;
  isZooming: boolean;
}

export interface RotationState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  baseFrame: number;
}

export interface ViewerProps {
  carModel?: string;
  carYear?: number;
  subtitle?: string;
  imagePath?: string;
  autoRotate?: boolean;
  showFrameCounter?: boolean;
  onViewChange?: (view: string) => void;
  onFrameChange?: (frame: number) => void;
}

export interface ControlBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  disabled?: boolean;
}

export interface ViewTabsProps {
  views: string[];
  activeView: string;
  onViewChange: (view: string) => void;
  disabled?: boolean;
}

export interface RotationCanvasProps {
  images: string[];
  currentFrame: number;
  zoom: number;
  isLoading: boolean;
  onRotationStart: (x: number) => void;
  onRotationMove: (x: number) => void;
  onRotationEnd: () => void;
  onZoom: (delta: number) => void;
}

export interface LoadingSpinnerProps {
  progress?: number;
  message?: string;
}
