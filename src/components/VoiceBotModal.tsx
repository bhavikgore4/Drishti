import React, { useState, useEffect } from 'react';
import { X, Mic, Volume2, Sparkles, CheckCircle2, ArrowRight, Radio } from 'lucide-react';
import { LanguageCode } from '../types';

interface VoiceBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: LanguageCode;
}

export const VoiceBotModal: React.FC<VoiceBotModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [classification, setClassification] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setTranscript('');
      setClassification(null);

      // Simulate voice speech transcription in steps
      const timer1 = setTimeout(() => {
        setTranscript('मेरी पंचायत में पिछले सप्ताह भारी बारिश के कारण मुख्य सड़क और नाला टूट गया है...');
      }, 1500);

      const timer2 = setTimeout(() => {
        setTranscript(
          'मेरी पंचायत में पिछले सप्ताह भारी बारिश के कारण मुख्य सड़क और नाला टूट गया है, जिससे पानी घरों में घुस रहा है और आवागमन ठप है।'
        );
        setIsListening(false);
        setClassification({
          ministry: 'Ministry of Rural Development & Disaster Management Cell',
          department: 'Department of Rural Connectivity (PMGSY) & SDRF Unit',
          subCategory: 'Flood Drainage Damage & Culvert Repair',
          confidence: '98.2%',
          priority: 'HIGH_DISASTER_PRIORITY',
        });
      }, 3500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#002244] to-[#00172D] text-white rounded-2xl shadow-2xl border border-blue-400/30 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-blue-400/20">
          <div className="flex items-center gap-2.5">
            <div className="bg-red-600 text-white p-1.5 rounded-lg shadow-md animate-pulse">
              <Mic size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Drishti Mitra - AI Voice Assistant</h3>
              <span className="text-[10px] text-amber-300">Voice-to-Grievance NLP Engine (IndicSpeech)</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-gray-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Voice Visualizer Orb */}
        <div className="p-6 text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></span>
                <span className="absolute inset-2 rounded-full bg-amber-400/20 animate-pulse"></span>
              </>
            )}
            <div
              onClick={() => setIsListening(!isListening)}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-1 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-[#001D3D] flex flex-col items-center justify-center">
                <Mic size={32} className={isListening ? 'text-amber-400 animate-pulse' : 'text-blue-300'} />
              </div>
            </div>
          </div>

          <div className="text-xs text-amber-300 font-semibold tracking-wide">
            {isListening ? 'Listening in Hindi / English / Regional... बोलिए...' : 'Voice Captured & Processed'}
          </div>

          {/* Real-time Transcription Box */}
          <div className="bg-[#00152B]/90 border border-blue-400/20 rounded-xl p-3.5 text-left text-xs min-h-[70px]">
            <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
              Live Speech Transcript:
            </span>
            <p className="text-gray-200 leading-relaxed font-serif">
              {transcript || 'Listening for speech input... (Speak your problem naturally)'}
            </p>
          </div>

          {/* AI Auto-Classification Result */}
          {classification && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3.5 text-left text-xs space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  AI Classification Complete
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                  {classification.confidence} Match
                </span>
              </div>

              <div className="space-y-1 text-gray-300 text-[11px]">
                <div>
                  <span className="text-gray-400">Department:</span> {classification.department}
                </div>
                <div>
                  <span className="text-gray-400">Category:</span> {classification.subCategory}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#001224] p-4 border-t border-blue-400/20 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          {classification && (
            <button
              onClick={onClose}
              className="bg-[#FFB300] hover:bg-[#FFA000] text-gray-950 font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Continue to Verification Screen</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
