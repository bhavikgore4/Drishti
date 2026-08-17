import React, { useState } from 'react';
import {
  User,
  Lock,
  Shield,
  Eye,
  EyeOff,
  RotateCw,
  ArrowLeft,
  Key,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DigitalIndiaLogo } from './DigitalIndiaLogo';
import { CaptchaBox } from './CaptchaBox';
import { LanguageCode, PageRoute } from '../types';
import emblemLogo from '../assets/images/Lion.jpeg';
import { loginOfficer, AuthUser } from '../api/auth';

interface OfficerLoginPageProps {
  currentLang: LanguageCode;
  onNavigate: (route: PageRoute) => void;
  onOfficerLoginSuccess?: (officer: AuthUser) => void;
}

export const OfficerLoginPage: React.FC<OfficerLoginPageProps> = ({
  currentLang,
  onNavigate,
  onOfficerLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('dTJ3aC');
  const [authError, setAuthError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    securityCode: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(res);
    setSecurityCode('');
  };

  const handleOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true, securityCode: true });

    if (!username.trim() || !password.trim()) {
      setAuthError('Please enter valid Nodal PG Officer credentials.');
      return;
    }

    if (securityCode.trim().toLowerCase() !== captchaValue.toLowerCase()) {
      setAuthError('Security code mismatch. Please re-enter the captcha characters.');
      refreshCaptcha();
      return;
    }

    setAuthError(null);
    setIsSubmitting(true);
    try {
      const officer = await loginOfficer(username, password);
      setSuccessToast(`Nodal Officer session authenticated for ${officer.username || username}.`);
      onOfficerLoginSuccess?.(officer);
      if (!onOfficerLoginSuccess) onNavigate('landing');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Officer login could not be completed.');
      refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParichayLogin = () => {
    setSuccessToast('Connecting to Government of India Single Sign-On (Parichay SSO) Service...');
    setTimeout(() => {
      setSuccessToast('Parichay SSO Verified. Logging in...');
      setTimeout(() => onNavigate('landing'), 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans select-none text-gray-900 bg-white">
      
      {/* Toast Alert Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#002B49] text-white px-4 py-3 rounded-lg shadow-2xl border border-amber-400 flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200 text-xs sm:text-sm">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEFT SIDE (60% width): CYAN/TEAL GEOMETRIC GRAPHIC (Exact Image 3 Layout) */}
      {/* ========================================================================= */}
      <div className="lg:w-[58%] xl:w-[60%] relative bg-gradient-to-br from-[#00A8CC] via-[#0288D1] to-[#004080] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden min-h-[480px] lg:min-h-screen">
        
        {/* Geometric Polygon Overlay Shapes matching Image 3 */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
            <polygon points="0,0 400,0 200,400" fill="#FFFFFF" fillOpacity="0.15" />
            <polygon points="200,400 600,200 400,800" fill="#002B49" fillOpacity="0.3" />
            <polygon points="400,0 800,0 800,500" fill="#FFFFFF" fillOpacity="0.1" />
            <polygon points="0,400 400,800 0,800" fill="#001428" fillOpacity="0.4" />
          </svg>
        </div>

        {/* Top Bar: Ministry Header & Digital India Logo */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Official Emblem + Ministry Title */}
          <div className="flex items-center gap-3">
            <div className="bg-white/90 p-1.5 rounded-lg shadow-md shrink-0">
              <img
                src={emblemLogo}
                alt="State Emblem of India"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-sky-100">
                GOVERNMENT OF INDIA
              </div>
              <div className="text-xs sm:text-sm font-black uppercase tracking-tight text-white leading-tight">
                DEPARTMENT OF ADMINISTRATIVE REFORMS &amp; PUBLIC GRIEVANCES
              </div>
            </div>
          </div>

          {/* Digital India Brand Logo */}
          <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-md shrink-0">
            <DigitalIndiaLogo className="h-8" />
          </div>
        </div>

        {/* Center Graphic & Headline (Image 3 exact text and badge) */}
        <div className="relative z-10 my-10 lg:my-auto space-y-4 max-w-2xl">
          
          {/* Black Pill Badge "DRISHTI" */}
          <div className="inline-block bg-black/85 backdrop-blur-xs text-white px-5 py-2 rounded-md shadow-xl border border-white/20">
            <span className="text-2xl sm:text-3xl font-serif font-black tracking-wider block">
              DRISHTI
            </span>
          </div>

          {/* Subtitle */}
          <div className="text-xs sm:text-sm font-semibold text-sky-100 tracking-wide">
            Centralized Public Grievance Redress And Monitoring System
          </div>

          {/* Huge White Bold Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.1] font-sans drop-shadow-md">
            SINGLE WINDOW INTERFACE FOR GRIEVANCE REDRESSAL OFFICERS AND APPELLATE AUTHORITIES
          </h1>

        </div>

        {/* Bottom Utility Links & NIC Accreditation (Image 3 bottom bar) */}
        <div className="relative z-10 space-y-4 pt-6">
          
          {/* Dark Bar Links */}
          <div className="bg-[#001D33]/90 backdrop-blur-xs px-4 py-2.5 rounded text-[11px] sm:text-xs text-gray-200 flex flex-wrap items-center justify-between gap-2 border border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="hover:text-amber-300 transition-colors cursor-pointer">DARPG WEBSITE</span>
              <span>|</span>
              <span className="hover:text-amber-300 transition-colors cursor-pointer">NATIONAL PORTAL OF INDIA</span>
              <span>|</span>
              <span className="hover:text-amber-300 transition-colors cursor-pointer">DISCLAIMER</span>
            </div>

            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1 text-amber-300 hover:text-white font-bold transition-colors cursor-pointer ml-auto"
            >
              <ArrowLeft size={13} />
              <span>Back to Citizen Portal</span>
            </button>
          </div>

          {/* Copyright & NIC Accreditation Box */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-sky-200">
            <div>
              Copyright &copy; 2026 | All rights reserved
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-sky-100 tracking-wider">
                DESIGN, DEVELOPED, HOSTED &amp; MAINTAINED BY
              </span>
              <div className="bg-[#002B49] text-white px-2 py-1 rounded font-black text-xs flex items-center gap-1 border border-sky-400/40">
                <span className="text-amber-400 font-serif">NIC</span>
                <span className="text-[8px] font-sans text-sky-200 leading-tight">National<br />Informatics<br />Centre</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE (40% width): OFFICE LOGIN FORM (Exact Image 3 Layout) */}
      {/* ========================================================================= */}
      <div className="lg:w-[42%] xl:w-[40%] bg-[#F8FAFC] p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200">
          
          {/* Top Title: "OFFICE LOGIN" in bold blue */}
          <div className="text-center sm:text-left pb-4 border-b border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0056B3] tracking-tight uppercase font-sans">
              OFFICE LOGIN
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Authorized PG Nodal Officers &amp; Appellate Authorities Only
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          {/* Office Login Form */}
          <form onSubmit={handleOfficerLogin} className="mt-5 space-y-4">
            
            {/* Username Input with User Icon */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                  placeholder="Enter Username"
                  className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                    touched.username && !username.trim()
                      ? 'border-red-500 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {touched.username && !username.trim() && (
                <span className="text-[11px] text-red-600 block mt-1">Please enter officer username / Gov email.</span>
              )}
            </div>

            {/* Password Input with Lock Icon + Eye Toggle */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                    touched.password && !password.trim()
                      ? 'border-red-500 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setSuccessToast('Password reset link sent to NIC Government Webmail.')}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Captcha Box & Security Code (Image 3 exact layout) */}
            <div className="space-y-2">
              {/* Captcha Display with "Not readable? click here" */}
              <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 rounded-lg p-2">
                <div className="px-3 py-1 bg-amber-100/80 border border-amber-300 rounded font-mono font-black text-lg tracking-widest text-gray-900 select-none">
                  {captchaValue}
                </div>

                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="text-xs text-gray-700 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Not readable? click here</span>
                  <RotateCw size={13} className="text-blue-600" />
                </button>
              </div>

              {/* Security Code Input with Shield Icon */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Shield size={18} />
                </div>
                <input
                  type="text"
                  value={securityCode}
                  onChange={(e) => {
                    setSecurityCode(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, securityCode: true }))}
                  placeholder="Enter Security Code"
                  className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                    touched.securityCode && !securityCode.trim()
                      ? 'border-red-500 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Blue Login Button (Image 3 gradient blue styling) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#0288D1] to-[#0056B3] hover:from-[#0277BD] hover:to-[#004080] active:scale-98 text-white font-black text-sm py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Login
            </button>

            {/* Blue Notice Alert Box (Exact Image 3 Notice) */}
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs flex items-start gap-2 leading-relaxed">
              <Info size={16} className="shrink-0 text-sky-700 mt-0.5" />
              <span>
                <strong>Please update your Email-ID and Mobile Number after LOGIN.</strong>
              </span>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-bold">OR</span>
              </div>
            </div>

            {/* LOGIN with PARICHAY Single Sign-On Button (Image 3 exact box) */}
            <button
              type="button"
              onClick={handleParichayLogin}
              className="w-full border-2 border-sky-500 hover:border-sky-600 bg-white hover:bg-sky-50/50 p-2.5 rounded-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-1.5">
                <div className="bg-[#002B49] text-white p-1.5 rounded">
                  <Key size={18} className="text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">
                    LOGIN with
                  </span>
                  <span className="text-base font-black text-[#002B49] tracking-wider font-sans group-hover:text-blue-700 transition-colors">
                    PARICHAY
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-mono ml-auto">
                Single. Simplified. Safe
              </span>
            </button>

            {/* Support Desk Footer (Image 3 footer text) */}
            <div className="pt-2 text-center text-[11px] text-gray-500 leading-normal">
              For any technical issue related to DRISHTI portal, please write to us at:{' '}
              <span className="font-semibold text-blue-800 font-mono">
                cpgrams-darpg[at]nic[dot]in
              </span>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};
