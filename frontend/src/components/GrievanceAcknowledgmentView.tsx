import React, { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  Home,
  FileText,
  UserCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Download,
  Calendar,
  Eye,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { GrievanceRecord } from '../types';

interface GrievanceAcknowledgmentViewProps {
  grievance: GrievanceRecord;
  citizenName: string;
  citizenEmail: string;
  citizenMobile: string;
  onGoHome: () => void;
  onNotify: (msg: string) => void;
}

export const GrievanceAcknowledgmentView: React.FC<GrievanceAcknowledgmentViewProps> = ({
  grievance,
  citizenName,
  citizenEmail,
  citizenMobile,
  onGoHome,
  onNotify,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const officer = grievance.nodalOfficer || {
    name: 'Shri Rajesh Sharma, IRPS',
    designation: 'Nodal Public Grievance Officer & Director (DM)',
    department: 'Disaster Management Division & Redressal Cell, Ministry of Home Affairs',
    subDivision: 'NDMA Crisis Cell & Regional Rapid Action Command',
    contactNumber: '+91-11-2309 3054 / +91-11-2343 8252',
    email: 'nodal-dm@mha.gov.in',
    officeAddress: 'Block 3, CGO Complex, Lodhi Road, New Delhi - 110003',
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    onNotify(`Copied ${label} to clipboard.`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ------------------------------------------------------------- */}
      {/* PRINTABLE DOCKET CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <div
        id="drishti-acknowledgment-docket"
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden print:border-none print:shadow-none"
      >
        {/* ========================================================= */}
        {/* TOP SUCCESS BANNER */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-[#002B49] text-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <CheckCircle2 size={32} className="text-emerald-300 animate-bounce" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs font-semibold mb-1.5">
                  <Sparkles size={12} />
                  <span>Statutory Registration Confirmed</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Grievance Successfully Registered!
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                  Your grievance docket has been encrypted, logged into the National CPGRAMS central ledger, and dispatched to the designated nodal authority.
                </p>
              </div>
            </div>

            {/* Registration Number & Date Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shrink-0 text-right md:min-w-[240px]">
              <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold mb-0.5">
                Registration Number
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wide">
                  {grievance.registrationNumber}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(grievance.registrationNumber, 'Registration Number')}
                  title="Copy Registration Number"
                  className="p-1 rounded bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                >
                  {copiedField === 'Registration Number' ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex items-center justify-end gap-1 text-[11px] text-white/80 mt-1 font-medium">
                <Calendar size={12} />
                <span>Date: {grievance.receivedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BODY CONTAINER */}
        {/* ========================================================= */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/80 p-4 rounded-xl border border-gray-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Current Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-xs mt-0.5 border border-amber-200">
                <Clock size={12} />
                <span>{grievance.status}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Redressal SLA</span>
              <span className="font-bold text-emerald-700 block mt-0.5">30 Calendar Days</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Priority Classification</span>
              <span className="font-bold text-red-600 block mt-0.5">{grievance.priority || 'High'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Triage Engine</span>
              <span className="font-bold text-purple-700 block mt-0.5">DRISHTI AI Fast-Track</span>
            </div>
          </div>

          {/* SECTION 1: GRIEVANCE DOCKET DETAILS */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-[#002B49] text-white px-4 py-2.5 flex items-center justify-between font-bold text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-amber-300" />
                <span>1. Grievance Classification &amp; Details</span>
              </div>
              <span className="text-[11px] font-normal text-amber-200">Section A</span>
            </div>

            <div className="p-4 sm:p-5 bg-white space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-600 text-[11px] block mb-0.5">Ministry / Department</label>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200 font-semibold text-gray-900">
                    {grievance.ministry || 'Ministry of Home Affairs / NDMA'}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-600 text-[11px] block mb-0.5">Jurisdiction / Regional Office</label>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200 font-semibold text-gray-900">
                    {grievance.location || 'Mumbai Suburban Disaster Cell'}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-600 text-[11px] block mb-0.5">Main Category</label>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200 text-gray-800">
                    {grievance.category || 'Disaster Relief & Emergency Response'}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-600 text-[11px] block mb-0.5">Sub-Category</label>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200 text-gray-800">
                    {grievance.subCategory || 'Immediate Rescue Boat Deployment & Dewatering'}
                  </div>
                </div>
              </div>

              {/* Full Text Description */}
              <div>
                <label className="font-bold text-gray-700 text-xs block mb-1">
                  Full Grievance Description / Citizen Remarks:
                </label>
                <div className="p-3.5 bg-gray-50/90 rounded-lg border border-gray-300 text-gray-900 leading-relaxed font-sans text-xs whitespace-pre-wrap">
                  {grievance.grievanceDescription}
                </div>
              </div>

              {/* Supporting Document / Evidence Preview Card */}
              {grievance.attachmentName ? (
                <div>
                  <label className="font-bold text-gray-700 text-xs block mb-1">
                    Uploaded Supporting Evidence / Document:
                  </label>
                  <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                          <span>{grievance.attachmentName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">
                            Verified Upload
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          Size: {grievance.attachmentSize || '1.42 MB'} • Authenticated Attachment
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {grievance.attachmentUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewModalOpen(true)}
                          className="bg-white hover:bg-gray-100 text-blue-800 border border-blue-300 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onNotify(`Downloading file: ${grievance.attachmentName}`)}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-gray-500 italic p-2 bg-gray-50 rounded border border-gray-200">
                  No additional supporting attachment was uploaded with this docket.
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: ASSIGNED OFFICER / NODAL AUTHORITY CREDENTIALS */}
          <div className="border border-emerald-300/80 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-emerald-800 text-white px-4 py-2.5 flex items-center justify-between font-bold text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-amber-300" />
                <span>2. Assigned Nodal Grievance Redressal Officer</span>
              </div>
              <span className="text-[11px] font-normal text-emerald-200">Authority in Charge</span>
            </div>

            <div className="p-5 bg-gradient-to-b from-emerald-50/40 via-white to-white space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">{officer.name}</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      Active Nodal Authority
                    </span>
                  </div>
                  <p className="text-gray-700 font-semibold text-xs mt-0.5">{officer.designation}</p>
                </div>

                <div className="text-left sm:text-right text-[11px] text-gray-500">
                  <span>Assignment Code: </span>
                  <span className="font-mono font-bold text-gray-800">NODAL-PG-2026-IND</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Building size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[11px] text-gray-600 block">Department / Sub-Division</span>
                    <span className="font-semibold text-gray-900 block">{officer.department}</span>
                    {officer.subDivision && (
                      <span className="text-[11px] text-gray-600 block mt-0.5">{officer.subDivision}</span>
                    )}
                  </div>
                </div>

                {/* Contact Number */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Phone size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-[11px] text-gray-600 block">Official Helpline / Direct Contact</span>
                    <a
                      href={`tel:${officer.contactNumber.split('/')[0].trim()}`}
                      className="font-mono font-bold text-blue-700 hover:underline block"
                    >
                      {officer.contactNumber}
                    </a>
                    <span className="text-[10px] text-gray-500 block">Mon - Fri (09:30 AM - 05:30 PM IST)</span>
                  </div>
                </div>

                {/* Email Address */}
                {officer.email && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <Mail size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[11px] text-gray-600 block">Official Government Email</span>
                      <a href={`mailto:${officer.email}`} className="font-semibold text-blue-700 hover:underline">
                        {officer.email}
                      </a>
                      <span className="text-[10px] text-gray-500 block">CC docket number in subject line</span>
                    </div>
                  </div>
                )}

                {/* Office Address */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <MapPin size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[11px] text-gray-600 block">Nodal Office Physical Address</span>
                    <span className="font-medium text-gray-800 leading-snug block">{officer.officeAddress}</span>
                  </div>
                </div>
              </div>

              {/* Redressal Commitment & Advisory */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
                <Shield size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Citizen Guarantee:</strong> As mandated by the Department of Administrative Reforms &amp; Public Grievances (DARPG), the assigned officer is obligated to furnish an Interim Action Report within 7 working days and complete grievance resolution within the 30-day statutory timeline.
                </p>
              </div>
            </div>
          </div>

          {/* Citizen Details Reference */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Complainant:</span>
              <span className="font-semibold text-gray-900">{citizenName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Registered Mobile:</span>
              <span className="font-mono text-gray-900">{citizenMobile}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Registered Email:</span>
              <span className="text-gray-900">{citizenEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* BOTTOM ACTION BUTTONS (Side-by-Side as specified) */}
      {/* ============================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-xs border border-gray-200 print:hidden">
        <div className="text-xs text-gray-600 text-center sm:text-left">
          A copy of this Acknowledgment Slip with docket tracking PIN has been sent to your registered email <strong className="text-gray-900">{citizenEmail}</strong>.
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Left Button: Download / Print Acknowledgment PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none bg-white hover:bg-gray-100 text-gray-800 border-2 border-gray-300 hover:border-gray-400 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Printer size={16} className="text-gray-700" />
            <span>Download / Print Acknowledgment PDF</span>
          </button>

          {/* Right Button: Go To Home Dashboard */}
          <button
            type="button"
            onClick={onGoHome}
            className="flex-1 sm:flex-none bg-[#002B49] hover:bg-[#00385F] text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            <Home size={16} className="text-amber-300" />
            <span>Go To Home Dashboard</span>
          </button>
        </div>
      </div>

      {/* Attachment Image Preview Modal */}
      {previewModalOpen && grievance.attachmentUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-gray-800">
                Attachment Preview: {grievance.attachmentName}
              </h4>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-gray-100 rounded p-2">
              <img
                src={grievance.attachmentUrl}
                alt="Attachment Evidence"
                className="max-h-[60vh] object-contain rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-1.5 bg-[#002B49] text-white text-xs font-bold rounded"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
