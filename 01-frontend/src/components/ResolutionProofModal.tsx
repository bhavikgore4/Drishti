import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Building,
  Calendar,
  UserCheck,
  FileCheck2,
  Download,
  MapPin,
  ShieldCheck,
  ExternalLink,
  ZoomIn,
  Eye,
  AlertCircle,
  Share2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ResolutionProofInfo } from '../types';
import beforeImg from '../assets/images/before.jpg';
import afterImg from '../assets/images/after.jpg';

interface ResolutionProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  docketNumber: string;
  issueTitle: string;
  category?: string;
  location?: string;
  proofData?: ResolutionProofInfo;
  onNotify?: (msg: string) => void;
}

const DEFAULT_PROOF_IMAGE = afterImg;

export const ResolutionProofModal: React.FC<ResolutionProofModalProps> = ({
  isOpen,
  onClose,
  docketNumber,
  issueTitle,
  category = 'Urban Flooding & Blocked Drainage',
  location = 'Dharampeth Zone No. 8, Nagpur',
  proofData,
  onNotify,
}) => {
  const [activeImageTab, setActiveImageTab] = useState<'after' | 'before'>('after');
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  const data: ResolutionProofInfo = proofData || {
    proofImageUrl: DEFAULT_PROOF_IMAGE,
    afterImage: afterImg,
    beforeImage: beforeImg,
    department: 'Municipal Public Works Department',
    resolvedDate: '02-08-2026 at 05:00 PM',
    verifiedBy: 'Municipal Public Works Department',
    workDone:
      'Drainage line cleared and completely covered with concrete slabs and iron grates. Road surface repaved with concrete.',
    notes:
      'Drainage line cleared and completely covered with concrete slabs and iron grates. Road surface repaved with concrete.',
    inspectionNotes:
      'Field inspection completed with zonal civic sanitation team. Water drainage cleared with zero stagnation under peak flow test.',
    location: location,
    geoTag: '21.1458° N, 79.0882° E • Plot No. 24, Street Lane',
    docketNumber: docketNumber,
    officerContact: '0712-2561188',
  };

  const resolvedBeforeImage = data.beforeImage || data.beforeImageUrl || beforeImg;
  const resolvedAfterImage = data.afterImage || data.proofImageUrl || data.afterImageUrl || afterImg;

  const currentImage =
    activeImageTab === 'before' ? resolvedBeforeImage : resolvedAfterImage;

  const resolvedDepartment = data.resolvedBy || data.department || 'Municipal Public Works Department';
  const resolvedTimestamp = data.resolvedAt || data.resolvedDate || '02-08-2026 at 05:00 PM';
  const verifiedOfficer = data.verifiedBy || data.resolvedBy || 'Municipal Public Works Department';
  const summaryNotes = data.notes || data.workDone || 'Drainage line cleared and completely covered with concrete slabs and iron grates. Road surface repaved with concrete.';

  const handleDownloadProof = () => {
    if (onNotify) {
      onNotify(`Official Resolution Certificate for ${docketNumber} downloaded successfully.`);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Gov Resolution Proof for Grievance ${docketNumber}: Solved by ${data.department} on ${data.resolvedDate}.`
      );
      if (onNotify) onNotify('Resolution summary link copied to clipboard.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* ========================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================= */}
        <div className="bg-[#002B49] text-white px-5 py-4 flex items-center justify-between border-b border-[#001f35] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold bg-white/20 text-emerald-300 px-2 py-0.5 rounded">
                  {docketNumber}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>Solved &amp; Verified</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                Official Government Resolution Proof
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ========================================================= */}
        {/* SCROLLABLE BODY */}
        {/* ========================================================= */}
        <div className="overflow-y-auto p-5 space-y-5 text-slate-800">
          {/* Issue Summary Pill */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Reported Grievance:</span>
              <span className="text-slate-700 font-semibold">{category}</span>
            </div>
            <p className="text-xs font-bold text-slate-900">{issueTitle}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1">
              <MapPin size={12} className="text-red-500 shrink-0" />
              <span>{data.location || location}</span>
            </div>
          </div>

          {/* Resolution Proof Photo Showcase */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Eye size={14} className="text-emerald-600" />
                  <span>Site Resolution Evidence (Photo Proof)</span>
                </span>
                {resolvedBeforeImage && (
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setActiveImageTab('after')}
                      className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        activeImageTab === 'after'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      After (Resolved)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageTab('before')}
                      className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        activeImageTab === 'before'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Before (Issue)
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Field Verified
              </span>
            </div>

            {/* Photo Container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 group aspect-video sm:aspect-21/9 flex items-center justify-center">
              <img
                src={imgError ? DEFAULT_PROOF_IMAGE : currentImage}
                alt="Government Resolution Proof"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-125' : 'group-hover:scale-105'
                }`}
                onError={() => setImgError(true)}
              />

              {/* Geotag & Time Watermark Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-1 text-[10px]">
                <div>
                  <div className="font-bold flex items-center gap-1 text-emerald-300">
                    <CheckCircle2 size={12} />
                    <span>Municipal Field Officer Upload • Geotagged Proof</span>
                  </div>
                  <span className="text-white/80 font-mono">
                    {data.geoTag || '21.1458° N, 79.0882° E • Plot No. 24, Street Lane'}
                  </span>
                </div>
                <div className="text-right text-white/90 font-medium">
                  {resolvedTimestamp}
                </div>
              </div>

              {/* Zoom toggle button */}
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg text-xs backdrop-blur-xs transition-transform cursor-pointer"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>

          {/* Official Verification Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Resolving Authority */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <Building size={16} className="text-[#002B49] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Resolving Department
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{resolvedDepartment}</p>
                {data.officerContact && (
                  <span className="text-[11px] text-blue-700 font-semibold block mt-0.5">
                    Helpline: {data.officerContact}
                  </span>
                )}
              </div>
            </div>

            {/* Verified By / Date */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <UserCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Verified Authority &amp; Timestamp
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{verifiedOfficer}</p>
                <span className="text-[11px] text-emerald-800 font-medium block mt-0.5">
                  📅 {resolvedTimestamp}
                </span>
              </div>
            </div>
          </div>

          {/* Work Done & Official Remarks */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
              <FileCheck2 size={16} className="text-emerald-700" />
              <span>Official Work Done &amp; Executive Summary</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-emerald-100">
              {summaryNotes}
            </p>
            {data.inspectionNotes && (
              <div className="text-[11px] text-emerald-900/90 pt-1 flex items-start gap-1.5">
                <Sparkles size={13} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Quality Inspection:</strong> {data.inspectionNotes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* FOOTER ACTIONS */}
        {/* ========================================================= */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadProof}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Download Certificate (PDF)</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Share proof link"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#002B49] hover:bg-[#00385F] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Close Proof Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
