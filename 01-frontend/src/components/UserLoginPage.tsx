import React, { useState } from 'react';
import drishtiAvatarImg from '../assets/images/drishti_ai_assistant_1786832073964.jpg';
import {
  Laptop,
  Globe,
  ChevronDown,
  Mic,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  User,
  Lock,
  Smartphone,
  Sparkles,
  ArrowLeft,
  Headphones,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CSCLogo } from './DigitalIndiaLogo';
import { CaptchaBox } from './CaptchaBox';
import { LanguageCode, PageRoute } from '../types';
import { translations } from '../i18n/translations';
import emblemLogo from '../assets/images/Lion.jpeg';
import { loginCitizen, AuthUser } from '../api/auth';

interface UserLoginPageProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigate: (route: PageRoute) => void;
  onLoginSuccess?: (user: AuthUser) => void;
}

export const UserLoginPage: React.FC<UserLoginPageProps> = ({
  currentLang,
  onLanguageChange,
  onNavigate,
  onLoginSuccess,
}) => {
  // Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Validation errors
  const [touched, setTouched] = useState({
    identifier: false,
    password: false,
    otp: false,
    securityCode: false,
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Captcha text state
  const [captchaValue, setCaptchaValue] = useState('2ZX3gY');
  
  // Announcement Carousel state
  const [activeSlide, setActiveSlide] = useState(0);

  // Language Dropdown state
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(result);
    setSecurityCode('');
  };

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      setTouched((prev) => ({ ...prev, identifier: true }));
      return;
    }
    setOtpSent(true);
    setSuccessToast(`One-Time Password (OTP) sent to ${identifier}. Valid for 10 minutes.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      identifier: true,
      password: !isOtpMode,
      otp: isOtpMode,
      securityCode: true,
    });

    if (!identifier.trim()) return;
    if (!isOtpMode && !password.trim()) return;
    if (isOtpMode && !otp.trim()) return;
    if (securityCode.trim().toLowerCase() !== captchaValue.toLowerCase()) {
      setAuthError('Invalid Security Code. Please enter the characters shown in the image.');
      refreshCaptcha();
      return;
    }

    if (isOtpMode) {
      setAuthError('OTP login is not available on the backend yet. Please use password login.');
      return;
    }
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const user = await loginCitizen(identifier, password);
      setSuccessToast(`Welcome, ${user.name}! Logging into Drishti Portal...`);
      onLoginSuccess?.(user);
      if (!onLoginSuccess) onNavigate('landing');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login could not be completed.');
      refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const slides = [
    {
      badge: 'OFFICIAL AI GRIEVANCE ASSISTANT',
      headline: 'INTRODUCING NEW DRISHTI AI CHATBOT',
      desc: 'Now the Grievance can be lodged just by Voice based Utility tool. Currently, Supports all 22 Eighth Schedule Indian languages.',
      sub: 'Multilingual real-time speech transcription with instant grievance docket allocation.',
      helper: 'DRISHTI AI',
      sublabel: 'DRISHTI MITRA',
    },
    {
      badge: 'REGIONAL SPEECH-TO-TEXT',
      headline: 'VOICE-ENABLED REDRESSAL DESK',
      desc: 'Speak naturally in Hindi, Marathi, Bengali, Tamil, Telugu, or English to auto-triage civic grievances.',
      sub: 'Zero typing required with automatic district department tagging.',
      helper: 'DRISHTI VOICE',
      sublabel: 'VOICE ASSISTANT',
    },
    {
      badge: 'FAST-TRACK APPELLATE REVIEW',
      headline: 'TRANSPARENT APPELLATE ESCALATION',
      desc: 'Dissatisfied with grievance redressal? File a direct one-click appeal to Nodal Appellate Authorities.',
      sub: 'Transparent 30-day statutory time-bound tracking and live status updates.',
      helper: 'DRISHTI APPEAL',
      sublabel: 'APPELLATE DESK',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans select-none">
      {/* Top Header Navigation Bar (Exact Image 1 Header) */}
      <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Official Emblem + Department Title + Drishti Brand */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
            title="Go to Drishti Home"
          >
            <img
              src={emblemLogo}
              alt="State Emblem of India"
              className="h-16 w-auto object-contain"
            />
            <div className="border-l border-gray-300 pl-3">
              <div className="text-[11px] sm:text-xs text-gray-700 font-serif leading-tight">
                प्रशासनिक सुधार और लोक शिकायत विभाग
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-red-900 tracking-wider uppercase">
                DEPARTMENT OF
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#002B49] uppercase tracking-tight">
                ADMINISTRATIVE REFORMS &amp; PUBLIC GRIEVANCES
              </div>
            </div>

            <div className="hidden sm:block ml-3 pl-3 border-l-2 border-amber-500">
              <span className="text-xl sm:text-2xl font-black text-[#002B49] tracking-wider font-sans group-hover:text-[#6B0C36] transition-colors">
                DRISHTI
              </span>
            </div>
          </div>

          {/* Right: PG Officer Login CTA + Digital Seva Connect + Language Dropdown */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* PG OFFICER LOGIN Button (Image 1 top right) */}
            <button
              onClick={() => onNavigate('officer-login')}
              className="bg-[#1F5488] hover:bg-[#163F67] text-white px-3 sm:px-4 py-2 rounded-md font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer border border-[#163F67]"
              title="Switch to Nodal PG Officer Login Portal"
            >
              <Laptop size={15} className="text-amber-300 shrink-0" />
              <span className="tracking-wide">PG OFFICER LOGIN</span>
            </button>

            {/* DIGITAL SEVA CONNECT (CSC) */}
            <button
              onClick={() => setSuccessToast('Redirecting to Digital Seva (CSC) Connect Portal...')}
              className="bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-800 px-3 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 border border-gray-300 shadow-2xs transition-colors cursor-pointer"
            >
              <CSCLogo />
            </button>

            {/* Language Selector Dropdown (Strictly 3 Languages) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-xs bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 px-3 py-2 rounded-md transition-colors cursor-pointer shadow-2xs font-medium"
              >
                <Globe size={14} className="text-amber-600" />
                <span className="font-bold text-[#6B0C36]">
                  {currentLang === 'en' ? 'English' : currentLang === 'hi' ? 'हिन्दी' : 'मराठी'}
                </span>
                <ChevronDown size={13} className={`text-gray-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white text-gray-800 rounded-md shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      onLanguageChange('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-amber-50 cursor-pointer ${
                      currentLang === 'en' ? 'bg-amber-100/70 font-bold text-[#6B0C36]' : ''
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('hi');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-amber-50 cursor-pointer ${
                      currentLang === 'hi' ? 'bg-amber-100/70 font-bold text-[#6B0C36]' : ''
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('mr');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-amber-50 cursor-pointer ${
                      currentLang === 'mr' ? 'bg-amber-100/70 font-bold text-[#6B0C36]' : ''
                    }`}
                  >
                    मराठी
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
        {/* Subtle Tech Dot Pattern Background as in Image 1 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* Toast Alert Notification */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 bg-[#002B49] text-white px-4 py-3 rounded-lg shadow-2xl border border-amber-400 flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200 text-xs sm:text-sm">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: INTRODUCING NEW DRISHTI AI CHATBOT ANNOUNCEMENT CARD */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white/90 backdrop-blur-xs border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              
              {/* Back to Home Link */}
              <button
                onClick={() => onNavigate('landing')}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6B0C36] font-semibold mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Drishti Home</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                
                {/* Realistic Indian AI Assistant Portrait (Namaste Greeting with ID Card Lanyard) */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-40 h-52 sm:w-44 sm:h-56 rounded-2xl bg-gradient-to-b from-slate-50 to-amber-50/60 border border-gray-200 shadow-md flex flex-col items-center justify-between overflow-hidden relative group">
                    
                    {/* Realistic Avatar Image */}
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-gray-100">
                      <img
                        src={drishtiAvatarImg}
                        alt="Drishti AI Official Grievance Assistant"
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Subtle gradient vignette at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Sub-label Under Avatar Image */}
                    <div className="absolute bottom-2 inset-x-2 flex justify-center">
                      <span className="bg-[#002B49]/95 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-md border border-amber-400/40 text-center">
                        {slides[activeSlide].helper}
                      </span>
                    </div>
                  </div>

                  {/* Sub-caption below card */}
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block"></span>
                    {slides[activeSlide].sublabel}
                  </span>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  {/* Top Sub-badge: OFFICIAL AI GRIEVANCE ASSISTANT */}
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 shadow-2xs">
                      <Headphones size={16} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#002B49] bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/60">
                      {slides[activeSlide].badge}
                    </span>
                  </div>

                  {/* Headline: INTRODUCING NEW DRISHTI AI CHATBOT */}
                  <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-gray-900 tracking-tight leading-tight pt-1">
                    {slides[activeSlide].headline}
                  </h2>

                  {/* Description text */}
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-snug">
                    {slides[activeSlide].desc}
                  </p>

                  <p className="text-xs text-gray-500 leading-normal">
                    {slides[activeSlide].sub}
                  </p>

                  {/* Red Microphone Floating Button CTA */}
                  <div className="pt-3 flex items-center justify-center sm:justify-start gap-3">
                    <button
                      onClick={() => setSuccessToast('Drishti Voice Assistant is listening... Speak your grievance.')}
                      className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-lg hover:shadow-red-500/40 transition-all cursor-pointer border-2 border-white"
                      title="Activate Voice Lodging"
                    >
                      <Mic size={22} className="animate-pulse" />
                    </button>
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                      Click mic to speak grievance
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Carousel Controls: < > and Dots */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                    className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                    className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                    aria-label="Next Slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* 3 Pagination Indicator Dots */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeSlide === i ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: USER LOGIN CARD (Exact Image 1 Layout) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 w-full max-w-md">
              
              {/* Card Header: "User Login" + "Login with OTP" Toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-sans">
                  User Login
                </h1>

                <button
                  type="button"
                  onClick={() => {
                    setIsOtpMode(!isOtpMode);
                    setAuthError(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gray-400 hover:border-gray-600 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  {isOtpMode ? 'Login with Password' : 'Login with OTP'}
                </button>
              </div>

              {/* Server/Auth Error Box */}
              {authError && (
                <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                
                {/* 1. Mobile No / Email Id / Username Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Mobile No/Email Id/Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, identifier: true }))}
                      placeholder="Mobile No/Email Id/Username"
                      className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                        touched.identifier && !identifier.trim()
                          ? 'border-red-500 focus:ring-red-300 bg-red-50/30'
                          : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    {touched.identifier && !identifier.trim() ? (
                      <span className="text-red-600 font-medium">
                        Enter Mobile No/Email Id/Username.
                      </span>
                    ) : (
                      <span></span>
                    )}

                    <button
                      type="button"
                      onClick={() => setSuccessToast('Redirecting to Username recovery verification...')}
                      className="text-blue-700 hover:text-blue-900 font-medium hover:underline cursor-pointer ml-auto"
                    >
                      Forgot Username
                    </button>
                  </div>
                </div>

                {/* 2. Password or OTP Field */}
                {!isOtpMode ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                        placeholder="Password"
                        className={`w-full px-3 py-2 pr-9 bg-gray-50 border rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                          touched.password && !password.trim()
                            ? 'border-red-500 focus:ring-red-300 bg-red-50/30'
                            : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      {touched.password && !password.trim() ? (
                        <span className="text-red-600 font-medium">Enter Password.</span>
                      ) : (
                        <span></span>
                      )}

                      <button
                        type="button"
                        onClick={() => setSuccessToast('OTP reset link sent to your registered mobile number.')}
                        className="text-blue-700 hover:text-blue-900 font-medium hover:underline cursor-pointer ml-auto"
                      >
                        Forgot Password
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        onBlur={() => setTouched((prev) => ({ ...prev, otp: true }))}
                        placeholder="••••••"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 tracking-widest font-mono text-center focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Security Code (Captcha with exact image display) */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Security code
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={securityCode}
                        onChange={(e) => {
                          setSecurityCode(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                        onBlur={() => setTouched((prev) => ({ ...prev, securityCode: true }))}
                        placeholder="Security code"
                        className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                          touched.securityCode && !securityCode.trim()
                            ? 'border-red-500 focus:ring-red-300'
                            : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <CaptchaBox
                        captchaText={captchaValue}
                        onRefresh={refreshCaptcha}
                        showAudio={true}
                      />
                    </div>
                  </div>

                  {touched.securityCode && !securityCode.trim() && (
                    <div className="text-[11px] text-red-600 font-medium mt-1">
                      Enter Security Code.
                    </div>
                  )}
                </div>

                {/* Blue Login Action Button (Image 1) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-bold text-sm py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
                >
                  Login
                </button>

                {/* Bottom Sign-Up Link (Navigates to Image 2) */}
                <div className="text-center pt-3 text-xs text-gray-600">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer"
                  >
                    Click here to sign up
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Standard Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-3 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DRISHTI — Disaster &amp; Public Grievance Management System (CPGRAMS Aligned)</span>
          <div className="flex items-center gap-3 text-[11px]">
            <button onClick={() => onNavigate('landing')} className="hover:underline text-gray-600">
              Home
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('officer-login')} className="hover:underline text-blue-700 font-semibold">
              Officer Portal
            </button>
            <span>•</span>
            <span>NIC / DARPG Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
