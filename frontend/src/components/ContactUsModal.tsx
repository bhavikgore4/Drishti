import React from 'react';
import { X, Phone, Mail, MapPin, Building, Clock, Shield } from 'lucide-react';
import { LanguageCode } from '../types';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: LanguageCode;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#6B0C36] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/20 rounded">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {currentLang === 'hi' ? 'संपर्क करें / सहायता केंद्र' : 'Contact Us & Helpdesk Directory'}
              </h3>
              <p className="text-[11px] text-amber-200">
                Department of Administrative Reforms and Public Grievances (DARPG)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Directory */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-gray-700 max-h-[75vh] overflow-y-auto">
          {/* Toll Free Helpline */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3">
            <div className="bg-amber-500 text-white p-2 rounded-lg shrink-0 mt-0.5">
              <Phone size={18} />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">National Toll-Free Grievance Helpline</div>
              <div className="text-base font-extrabold text-[#6B0C36] mt-0.5 tracking-wide">1800-11-4000</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Available 24x7 in Hindi, English, and regional Indian languages (IVRS &amp; Executive Support)
              </div>
            </div>
          </div>

          {/* Disaster Emergency SOS */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-3">
            <div className="bg-red-600 text-white p-2 rounded-lg shrink-0 mt-0.5">
              <Shield size={18} />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">NDMA Disaster Relief Emergency Helpline</div>
              <div className="text-base font-extrabold text-red-700 mt-0.5 tracking-wide">1078 / 112</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                For instant flood, cyclone, landslide, and natural disaster emergency SOS alerts
              </div>
            </div>
          </div>

          {/* Postal & Office Address */}
          <div className="border border-gray-200 rounded-lg p-3.5 space-y-2.5 bg-gray-50/70">
            <div className="flex items-start gap-2.5">
              <Building size={16} className="text-[#6B0C36] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Headquarters Address:</div>
                <div className="text-gray-600 text-xs mt-0.5 leading-relaxed">
                  Directorate of Public Grievances (DPG) &amp; DARPG,<br />
                  Sardar Patel Bhawan, Parliament Street, New Delhi - 110001, India
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1 border-t border-gray-200">
              <Mail size={16} className="text-[#6B0C36] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Official Helpdesk Email:</div>
                <div className="text-gray-600 text-xs mt-0.5">
                  <span className="font-mono text-[#0056B3]">cpgrams-dpg@nic.in</span> / <span className="font-mono text-[#0056B3]">drishti-support@gov.in</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1 border-t border-gray-200">
              <Clock size={16} className="text-[#6B0C36] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Working Hours:</div>
                <div className="text-gray-600 text-xs mt-0.5">
                  Monday to Friday: 09:00 AM – 05:30 PM (Portal &amp; AI triage available 24x7x365)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3.5 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#6B0C36] hover:bg-[#520929] text-white px-5 py-2 rounded-lg font-bold text-xs cursor-pointer transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
