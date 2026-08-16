import React, { useState } from 'react';
import { X, Search, ChevronDown, HelpCircle, FileText, ShieldAlert } from 'lucide-react';
import { LanguageCode } from '../types';

interface FaqDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: LanguageCode;
}

export const FaqDrawer: React.FC<FaqDrawerProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'What is Drishti and how does it differ from traditional CPGRAMS?',
      qHi: 'दृष्टि क्या है और यह पारंपरिक CPGRAMS से कैसे भिन्न है?',
      a: 'Drishti is an AI-driven Disaster and Public Grievance Management Platform. Unlike traditional CPGRAMS where citizens had to manually navigate complex Ministry and Department dropdowns, Drishti uses advanced NLP to automatically categorize and route complaints based on plain-language descriptions and uploaded document photos.',
    },
    {
      q: 'How long does it take for a grievance to be resolved?',
      qHi: 'शिकायत के समाधान में कितना समय लगता है?',
      a: 'As per the Citizen Charter, the standard resolution timeline is within 30 days. Emergency disaster-related grievances are triaged on priority within 24 to 48 hours directly to district disaster response cells.',
    },
    {
      q: 'Can I appeal if I am not satisfied with the grievance resolution?',
      qHi: 'यदि मैं शिकायत निवारण से संतुष्ट नहीं हूं तो क्या मैं अपील कर सकता हूं?',
      a: 'Yes. Within 30 days of closure, you can exercise the Appeal Mechanism. Your appeal is routed directly to a Senior Nodal Appellate Authority (Joint Secretary level) for independent re-examination.',
    },
    {
      q: 'Can I lodge a grievance using voice in my regional language?',
      qHi: 'क्या मैं अपनी क्षेत्रीय भाषा में आवाज का उपयोग करके शिकायत दर्ज कर सकता हूं?',
      a: 'Yes! "Drishti Mitra" AI Voice Assistant supports Hindi, English, and regional Indian languages. You can simply speak your problem, and the system transcribes and auto-fills the filing.',
    },
    {
      q: 'Is my personal data protected under the law?',
      qHi: 'क्या मेरा व्यक्तिगत डेटा कानून के तहत सुरक्षित है?',
      a: 'All citizen data is protected and handled strictly in compliance with the Digital Personal Data Protection (DPDP) Act, 2023. Personally Identifiable Information (PII) is encrypted at rest.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200 flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-[#6B0C36] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base">
              {currentLang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Field */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B0C36] bg-white"
            />
          </div>
        </div>

        {/* FAQ Items Accordion */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredFaqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className="w-full text-left p-3.5 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer"
                >
                  <span className="pr-2">{currentLang === 'hi' ? faq.qHi || faq.q : faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-gray-500 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-[#6B0C36]' : ''
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="p-3.5 bg-white text-xs sm:text-[13px] text-gray-600 border-t border-gray-200 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-center text-gray-500">
          Need more help? Call National Toll-Free Grievance Helpline: <strong className="text-gray-900">1800-11-4000</strong>
        </div>
      </div>
    </div>
  );
};
