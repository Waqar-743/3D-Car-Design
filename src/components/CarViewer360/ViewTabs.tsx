import React from "react";
import { viewsConfig } from "../../utils/config";

interface ViewTabsProps {
  activeView: string;
  onViewChange: (viewId: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export const ViewTabs: React.FC<ViewTabsProps> = ({
  activeView,
  onViewChange,
  disabled = false,
  compact = false,
}) => {
  const views = Object.entries(viewsConfig);

  if (compact) {
    return (
      <div className="flex gap-1">
        {views.map(([viewId, config]) => (
          <button
            key={viewId}
            onClick={() => onViewChange(viewId)}
            disabled={disabled}
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center
              transition-all duration-300
              ${activeView === viewId 
                ? "bg-gold text-charcoal" 
                : "text-platinum hover:bg-charcoal-100 hover:text-gold"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            aria-label={`View ${config.label}`}
            aria-pressed={activeView === viewId}
            title={config.label}
          >
            <span className="text-lg" aria-hidden="true">
              {config.icon}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-0">
      {views.map(([viewId, config]) => (
        <button
          key={viewId}
          onClick={() => onViewChange(viewId)}
          disabled={disabled}
          className={`
            tab-button
            flex items-center gap-2
            min-w-[100px] sm:min-w-[120px]
            ${activeView === viewId ? "active" : ""}
          `}
          aria-label={`View ${config.label}`}
          aria-pressed={activeView === viewId}
        >
          <span className="text-lg" aria-hidden="true">
            {config.icon}
          </span>
          <span className="hidden sm:inline">{config.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;
