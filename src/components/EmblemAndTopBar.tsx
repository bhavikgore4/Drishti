import React from 'react';
import { Home, Phone, Info, HelpCircle, Network, Map } from 'lucide-react';
import { NationalEmblem } from './NationalEmblem';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface EmblemAndTopBarProps {
  currentLang?: LanguageCode;
  onQuickLinkClick?: (key: string) => void;
  onFontSizeChange?: (scale: 'small' | 'normal' | 'large') => void;
  onLogoClick?: () => void;
}

export const EmblemAndTopBar: React.FC<EmblemAndTopBarProps> = ({
  currentLang = 'en',
  onQuickLinkClick,
  onFontSizeChange,
  onLogoClick,
}) => {
  const t = translations[currentLang]?.topBar || translations.en.topBar;

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Topmost Maroon Strip */}
      <div className="w-full bg-[#6B0C36] text-white text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5">
          {/* Dual-language Government of India Header */}
          <div className="flex items-center space-x-2 text-center md:text-left">
            <div className="leading-tight">
              <div className="font-semibold tracking-wide flex items-center gap-1.5 justify-center md:justify-start">
                <span>{t.govtOfIndia}</span>
                <span className="opacity-60">|</span>
                <span className="opacity-95">{t.ministry}</span>
              </div>
              <div className="text-[11px] text-gray-200 font-light tracking-wider flex items-center gap-1.5 justify-center md:justify-start">
                <span>Government of India</span>
                <span className="opacity-60">|</span>
                <span>Ministry of Personnel, Public Grievances &amp; Pensions</span>
              </div>
            </div>
          </div>

          {/* Quick Utility Links (Home, Contact Us, About Us, FAQs, Site Map, Forecast Map) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 text-[11px] sm:text-xs">
            <button
              onClick={() => onQuickLinkClick?.('home')}
              className="flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              title="Portal Home"
            >
              <Home size={12} className="shrink-0" />
              <span>{t.home}</span>
            </button>
            <span className="opacity-40">|</span>

            <button
              onClick={() => onQuickLinkClick?.('contact')}
              className="flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              title="Helpline & Contact"
            >
              <Phone size={12} className="shrink-0" />
              <span>{t.contactUs}</span>
            </button>
            <span className="opacity-40">|</span>

            <button
              onClick={() => onQuickLinkClick?.('about')}
              className="flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              title="About Drishti Portal"
            >
              <Info size={12} className="shrink-0" />
              <span>{t.aboutUs}</span>
            </button>
            <span className="opacity-40">|</span>

            <button
              onClick={() => onQuickLinkClick?.('faqs')}
              className="flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              title="Frequently Asked Questions & Help"
            >
              <HelpCircle size={12} className="shrink-0" />
              <span>{t.faqs}</span>
            </button>
            <span className="opacity-40">|</span>

            <button
              onClick={() => onQuickLinkClick?.('sitemap')}
              className="flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              title="Site Map Directory"
            >
              <Network size={12} className="shrink-0" />
              <span>{t.siteMap}</span>
            </button>
            <span className="opacity-40">|</span>

            <button
              onClick={() => onQuickLinkClick?.('forecast')}
              className="flex items-center gap-1 bg-amber-400/20 hover:bg-amber-400/30 px-2 py-0.5 rounded text-amber-200 hover:text-amber-100 font-medium transition-colors cursor-pointer border border-amber-300/30"
              title="GIS Forecast & Disaster Density Map"
            >
              <Map size={12} className="shrink-0 text-amber-300" />
              <span>{t.forecastMap}</span>
            </button>

            {/* Accessibility Quick Controls (A- / A / A+) */}
            <div className="hidden lg:flex items-center ml-2 pl-2 border-l border-white/20 gap-1 text-[10px]">
              <button
                onClick={() => onFontSizeChange?.('small')}
                className="px-1 hover:bg-white/20 rounded cursor-pointer"
                title={t.decreaseFont}
              >
                A-
              </button>
              <button
                onClick={() => onFontSizeChange?.('normal')}
                className="px-1 hover:bg-white/20 rounded font-bold cursor-pointer"
                title={t.resetFont}
              >
                A
              </button>
              <button
                onClick={() => onFontSizeChange?.('large')}
                className="px-1 hover:bg-white/20 rounded cursor-pointer"
                title={t.increaseFont}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Emblem Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Exact Official Ashoka Stambh Emblem + Ministry & Department Title */}
        <div
          onClick={onLogoClick}
          className={`flex items-center gap-3.5 sm:gap-5 text-center md:text-left ${
            onLogoClick ? 'cursor-pointer group' : ''
          }`}
          title={onLogoClick ? 'Go to Drishti Home' : undefined}
        >
          <div className="shrink-0 py-1">
            <NationalEmblem className="w-16 h-20 sm:w-20 sm:h-24" showMotto={true} />
          </div>
          <div className="border-l border-gray-300 pl-3.5 sm:pl-4">
            <h2 className="text-gray-800 font-bold text-sm sm:text-base font-serif tracking-tight leading-tight">
              {t.deptHindi}
            </h2>
            <h3 className="text-xs sm:text-[13px] font-bold text-red-900 tracking-wider uppercase mt-0.5">
              {t.deptEnPrefix}
            </h3>
            <h1 className="text-base sm:text-xl font-black text-[#002B49] tracking-tight leading-tight uppercase font-sans group-hover:text-[#6B0C36] transition-colors">
              {t.deptName}
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium tracking-wide mt-0.5">
              {t.portalSubtitle}
            </p>
          </div>
        </div>

        {/* Right Side: DRISHTI Brand Badge */}
        <div
          onClick={onLogoClick}
          className={`flex flex-col items-center md:items-end ${onLogoClick ? 'cursor-pointer' : ''}`}
          title={onLogoClick ? 'Go to Drishti Home' : undefined}
        >
          <div className="bg-[#003366] text-white px-5 py-2.5 rounded-lg shadow-md border-b-4 border-amber-500 text-center flex flex-col items-center justify-center min-w-[220px]">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-white drop-shadow-xs">
                {t.drishtiBadge}
              </span>
              <span className="bg-amber-500 text-[#002B49] text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-widest shadow-xs">
                AI 2.0
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-blue-100 text-center block mt-0.5 max-w-[280px] leading-tight">
              {t.drishtiSub}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium tracking-wider mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            {t.complianceTag}
          </span>
        </div>
      </div>
    </header>
  );
};
