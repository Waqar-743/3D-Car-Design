import { create } from 'zustand';

// CarColor type for color picker
export interface CarColor {
  id: string;
  name: string;
  hex: string;
  metalness?: number;
  roughness?: number;
}

// Default color
const DEFAULT_COLOR: CarColor = {
  id: 'papaya',
  name: 'Papaya Orange',
  hex: '#FF8000',
  metalness: 0.6,
  roughness: 0.3,
};

interface CarStore {
  // Selected car
  selectedCarId: string;
  setSelectedCar: (carId: string) => void;
  
  // Rotation state
  rotationX: number;
  rotationY: number;
  setRotation: (x: number, y: number) => void;
  
  // Zoom state
  zoom: number;
  setZoom: (zoom: number) => void;
  
  // Price visibility
  showPrice: boolean;
  setShowPrice: (show: boolean) => void;
  togglePrice: () => void;
  
  // View mode (3D or Image)
  viewMode: '3d' | 'image';
  setViewMode: (mode: '3d' | 'image') => void;
  toggleViewMode: () => void;
  
  // Fullscreen state
  isFullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  
  // Loading state
  isLoading: boolean;
  loadingProgress: number;
  setLoading: (loading: boolean, progress?: number) => void;
  
  // Auto-rotate
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;
  
  // Selected variant
  selectedVariant: number;
  setSelectedVariant: (index: number) => void;
  
  // NEW: Hotspot state (using any to avoid circular dependency)
  activeHotspot: any | null;
  setActiveHotspot: (hotspot: any | null) => void;
  
  // NEW: Color state
  selectedBodyColor: CarColor;
  setBodyColor: (color: CarColor) => void;
  colorPickerOpen: boolean;
  setColorPickerOpen: (open: boolean) => void;
  toggleColorPicker: () => void;
  
  // NEW: Demo mode
  demoMode: boolean;
  setDemoMode: (demo: boolean) => void;
  toggleDemoMode: () => void;
  demoAutoStarted: boolean;
  setDemoAutoStarted: (started: boolean) => void;
  demoTransitionPhase: 'idle' | 'dark' | 'revealing' | 'complete';
  setDemoTransitionPhase: (phase: 'idle' | 'dark' | 'revealing' | 'complete') => void;
  
  // NEW: Intro animation
  introComplete: boolean;
  setIntroComplete: (complete: boolean) => void;
  
  // NEW: Spotlight mode (triple click)
  spotlightMode: boolean;
  setSpotlightMode: (spotlight: boolean) => void;
  carClickCount: number;
  incrementCarClick: () => void;
  resetCarClick: () => void;
  
  // Reset view
  resetView: () => void;
}

export const useCarStore = create<CarStore>((set) => ({
  // Selected car
  selectedCarId: 'mclaren-mcl38',
  setSelectedCar: (carId) => set({ selectedCarId: carId, showPrice: false }),
  
  // Rotation
  rotationX: 0,
  rotationY: 0,
  setRotation: (x, y) => set({ rotationX: x, rotationY: y }),
  
  // Zoom
  zoom: 1,
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(3, zoom)) }),
  
  // Price
  showPrice: false,
  setShowPrice: (show) => set({ showPrice: show }),
  togglePrice: () => set((state) => ({ showPrice: !state.showPrice })),
  
  // View mode
  viewMode: '3d',
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () => set((state) => ({ 
    viewMode: state.viewMode === '3d' ? 'image' : '3d' 
  })),
  
  // Fullscreen
  isFullscreen: false,
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  
  // Loading
  isLoading: true,
  loadingProgress: 0,
  setLoading: (loading, progress = 0) => set({ isLoading: loading, loadingProgress: progress }),
  
  // Auto-rotate
  autoRotate: false,
  setAutoRotate: (rotate) => set({ autoRotate: rotate }),
  
  // Variant
  selectedVariant: 0,
  setSelectedVariant: (index) => set({ selectedVariant: index }),
  
  // NEW: Hotspot
  activeHotspot: null,
  setActiveHotspot: (hotspot) => set({ activeHotspot: hotspot }),
  
  // NEW: Color
  selectedBodyColor: DEFAULT_COLOR,
  setBodyColor: (color) => set({ selectedBodyColor: color }),
  colorPickerOpen: false,
  setColorPickerOpen: (open) => set({ colorPickerOpen: open }),
  toggleColorPicker: () => set((state) => ({ colorPickerOpen: !state.colorPickerOpen })),
  
  // NEW: Demo mode
  demoMode: false,
  setDemoMode: (demo) => set({ demoMode: demo, autoRotate: demo }),
  toggleDemoMode: () => set((state) => ({ 
    demoMode: !state.demoMode, 
    autoRotate: !state.demoMode 
  })),
  demoAutoStarted: false,
  setDemoAutoStarted: (started) => set({ demoAutoStarted: started }),
  demoTransitionPhase: 'idle',
  setDemoTransitionPhase: (phase) => set({ demoTransitionPhase: phase }),
  
  // NEW: Intro
  introComplete: false,
  setIntroComplete: (complete) => set({ introComplete: complete }),
  
  // NEW: Spotlight mode (triple click)
  spotlightMode: false,
  setSpotlightMode: (spotlight) => set({ spotlightMode: spotlight }),
  carClickCount: 0,
  incrementCarClick: () => set((state) => ({ carClickCount: state.carClickCount + 1 })),
  resetCarClick: () => set({ carClickCount: 0 }),
  
  // Reset
  resetView: () => set({
    rotationX: 0,
    rotationY: 0,
    zoom: 1,
    showPrice: false,
    demoMode: false,
    autoRotate: false,
  }),
}));
