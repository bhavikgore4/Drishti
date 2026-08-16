import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  ArrowRight,
  Volume2,
  ShieldCheck,
  FileCheck,
  Radio,
  Sparkles,
  MapPin,
  Flame,
  ThumbsUp,
  User,
  MonitorCheck,
  Building,
  AlertTriangle,
} from 'lucide-react';
import { NationalEmblem } from './NationalEmblem';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface HeroCarouselProps {
  currentLang?: LanguageCode;
  onLodgeClick?: () => void;
  onVoiceBotClick?: () => void;
  onAppealClick?: () => void;
  onProcessClick?: () => void;
  onDisasterClick?: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  currentLang = 'en',
  onLodgeClick,
  onVoiceBotClick,
  onAppealClick,
  onProcessClick,
  onDisasterClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const totalSlides = 5;
  const slideIntervalMs = 5000;

  const t = translations[currentLang]?.hero || translations.en.hero;

  // Automated 5-second rotation
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, slideIntervalMs);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-100 select-none min-h-[320px] sm:min-h-[360px] md:min-h-[410px] lg:min-h-[440px] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Drishti Portal Awareness & Grievance Guidance Banners"
    >
      {/* Slides Container */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* ========================================================================= */}
        {/* SLIDE 1: CITIZEN CENTRIC GOVERNANCE */}
        {/* ========================================================================= */}
        <div className="w-full flex-shrink-0 relative bg-gradient-to-r from-[#DFF2FC] via-[#EBF7FD] to-[#CDE9FA] px-6 sm:px-12 md:px-16 py-8 sm:py-10 flex items-center min-h-[320px] sm:min-h-[360px] md:min-h-[410px] lg:min-h-[440px]">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Typography Block */}
            <div className="md:col-span-6 lg:col-span-6 space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#A01A24] tracking-tight uppercase leading-[1.1] font-sans">
                {t.slide1.title1} <br />
                {t.slide1.title2}
              </h2>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#EA580C] uppercase tracking-wide">
                {t.slide1.connectText}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#002B49] uppercase tracking-tight">
                {t.slide1.subText}
              </div>

              <p className="text-xs sm:text-sm text-gray-700 font-medium max-w-md pt-1 leading-relaxed">
                {t.slide1.desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onLodgeClick}
                  className="bg-[#6B0C36] hover:bg-[#53092A] text-white px-5 py-2 rounded font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-[#8B1A4B]"
                >
                  <span>{t.slide1.lodgeBtn}</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={onProcessClick}
                  className="bg-white/80 hover:bg-white text-[#002B49] border border-gray-300 px-4 py-2 rounded font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
                >
                  {t.slide1.workflowBtn}
                </button>
              </div>
            </div>

            {/* Right Visual Graphic: Citizen Crowd + Arcs + Government National Emblem */}
            <div className="md:col-span-6 lg:col-span-6 flex items-center justify-center relative">
              <div className="relative flex items-center justify-center w-full max-w-[420px] aspect-square">
                {/* Center Citizen Crowd Sphere */}
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden relative z-10 flex items-center justify-center p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-100 via-sky-50 to-indigo-50 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="grid grid-cols-5 gap-1 sm:gap-1.5 p-2 opacity-90">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center justify-center transform hover:scale-110 transition-transform"
                        >
                          <div
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-xs"
                            style={{
                              backgroundColor: [
                                '#EF4444',
                                '#3B82F6',
                                '#10B981',
                                '#F59E0B',
                                '#8B5CF6',
                                '#EC4899',
                                '#14B8A6',
                                '#F97316',
                              ][i % 8],
                            }}
                          >
                            <User size={10} />
                          </div>
                          <div
                            className="w-5 h-2 rounded-t-sm mt-0.5"
                            style={{
                              backgroundColor: [
                                '#DC2626',
                                '#2563EB',
                                '#059669',
                                '#D97706',
                                '#7C3AED',
                              ][i % 5],
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <span className="absolute bottom-2 bg-[#002B49]/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded tracking-widest">
                      {t.slide1.citizensLabel}
                    </span>
                  </div>
                </div>

                {/* Animated Connecting Arcs */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                  viewBox="0 0 400 400"
                >
                  <defs>
                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#003366" />
                      <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 120 120 Q 200 40 280 120"
                    fill="none"
                    stroke="url(#arcGrad)"
                    strokeWidth="3"
                    strokeDasharray="6,6"
                    className="animate-pulse"
                  />
                  <path
                    d="M 120 280 Q 200 360 280 280"
                    fill="none"
                    stroke="url(#arcGrad)"
                    strokeWidth="3"
                    strokeDasharray="6,6"
                    className="animate-pulse"
                  />
                </svg>

                {/* Government National Emblem Orb on the Right */}
                <div className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white border-4 border-amber-500 shadow-2xl flex flex-col items-center justify-center p-2 z-30">
                  <NationalEmblem className="w-12 h-14 sm:w-14 sm:h-18" showMotto={true} />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#A01A24] mt-0.5">
                    {t.slide1.govtLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE 2: VOICE BASED AI BOT */}
        {/* ========================================================================= */}
        <div className="w-full flex-shrink-0 relative bg-gradient-to-r from-[#002244] via-[#003B73] to-[#0A4D8C] text-white px-6 sm:px-12 md:px-16 py-8 sm:py-10 flex items-center min-h-[320px] sm:min-h-[360px] md:min-h-[410px] lg:min-h-[440px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-10 -left-10 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-2.5 sm:space-y-3.5">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                <Sparkles size={12} />
                <span>{t.slide2.badge}</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase leading-snug">
                {t.slide2.titleMain} <br className="hidden sm:inline" />
                <span className="text-amber-300">{t.slide2.titleHighlight}</span>
              </h2>

              <p className="text-base sm:text-xl font-bold text-sky-200 font-serif leading-relaxed">
                {t.slide2.indicPhrase}
              </p>

              <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
                {t.slide2.desc}
              </p>

              {/* Bot Branding Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-[#001D3D] border border-blue-400/40 rounded-lg p-1 pr-3 gap-2">
                  <div className="bg-red-600 text-white p-2 rounded-md shadow-md animate-pulse">
                    <Mic size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-200 font-bold uppercase">{t.slide2.voiceToolBadge}</div>
                    <div className="text-xs sm:text-sm font-black text-white">{t.slide2.voiceToolName}</div>
                  </div>
                </div>

                <button
                  onClick={onVoiceBotClick}
                  className="bg-[#FFB300] hover:bg-[#FFA000] text-gray-900 font-extrabold px-5 py-2.5 rounded-lg text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 size={16} />
                  <span>{t.slide2.startVoiceBtn}</span>
                </button>
              </div>
            </div>

            {/* Right Graphic: AI Bot Voice Visualizer with Indic Characters */}
            <div className="md:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {['अ', 'आ', 'म', 'ज्ञ', 'त', 'ह', 'य', 'श'].map((char, idx) => {
                    const angle = (idx * 360) / 8;
                    const radius = 125;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    return (
                      <div
                        key={idx}
                        className="absolute text-lg sm:text-2xl font-black text-amber-300/80 drop-shadow-md animate-pulse"
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                          animationDelay: `${idx * 0.3}s`,
                        }}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>

                {/* Center AI Soundwave Orb */}
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 p-1.5 shadow-2xl flex items-center justify-center relative z-10 border-2 border-white/40">
                  <div className="w-full h-full rounded-full bg-[#001D3D] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                    <div className="flex items-center gap-1.5 h-10 mb-2">
                      <span className="w-1.5 bg-amber-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-1.5 bg-amber-400 rounded-full h-8 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      <span className="w-1.5 bg-red-500 rounded-full h-10 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 bg-amber-400 rounded-full h-8 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      <span className="w-1.5 bg-amber-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    </div>

                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-300 flex items-center justify-center text-amber-300 mb-1">
                      <Mic size={22} className="animate-pulse" />
                    </div>

                    <span className="text-xs font-black tracking-wider text-white">
                      {t.slide2.liveBot}
                    </span>
                    <span className="text-[10px] text-amber-300 font-medium">
                      {t.slide2.liveSpeech}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE 3: INTRODUCING APPEAL MECHANISM */}
        {/* ========================================================================= */}
        <div className="w-full flex-shrink-0 relative bg-gradient-to-r from-[#F0F7FB] via-[#FFFFFF] to-[#E5F2FB] px-6 sm:px-12 md:px-16 py-8 sm:py-10 flex items-center min-h-[320px] sm:min-h-[360px] md:min-h-[410px] lg:min-h-[440px]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Content */}
            <div className="md:col-span-6 lg:col-span-6 space-y-2 sm:space-y-3">
              <span className="text-base sm:text-xl font-medium text-gray-600 block">
                {t.slide3.intro}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#EA580C] uppercase tracking-tight">
                {t.slide3.title}
              </h2>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#DC2626]">
                {t.slide3.question}
              </div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-[#1D4ED8] leading-snug">
                {t.slide3.opportunity}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium pt-1">
                {t.slide3.desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onAppealClick}
                  className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-5 py-2 rounded font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>{t.slide3.fileAppealBtn}</span>
                </button>
                <button
                  onClick={onAppealClick}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {t.slide3.guidelinesBtn}
                </button>
              </div>
            </div>

            {/* Right Graphic: 3-Step Review Flow Cards */}
            <div className="md:col-span-6 lg:col-span-6 flex items-center justify-center">
              <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full max-w-[460px]">
                {/* Card 1 */}
                <div className="flex-1 bg-white border-2 border-red-400 rounded-xl p-3 sm:p-4 text-center shadow-md flex flex-col items-center w-full">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                    <AlertTriangle size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-800">{t.slide3.step1Title}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    {t.slide3.step1Desc}
                  </span>
                </div>

                <div className="text-gray-400 hidden sm:block">
                  <ArrowRight size={18} />
                </div>

                {/* Card 2 */}
                <div className="flex-1 bg-white border-2 border-purple-500 rounded-xl p-3 sm:p-4 text-center shadow-md flex flex-col items-center w-full">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mb-2">
                    <Building size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-800">{t.slide3.step2Title}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    {t.slide3.step2Desc}
                  </span>
                </div>

                <div className="text-gray-400 hidden sm:block">
                  <ArrowRight size={18} />
                </div>

                {/* Card 3 */}
                <div className="flex-1 bg-white border-2 border-emerald-500 rounded-xl p-3 sm:p-4 text-center shadow-md flex flex-col items-center w-full">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                    <ThumbsUp size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-800">{t.slide3.step3Title}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                    {t.slide3.step3Desc}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE 4: REDRESS PROCESS FLOW */}
        {/* ========================================================================= */}
        <div className="w-full flex-shrink-0 relative bg-gradient-to-r from-[#FFD54F] via-[#FFCA28] to-[#FFC107] px-6 sm:px-12 md:px-16 py-8 sm:py-10 flex items-center min-h-[320px] sm:min-h-[360px] md:min-h-[410px] lg:min-h-[440px]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Content */}
            <div className="md:col-span-6 space-y-2 sm:space-y-3">
              <span className="text-lg sm:text-xl font-bold text-[#8D3B00] block tracking-wide">
                {t.slide4.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#002B49] tracking-tight leading-tight font-sans">
                {t.slide4.title1} <br />
                {t.slide4.title2}
              </h2>
              <p className="text-xs sm:text-sm font-extrabold text-[#C2185B] uppercase tracking-wider">
                {t.slide4.question}
              </p>

              <div className="pt-2">
                <button
                  onClick={onLodgeClick}
                  className="bg-[#002B49] hover:bg-[#001D33] text-white px-6 py-3 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-[#003B73]"
                >
                  <span>{t.slide4.lodgeBtn}</span>
                  <ArrowRight size={16} className="text-amber-400" />
                </button>
              </div>
            </div>

            {/* Right Graphic: 3 Steps */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-[480px]">
                {/* Step 01 */}
                <div className="w-28 sm:w-34 bg-white rounded-xl p-3 shadow-lg border-t-4 border-blue-600 text-center flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-blue-600 leading-none">01</span>
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 my-1.5">
                    <FileCheck size={18} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-gray-800 uppercase leading-tight">
                    {t.slide4.step1}
                  </span>
                </div>

                {/* Step 02 */}
                <div className="w-28 sm:w-34 bg-white rounded-xl p-3 shadow-lg border-t-4 border-indigo-700 text-center flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-indigo-700 leading-none">02</span>
                  <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 my-1.5">
                    <MonitorCheck size={18} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-gray-800 uppercase leading-tight">
                    {t.slide4.step2}
                  </span>
                </div>

                {/* Step 03 */}
                <div className="w-28 sm:w-34 bg-white rounded-xl p-3 shadow-lg border-t-4 border-red-600 text-center flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-red-600 leading-none">03</span>
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 my-1.5">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-gray-800 uppercase leading-tight">
                    {t.slide4.step3}
                  </span>
                </div>
              </div>

              <div className="mt-4 bg-[#002B49] text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-md flex items-center gap-2 tracking-wide text-center">
                <span>{t.slide4.redirectionText}</span>
                <ArrowRight size={14} className="text-amber-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE 5: DISASTER & EMERGENCY GRIEVANCE DESK */}
        {/* ========================================================================= */}
        <div className="w-full flex-shrink-0 relative bg-gradient-to-r from-[#00172D] via-[#002B49] to-[#0A3D62] text-white px-6 sm:px-12 md:px-16 py-8 sm:py-10 flex items-center min-h-[320px] sm:min-h-[360px] md:min-h-[410px] lg:min-h-[440px]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-2.5 sm:space-y-3.5">
              <div className="inline-flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider shadow-xs animate-pulse">
                <Radio size={13} />
                <span>{t.slide5.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                {t.slide5.title1} <br />
                <span className="text-amber-400">{t.slide5.title2}</span>
              </h2>

              <p className="text-sm sm:text-base font-semibold text-gray-200 font-serif">
                {t.slide5.indicPhrase}
              </p>

              <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
                {t.slide5.desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onDisasterClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-red-500"
                >
                  <Flame size={16} />
                  <span>{t.slide5.sosBtn}</span>
                </button>
                <button
                  onClick={onDisasterClick}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin size={14} className="text-amber-400" />
                  <span>{t.slide5.forecastMapBtn}</span>
                </button>
              </div>
            </div>

            {/* Right Graphic: Tactical GIS Radar */}
            <div className="md:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[320px] bg-[#001428]/80 border border-blue-400/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-blue-400/20 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      {t.slide5.hotspotsTitle}
                    </span>
                  </div>
                  <span className="text-[10px] bg-red-900/60 text-red-300 border border-red-700 px-2 py-0.5 rounded font-mono">
                    {t.slide5.activeTriage}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-white/5 p-2 rounded border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">{t.slide5.floodCardTitle}</span>
                      <span className="text-[10px] text-gray-400">{t.slide5.floodCardLoc}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400">{t.slide5.floodCardStatus}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">{t.slide5.cycloneCardTitle}</span>
                      <span className="text-[10px] text-gray-400">{t.slide5.cycloneCardLoc}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">{t.slide5.cycloneCardStatus}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                  <span>{t.slide5.helpline}</span>
                  <span className="text-amber-400 font-semibold">{t.slide5.tollFree}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Left & Right Maroon Chevron Blocks */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#6B0C36] hover:bg-[#53092A] active:bg-[#430722] text-white w-7 sm:w-9 h-14 sm:h-18 flex items-center justify-center shadow-lg transition-all rounded-r cursor-pointer z-30 opacity-90 hover:opacity-100"
        aria-label="Previous Slide"
        title="Previous Slide"
      >
        <ChevronLeft size={22} className="stroke-[3]" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#6B0C36] hover:bg-[#53092A] active:bg-[#430722] text-white w-7 sm:w-9 h-14 sm:h-18 flex items-center justify-center shadow-lg transition-all rounded-l cursor-pointer z-30 opacity-90 hover:opacity-100"
        aria-label="Next Slide"
        title="Next Slide"
      >
        <ChevronRight size={22} className="stroke-[3]" />
      </button>

      {/* Bottom Dash/Line Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-30">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 sm:h-2 transition-all rounded-full cursor-pointer ${
              currentSlide === index
                ? 'w-8 sm:w-10 bg-[#6B0C36] ring-2 ring-white shadow-md'
                : 'w-2.5 sm:w-3.5 bg-gray-400/70 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
};
