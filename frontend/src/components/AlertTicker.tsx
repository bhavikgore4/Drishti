import React from 'react';
import { AlertCircle, ChevronRight, PhoneCall } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface AlertTickerProps {
  currentLang?: LanguageCode;
  onAdvisoryClick?: () => void;
  onEmergencyCallClick?: () => void;
}

export const AlertTicker: React.FC<AlertTickerProps> = ({
  currentLang = 'en',
  onAdvisoryClick,
  onEmergencyCallClick,
}) => {
  const t = translations[currentLang]?.ticker || translations.en.ticker;

  return (
    <div
      className="w-full bg-[#FFF3CD] border-y border-[#FFEEBA] text-[#856404] text-xs py-2 px-3 sm:px-6 select-none overflow-hidden"
      role="region"
      aria-label="Important Advisory Ticker"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        {/* Left Ticker Content */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0 bg-[#E0A800] text-gray-900 px-2 py-0.5 rounded font-black text-[11px] uppercase tracking-wide shadow-2xs">
            <AlertCircle size={13} className="text-gray-950 stroke-[2.5]" />
            <span>{t.advisoryBadge}</span>
          </div>

          <div
            onClick={onAdvisoryClick}
            className="truncate font-medium text-gray-900 hover:text-[#6B0C36] transition-colors cursor-pointer text-xs sm:text-[13px] flex items-center gap-1 group"
          >
            <span className="truncate">{t.mainWarning}</span>
            <ChevronRight
              size={14}
              className="text-[#6B0C36] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Right Emergency Hotline Badge */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={onEmergencyCallClick}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
            title="National Disaster Emergency Triage Cell"
          >
            <PhoneCall size={12} className="animate-pulse" />
            <span className="font-mono">{t.emergencyHotline}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
