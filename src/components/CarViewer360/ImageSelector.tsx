import React from "react";

interface ImageSelectorProps {
  images: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  selectedIndex,
  onSelect,
}) => {
  if (images.length <= 1) return null;

  return (
    <div className="flex justify-center gap-2 flex-wrap py-3 px-4">
      <span className="text-xs text-platinum-500 uppercase tracking-wide self-center mr-2">
        Select Image:
      </span>
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`
            relative w-16 h-16 rounded-lg overflow-hidden
            border-2 transition-all duration-300
            ${
              selectedIndex === index
                ? "border-gold shadow-gold-glow scale-105"
                : "border-charcoal-50 hover:border-gold/50 opacity-70 hover:opacity-100"
            }
          `}
          aria-label={`Select image ${index + 1}`}
        >
          <img
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {selectedIndex === index && (
            <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ImageSelector;
