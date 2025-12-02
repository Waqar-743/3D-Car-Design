import { useState, useCallback, useEffect, useRef } from "react";
import { viewsConfig, viewerSettings, ViewConfig } from "../utils/config";
import { preloadImages, LoadingProgress } from "../utils/imageLoader";

interface UseViewStateOptions {
  initialView?: string;
  autoRotate?: boolean;
  onViewChange?: (view: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

interface UseViewStateReturn {
  currentView: string;
  currentViewConfig: ViewConfig;
  viewImages: string[];
  isLoading: boolean;
  loadingProgress: number;
  isAutoRotating: boolean;
  changeView: (viewId: string) => void;
  toggleAutoRotate: () => void;
  startAutoRotate: () => void;
  stopAutoRotate: () => void;
}

// Get base URL for assets
const BASE_URL = import.meta.env.BASE_URL || '/';

// Get image paths for a view based on available images
const getViewImagePaths = (viewId: string): string[] => {
  // Map views to actual available images
  const imageMapping: Record<string, string[]> = {
    exterior: [
      `${BASE_URL}car-images/Img-left-far.png`,
      `${BASE_URL}car-images/from-right.png`,
      `${BASE_URL}car-images/f1-from-left-far.png`,
      `${BASE_URL}car-images/img/f1-from-left-far.png`,
      `${BASE_URL}car-images/img/from-right-close.png`,
      `${BASE_URL}car-images/img/from-right.png`,
    ],
    interior: [
      `${BASE_URL}car-images/Img-inside.png`,
    ],
    front: [
      `${BASE_URL}car-images/Img-fRONT.png`,
      `${BASE_URL}car-images/Img-From-Head.png`,
      `${BASE_URL}car-images/Img-far-front.png`,
      `${BASE_URL}car-images/front-too-close.png`,
    ],
    detail: [
      `${BASE_URL}car-images/img/from-right-close.png`,
      `${BASE_URL}car-images/front-too-close.png`,
      `${BASE_URL}car-images/Img-From-Head.png`,
    ],
  };

  return imageMapping[viewId] || imageMapping.exterior;
};

export const useViewState = ({
  initialView = "exterior",
  autoRotate = viewerSettings.enableAutoRotate,
  onViewChange,
  onLoadingChange,
}: UseViewStateOptions = {}): UseViewStateReturn => {
  const [currentView, setCurrentView] = useState(initialView);
  const [viewImages, setViewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  
  const autoRotateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedViewsRef = useRef<Set<string>>(new Set());
  const cachedImagesRef = useRef<Record<string, string[]>>({});

  // Get current view configuration
  const currentViewConfig = viewsConfig[currentView] || viewsConfig.exterior;

  // Load images for a view
  const loadViewImages = useCallback(
    async (viewId: string) => {
      // Check if already cached
      if (cachedImagesRef.current[viewId]) {
        setViewImages(cachedImagesRef.current[viewId]);
        setIsLoading(false);
        setLoadingProgress(100);
        return;
      }

      setIsLoading(true);
      setLoadingProgress(0);
      onLoadingChange?.(true);

      const imagePaths = getViewImagePaths(viewId);
      
      try {
        await preloadImages(imagePaths, (progress: LoadingProgress) => {
          setLoadingProgress(progress.percentage);
        });

        cachedImagesRef.current[viewId] = imagePaths;
        loadedViewsRef.current.add(viewId);
        setViewImages(imagePaths);
      } catch (error) {
        console.error(`Failed to load images for view: ${viewId}`, error);
        setViewImages(imagePaths); // Use paths anyway, component will handle missing images
      } finally {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    },
    [onLoadingChange]
  );

  // Change view
  const changeView = useCallback(
    (viewId: string) => {
      if (viewId === currentView || !viewsConfig[viewId]) return;
      
      setCurrentView(viewId);
      onViewChange?.(viewId);
      loadViewImages(viewId);

      // Stop auto-rotate when changing views
      if (isAutoRotating) {
        setIsAutoRotating(false);
      }
    },
    [currentView, isAutoRotating, loadViewImages, onViewChange]
  );

  // Auto-rotate controls
  const startAutoRotate = useCallback(() => {
    setIsAutoRotating(true);
  }, []);

  const stopAutoRotate = useCallback(() => {
    setIsAutoRotating(false);
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
      autoRotateTimeoutRef.current = null;
    }
  }, []);

  const toggleAutoRotate = useCallback(() => {
    if (isAutoRotating) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
  }, [isAutoRotating, startAutoRotate, stopAutoRotate]);

  // Load initial view on mount
  useEffect(() => {
    loadViewImages(initialView);
  }, [initialView, loadViewImages]);

  // Start auto-rotate after delay if enabled
  useEffect(() => {
    if (autoRotate && !isLoading && viewImages.length > 0) {
      autoRotateTimeoutRef.current = setTimeout(() => {
        setIsAutoRotating(true);
      }, viewerSettings.autoRotateDelay);
    }

    return () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
    };
  }, [autoRotate, isLoading, viewImages.length]);

  // Preload other views in background
  useEffect(() => {
    if (!isLoading) {
      const otherViews = Object.keys(viewsConfig).filter(
        (v) => v !== currentView && !loadedViewsRef.current.has(v)
      );

      // Preload one view at a time with delay
      otherViews.forEach((viewId, index) => {
        setTimeout(() => {
          const imagePaths = getViewImagePaths(viewId);
          preloadImages(imagePaths).then(() => {
            cachedImagesRef.current[viewId] = imagePaths;
            loadedViewsRef.current.add(viewId);
          });
        }, (index + 1) * 1000); // Stagger by 1 second
      });
    }
  }, [currentView, isLoading]);

  return {
    currentView,
    currentViewConfig,
    viewImages,
    isLoading,
    loadingProgress,
    isAutoRotating,
    changeView,
    toggleAutoRotate,
    startAutoRotate,
    stopAutoRotate,
  };
};

export default useViewState;
