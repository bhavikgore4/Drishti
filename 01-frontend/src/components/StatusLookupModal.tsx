import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertTriangle, UserCheck, Shield, FileText, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../types';

interface StatusLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: LanguageCode;
}

export const StatusLookupModal: React.FC<StatusLookupModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
}) => {
  const [trackingId, setTrackingId] = useState('DRISHTI-2026-94821');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#6B0C36] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base">
              {currentLang === 'hi' ? 'शिकायत की स्थिति देखें' : 'Track Grievance Status'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder="Enter Registration / Tracking ID (e.g. DRISHTI-2026-94821)"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B0C36] font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#002B49] hover:bg-[#001D33] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search size={14} />
                  <span>Check Status</span>
                </>
              )}
            </button>
          </form>

          {/* Search Result Display */}
          {searched && (
            <div className="border border-gray-200 rounded-lg p-4 bg-slate-50 space-y-3 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                    Tracking ID
                  </span>
                  <span className="font-mono font-bold text-gray-900 text-sm">{trackingId}</span>
                </div>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} className="text-amber-700" />
                  <span>IN_PROGRESS (Under Nodal Officer Review)</span>
                </span>
              </div>

              {/* Grievance Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-gray-500 block">AI Auto-Detected Department:</span>
                  <strong className="text-gray-800">Ministry of Labour &amp; Employment (EPFO)</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">AI Confidence Score:</span>
                  <strong className="text-emerald-700">96.4% (High Accuracy)</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Assigned Nodal Officer:</span>
                  <strong className="text-gray-800">Shri R. K. Sharma (Deputy Director)</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Expected Resolution SLA:</span>
                  <strong className="text-blue-800">Remaining 6 Days (Target: 30 Days)</strong>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-2 border-t border-gray-200">
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-2">
                  Timeline / समयरेखा
                </span>
                <div className="flex items-center justify-between text-center relative text-[10px] sm:text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span className="mt-1 font-semibold text-emerald-800">Filed</span>
                  </div>
                  <div className="flex-1 h-1 bg-emerald-500 -mt-3"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span className="mt-1 font-semibold text-emerald-800">AI Routed</span>
                  </div>
                  <div className="flex-1 h-1 bg-amber-400 -mt-3"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold animate-pulse">
                      ●
                    </div>
                    <span className="mt-1 font-semibold text-amber-800">Under Action</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-300 -mt-3"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                      4
                    </div>
                    <span className="mt-1 font-medium text-gray-500">Resolved</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!searched && (
            <div className="text-center py-6 text-gray-500 text-xs sm:text-sm">
              <FileText size={32} className="mx-auto text-gray-400 mb-2" />
              Enter your tracking registration number received via SMS or acknowledgment PDF.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
