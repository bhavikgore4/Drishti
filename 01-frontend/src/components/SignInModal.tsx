import React, { useState } from 'react';
import { X, Smartphone, Shield, KeyRound, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';
import emblemLogo from '../assets/images/Lion.jpeg';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: LanguageCode;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
}) => {
  const [tab, setTab] = useState<'citizen' | 'officer' | 'digilocker'>('citizen');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setLoggedIn(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#6B0C36] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={emblemLogo}
              alt="State Emblem of India"
              className="h-10 w-auto shrink-0 object-contain"
            />
            <div>
              <h3 className="font-bold text-sm leading-tight">
                {currentLang === 'hi' ? 'दृष्टि नागरिक एवं अधिकारी लॉगिन' : 'Drishti Single Sign-On'}
              </h3>
              <span className="text-[10px] text-amber-200">Government of India Secure Access</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 text-xs font-semibold bg-gray-50">
          <button
            onClick={() => {
              setTab('citizen');
              setOtpSent(false);
              setLoggedIn(false);
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              tab === 'citizen'
                ? 'border-[#6B0C36] text-[#6B0C36] bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Citizen (OTP)
          </button>
          <button
            onClick={() => {
              setTab('digilocker');
              setOtpSent(false);
              setLoggedIn(false);
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              tab === 'digilocker'
                ? 'border-[#6B0C36] text-[#6B0C36] bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            DigiLocker / eKYC
          </button>
          <button
            onClick={() => {
              setTab('officer');
              setOtpSent(false);
              setLoggedIn(false);
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              tab === 'officer'
                ? 'border-[#6B0C36] text-[#6B0C36] bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Nodal Officer (Parichay)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {loggedIn ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Authentication Successful</h4>
              <p className="text-gray-600 text-xs">
                Welcome to Drishti Portal. Your session has been initiated with full SLA dashboard privileges.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#002B49] text-white py-2.5 rounded-lg font-bold hover:bg-[#001D33] cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          ) : tab === 'citizen' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1 text-xs">
                    Mobile Number (10 Digits) / मोबाइल नंबर
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6B0C36]"
                      required
                    />
                  </div>
                </div>

                <div className="text-[11px] text-gray-500">
                  An OTP will be sent to your registered mobile number for authentication.
                </div>

                <button
                  type="submit"
                  disabled={phone.length < 10}
                  className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-gray-900 font-bold py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Generate OTP</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-[11px] text-amber-900">
                  OTP sent to +91 {phone}. Enter 6-digit code (e.g. 123456):
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1 text-xs">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center tracking-widest text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#6B0C36]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full bg-[#002B49] hover:bg-[#001D33] text-white font-bold py-2.5 rounded-lg shadow transition-colors cursor-pointer disabled:opacity-50"
                >
                  Verify &amp; Enter Portal
                </button>
              </form>
            )
          ) : tab === 'digilocker' ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto">
                <Shield size={24} />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">One-Click DigiLocker eKYC Login</h4>
              <p className="text-xs text-gray-500">
                Instantly authenticate using your Aadhaar or DigiLocker credentials to automatically pre-fill KYC details.
              </p>
              <button
                onClick={() => setLoggedIn(true)}
                className="w-full bg-[#0B4A9E] hover:bg-[#083878] text-white py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <span>Continue with DigiLocker</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoggedIn(true);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-gray-700 font-bold mb-1 text-xs">Parichay / NIC Official Email ID</label>
                <input
                  type="email"
                  placeholder="officer.name@nic.in"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#6B0C36]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1 text-xs">Official Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#6B0C36]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#6B0C36] hover:bg-[#53092A] text-white font-bold py-2.5 rounded-lg shadow transition-colors cursor-pointer"
              >
                Officer Secure Login
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-center text-[10px] text-gray-500">
          Protected by 256-bit encryption. National Informatics Centre (NIC) security certified.
        </div>
      </div>
    </div>
  );
};
