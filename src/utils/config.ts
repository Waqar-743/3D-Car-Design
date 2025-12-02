// View configuration for the 360° car viewer
export interface ViewConfig {
  id: string;
  label: string;
  path: string;
  frames: number;
  icon: string;
  description: string;
}

export interface CarConfig {
  model: string;
  year: number;
  subtitle: string;
  imagePath: string;
}

// Default car configuration
export const defaultCarConfig: CarConfig = {
  model: "Luxury Sports Car",
  year: 2024,
  subtitle: "Premium Edition",
  imagePath: "/car-images/",
};

// Views configuration - using available images
export const viewsConfig: Record<string, ViewConfig> = {
  exterior: {
    id: "exterior",
    label: "Exterior",
    path: "exterior/",
    frames: 8, // Using available exterior images
    icon: "🚗",
    description: "360° exterior view showcasing body lines and design",
  },
  interior: {
    id: "interior",
    label: "Interior",
    path: "interior/",
    frames: 1, // One interior image available
    icon: "🪑",
    description: "Luxury cabin with premium finishes",
  },
  front: {
    id: "front",
    label: "Front",
    path: "front/",
    frames: 4, // Front view images available
    icon: "🎯",
    description: "Detailed front view and headlights",
  },
  detail: {
    id: "detail",
    label: "Details",
    path: "detail/",
    frames: 3, // Side detail images
    icon: "✨",
    description: "Close-up shots of special features",
  },
};

// Viewer settings
export const viewerSettings = {
  // Rotation settings
  pixelsPerFrame: 30, // How many pixels to drag for one frame change
  rotationSensitivity: 1.0,
  
  // Zoom settings
  minZoom: 0.8,
  maxZoom: 3.0,
  zoomStep: 0.1,
  
  // Animation settings
  transitionDuration: 300, // ms
  autoRotateSpeed: 2000, // ms per frame
  autoRotateDelay: 5000, // ms before auto-rotate starts
  
  // Auto-rotate settings
  enableAutoRotate: true,
  autoRotatePauseOnInteraction: true,
  
  // UI settings
  showFrameCounter: true,
  showControls: true,
};

// Image naming pattern
export const getImagePath = (
  basePath: string,
  view: string,
  frameNumber: number,
  extension: string = "png"
): string => {
  return `${basePath}${view}/car-${view}-${frameNumber}.${extension}`;
};

// Get total frames across all views
export const getTotalFrames = (): number => {
  return Object.values(viewsConfig).reduce((sum, view) => sum + view.frames, 0);
};

// Keyboard shortcuts configuration
export const keyboardShortcuts = {
  rotateLeft: ["ArrowLeft", "a", "A"],
  rotateRight: ["ArrowRight", "d", "D"],
  zoomIn: ["+", "=", "ArrowUp"],
  zoomOut: ["-", "_", "ArrowDown"],
  toggleFullscreen: ["f", "F"],
  resetView: ["r", "R"],
  toggleAutoRotate: [" "], // Space
};
