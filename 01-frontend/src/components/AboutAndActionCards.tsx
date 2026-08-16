import React from 'react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface AboutAndActionCardsProps {
  currentLang?: LanguageCode;
  onRegisterLogin?: () => void;
  onViewStatus?: () => void;
  onContactUs?: () => void;
  onPdfClick?: (title: string, size: string) => void;
}

export const AboutAndActionCards: React.FC<AboutAndActionCardsProps> = ({
  currentLang = 'en',
  onRegisterLogin,
  onViewStatus,
  onContactUs,
  onPdfClick,
}) => {
  const tAbout = translations[currentLang]?.about || translations.en.about;
  const tWhatsNew = translations[currentLang]?.whatsNew || translations.en.whatsNew;
  const tAction = translations[currentLang]?.actionCards || translations.en.actionCards;

  const handlePdfDownload = (title: string, size: string) => {
    if (onPdfClick) {
      onPdfClick(title, size);
    } else {
      window.alert(`Downloading Official Gazette Circular:\n${title}\nSize: ${size}`);
    }
  };

  return (
    <section className="w-full bg-[#f8f9fa] border-t border-gray-200">
      {/* 1. TWO-COLUMN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Approx 65% width: lg:col-span-8) — ABOUT DRISHTI */}
          <div className="lg:col-span-8 space-y-4 text-gray-800 text-xs sm:text-[13px] leading-relaxed">
            {/* Heading */}
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight uppercase">
              {tAbout.title}
            </h2>

            {/* Paragraph 1 */}
            <p className="text-justify text-gray-700 leading-relaxed">
              {tAbout.para1}
            </p>

            {/* Paragraph 2 */}
            <p className="text-justify text-gray-700 leading-relaxed">
              {tAbout.para2}
            </p>

            {/* Sub-Section: Issues not taken up for redress */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-[#0056B3] font-bold text-xs sm:text-[13px] mb-2">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#0056B3] text-white text-[10px] font-serif font-black">
                  i
                </span>
                <span>{tAbout.notRedressedTitle}</span>
              </div>

              <ul className="space-y-1.5 pl-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold mt-0.5 text-xs">▸</span>
                  <span>{tAbout.notRedressedItem1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold mt-0.5 text-xs">▸</span>
                  <span>{tAbout.notRedressedItem2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold mt-0.5 text-xs">▸</span>
                  <span>{tAbout.notRedressedItem3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold mt-0.5 text-xs">▸</span>
                  <span>
                    {tAbout.notRedressedItem4Prefix}
                    <a
                      href="https://documents.doptcirculars.nic.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0056B3] font-semibold hover:underline"
                    >
                      {tAbout.notRedressedItem4Link}
                    </a>
                    {tAbout.notRedressedItem4Suffix}
                  </span>
                </li>
              </ul>
            </div>

            {/* Sub-Section: Note */}
            <div className="pt-2 space-y-2">
              <div className="font-bold text-gray-900">
                {tAbout.noteTitle}
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-gray-700">
                <li className="pl-1">
                  {tAbout.note1Prefix}
                  <span className="text-[#0056B3] font-semibold">{tAbout.note1OrgText}</span>
                  {tAbout.note1Mid}
                  <button
                    onClick={onContactUs}
                    className="text-[#0056B3] font-bold hover:underline cursor-pointer inline"
                  >
                    {tAbout.note1ClickHere}
                  </button>
                  {tAbout.note1Suffix}
                </li>
                <li className="pl-1">
                  {tAbout.note2}
                </li>
              </ol>
            </div>
          </div>

          {/* Right Column (Approx 35% width: lg:col-span-4) — WHAT'S NEW */}
          <div className="lg:col-span-4 space-y-3">
            {/* Heading */}
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight uppercase">
              {tWhatsNew.title}
            </h2>

            {/* Official PDF Notification Cards Container */}
            <div className="bg-white border border-gray-300 shadow-xs divide-y divide-gray-200">
              
              {/* Box 1 */}
              <div
                onClick={() =>
                  handlePdfDownload(
                    tWhatsNew.card1Title,
                    '1.05 MB'
                  )
                }
                className="flex items-center hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                {/* Date Badge */}
                <div className="w-20 sm:w-24 shrink-0 bg-[#F4F1F8] border-r border-gray-200 p-3 sm:p-4 text-center flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#6B0C36] leading-none font-serif">
                    {tWhatsNew.card1Day}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 italic mt-1 text-center">
                    {tWhatsNew.card1MonthYear}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-3.5 flex-1 text-xs text-gray-800 leading-snug">
                  <span className="group-hover:text-[#6B0C36] group-hover:underline font-medium transition-colors">
                    {tWhatsNew.card1Title}
                  </span>
                </div>
              </div>

              {/* Box 2 */}
              <div
                onClick={() =>
                  handlePdfDownload(
                    tWhatsNew.card2Title,
                    '0.25 MB'
                  )
                }
                className="flex items-center hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                {/* Date Badge */}
                <div className="w-20 sm:w-24 shrink-0 bg-[#F4F1F8] border-r border-gray-200 p-3 sm:p-4 text-center flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#6B0C36] leading-none font-serif">
                    {tWhatsNew.card2Day}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 italic mt-1 text-center">
                    {tWhatsNew.card2MonthYear}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-3.5 flex-1 text-xs text-gray-800 leading-snug">
                  <span className="group-hover:text-[#6B0C36] group-hover:underline font-medium transition-colors">
                    {tWhatsNew.card2Title}
                  </span>
                </div>
              </div>

              {/* Box 3 */}
              <div
                onClick={() =>
                  handlePdfDownload(
                    tWhatsNew.card3Title,
                    '0.78 MB'
                  )
                }
                className="flex items-center hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                {/* Date Badge */}
                <div className="w-20 sm:w-24 shrink-0 bg-[#F4F1F8] border-r border-gray-200 p-3 sm:p-4 text-center flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#6B0C36] leading-none font-serif">
                    {tWhatsNew.card3Day}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 italic mt-1 text-center">
                    {tWhatsNew.card3MonthYear}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-3.5 flex-1 text-xs text-gray-800 leading-snug">
                  <span className="group-hover:text-[#6B0C36] group-hover:underline font-medium transition-colors">
                    {tWhatsNew.card3Title}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 2. THREE BIG ACTION CALLOUT BLOCKS (Bottom Cards Grid) */}
      <div className="w-full bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Block 1: Sky Blue Background #7CC5E8 */}
            <div className="bg-[#7CC5E8] rounded-none p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
              {/* White Circular Badge */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white shadow-md border-4 border-white/60 flex items-center justify-center mb-6">
                <div className="relative flex items-center justify-center">
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="14" y="10" width="36" height="46" rx="4" fill="#0288D1" />
                    <rect x="18" y="14" width="28" height="38" rx="2" fill="#FFFFFF" />
                    <rect x="24" y="6" width="16" height="8" rx="2" fill="#01579B" />
                    <circle cx="32" cy="10" r="2" fill="#FFFFFF" />
                    <rect x="22" y="22" width="20" height="2.5" rx="1" fill="#B0BEC5" />
                    <rect x="22" y="28" width="20" height="2.5" rx="1" fill="#B0BEC5" />
                    <rect x="22" y="34" width="12" height="2.5" rx="1" fill="#B0BEC5" />
                    <circle cx="44" cy="44" r="11" fill="#4CAF50" stroke="#FFFFFF" strokeWidth="2.5" />
                    <path
                      d="M39 44L42.5 47.5L49 41"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Solid Dark Navy Button */}
              <button
                onClick={onRegisterLogin}
                className="w-full max-w-[240px] bg-[#002244] hover:bg-[#00172D] active:scale-98 text-white font-extrabold text-xs sm:text-[13px] tracking-wider uppercase py-3 px-6 rounded-xs shadow-md transition-all cursor-pointer border border-[#00172D]"
              >
                {tAction.card1Btn}
              </button>
            </div>

            {/* Block 2: Pink / Magenta Background #E2799B */}
            <div className="bg-[#E2799B] rounded-none p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
              {/* White Circular Badge */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white shadow-md border-4 border-white/60 flex items-center justify-center mb-6">
                <div className="relative flex items-center justify-center">
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="12" y="12" width="28" height="36" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
                    <line x1="18" y1="20" x2="32" y2="20" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18" y1="26" x2="32" y2="26" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
                    <line x1="18" y1="32" x2="26" y2="32" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="36" cy="30" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
                    <circle cx="36" cy="30" r="10" fill="#E0F2FE" fillOpacity="0.8" />
                    <path
                      d="M32 26C34 24 37 24 39 25"
                      stroke="#0284C7"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M46 40L56 50"
                      stroke="#0F172A"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Solid Dark Navy Button */}
              <button
                onClick={onViewStatus}
                className="w-full max-w-[240px] bg-[#002244] hover:bg-[#00172D] active:scale-98 text-white font-extrabold text-xs sm:text-[13px] tracking-wider uppercase py-3 px-6 rounded-xs shadow-md transition-all cursor-pointer border border-[#00172D]"
              >
                {tAction.card2Btn}
              </button>
            </div>

            {/* Block 3: Beige / Sand Background #F0C988 */}
            <div className="bg-[#F0C988] rounded-none p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
              {/* White Circular Badge */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white shadow-md border-4 border-white/60 flex items-center justify-center mb-6">
                <div className="relative flex items-center justify-center">
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="18" y="10" width="28" height="44" rx="4" fill="#00BCD4" stroke="#00838F" strokeWidth="2.5" />
                    <rect x="21" y="16" width="22" height="32" rx="2" fill="#E0F7FA" />
                    <rect x="28" y="12.5" width="8" height="1.5" rx="0.75" fill="#006064" />
                    <circle cx="32" cy="27" r="5" fill="#E53935" stroke="#FFFFFF" strokeWidth="1.5" />
                    <path
                      d="M25 39C25 34.5 28.5 33.5 32 33.5C35.5 33.5 39 34.5 39 39"
                      fill="#E53935"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <circle cx="46" cy="18" r="7" fill="#FFC107" stroke="#FFFFFF" strokeWidth="1.5" />
                    <path
                      d="M44 18H48M46 16V20"
                      stroke="#374151"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Solid Dark Navy Button */}
              <button
                onClick={onContactUs}
                className="w-full max-w-[240px] bg-[#002244] hover:bg-[#00172D] active:scale-98 text-white font-extrabold text-xs sm:text-[13px] tracking-wider uppercase py-3 px-6 rounded-xs shadow-md transition-all cursor-pointer border border-[#00172D]"
              >
                {tAction.card3Btn}
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
