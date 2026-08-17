import React, { useState, useEffect } from 'react';
import { RotateCw, Volume2 } from 'lucide-react';

interface CaptchaBoxProps {
  captchaText: string;
  onRefresh: () => void;
  showAudio?: boolean;
  className?: string;
}

export const CaptchaBox: React.FC<CaptchaBoxProps> = ({
  captchaText,
  onRefresh,
  showAudio = true,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const chars = captchaText.split('').join(' ');
      const utterance = new SpeechSynthesisUtterance(chars);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Captcha Visual Box */}
      <div
        className="relative px-3 py-2 bg-gradient-to-r from-gray-200 via-gray-100 to-amber-50 border border-gray-300 rounded-md select-none overflow-hidden flex items-center justify-center min-w-[110px] sm:min-w-[125px] h-10 shadow-inner"
        style={{
          backgroundImage:
            'radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 4px 4px',
        }}
      >
        {/* Strike-through and distortion lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <line x1="0" y1="20" x2="100%" y2="15" stroke="#475569" strokeWidth="1.5" />
          <line x1="10" y1="5" x2="90%" y2="35" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 3" />
        </svg>

        {/* Characters with individual rotation and styling */}
        <div className="flex items-center tracking-widest font-mono text-lg sm:text-xl font-black text-gray-800 relative z-10 space-x-1">
          {captchaText.split('').map((char, index) => {
            const rot = ((index % 3) - 1) * 8;
            const colors = ['#1e293b', '#334155', '#0f172a', '#1e1b4b', '#172554'];
            return (
              <span
                key={index}
                style={{
                  transform: `rotate(${rot}deg) translateY(${index % 2 === 0 ? '-1px' : '1px'})`,
                  color: colors[index % colors.length],
                  display: 'inline-block',
                  fontStyle: index % 2 === 0 ? 'italic' : 'normal',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Refresh & Audio buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-md border border-gray-300 transition-colors cursor-pointer"
          title="Refresh Captcha Code"
        >
          <RotateCw size={16} className="hover:rotate-180 transition-transform duration-300" />
        </button>

        {showAudio && (
          <button
            type="button"
            onClick={handleSpeak}
            className={`p-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-md border border-gray-300 transition-colors cursor-pointer ${
              isSpeaking ? 'text-blue-600 animate-pulse' : ''
            }`}
            title="Read Captcha Aloud (Audio CAPTCHA)"
          >
            <Volume2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
