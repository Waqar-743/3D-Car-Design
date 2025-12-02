// Image loader utility for preloading and caching images

export interface LoadingProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type ProgressCallback = (progress: LoadingProgress) => void;

/**
 * Preload a single image and return a promise
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Preload multiple images with progress tracking
 */
export const preloadImages = async (
  imageSources: string[],
  onProgress?: ProgressCallback
): Promise<HTMLImageElement[]> => {
  const total = imageSources.length;
  let loaded = 0;
  const images: HTMLImageElement[] = [];

  const loadPromises = imageSources.map(async (src, index) => {
    try {
      const img = await preloadImage(src);
      loaded++;
      
      if (onProgress) {
        onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100),
        });
      }
      
      images[index] = img;
      return img;
    } catch (error) {
      console.warn(`Failed to load image: ${src}`);
      // Create a placeholder for failed images
      const placeholder = new Image();
      placeholder.src = createPlaceholderDataUrl();
      images[index] = placeholder;
      loaded++;
      
      if (onProgress) {
        onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100),
        });
      }
      
      return placeholder;
    }
  });

  await Promise.all(loadPromises);
  return images;
};

/**
 * Generate image paths for a view
 */
export const generateImagePaths = (
  basePath: string,
  viewPath: string,
  frameCount: number,
  extension: string = "png"
): string[] => {
  const paths: string[] = [];
  for (let i = 1; i <= frameCount; i++) {
    paths.push(`${basePath}${viewPath}car-${viewPath.replace("/", "")}-${i}.${extension}`);
  }
  return paths;
};

/**
 * Create a placeholder data URL for failed images
 */
export const createPlaceholderDataUrl = (): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  
  if (ctx) {
    // Dark background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, 400, 400);
    
    // Gold border
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 380, 380);
    
    // Text
    ctx.fillStyle = "#d4af37";
    ctx.font = "24px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Image Not Available", 200, 200);
  }
  
  return canvas.toDataURL();
};

/**
 * Image cache manager
 */
class ImageCache {
  private cache: Map<string, HTMLImageElement> = new Map();

  get(key: string): HTMLImageElement | undefined {
    return this.cache.get(key);
  }

  set(key: string, image: HTMLImageElement): void {
    this.cache.set(key, image);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const imageCache = new ImageCache();

/**
 * Preload view images with caching
 */
export const preloadViewImages = async (
  viewId: string,
  imagePaths: string[],
  onProgress?: ProgressCallback
): Promise<HTMLImageElement[]> => {
  // Check cache first
  const cachedImages = imagePaths
    .map((path) => imageCache.get(`${viewId}-${path}`))
    .filter((img): img is HTMLImageElement => img !== undefined);

  if (cachedImages.length === imagePaths.length) {
    // All images cached
    onProgress?.({ loaded: imagePaths.length, total: imagePaths.length, percentage: 100 });
    return cachedImages;
  }

  // Load images
  const images = await preloadImages(imagePaths, onProgress);
  
  // Cache them
  images.forEach((img, index) => {
    imageCache.set(`${viewId}-${imagePaths[index]}`, img);
  });

  return images;
};
