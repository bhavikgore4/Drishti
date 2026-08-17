import React from 'react';

export const DigitalIndiaLogo: React.FC<{ className?: string }> = ({ className = 'h-10' }) => {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`} title="Digital India - Power To Empower">
      <svg viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        {/* Emblem swoosh ring */}
        <circle cx="25" cy="25" r="18" stroke="#F97316" strokeWidth="2.5" strokeDasharray="3 2" />
        <circle cx="25" cy="25" r="13" fill="#0284C7" />
        
        {/* Ashoka chakra spokes */}
        <circle cx="25" cy="25" r="3" fill="#FFFFFF" />
        <line x1="25" y1="14" x2="25" y2="36" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="14" y1="25" x2="36" y2="25" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="17" y1="17" x2="33" y2="33" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="17" y1="33" x2="33" y2="17" stroke="#FFFFFF" strokeWidth="1" />
        
        {/* Saffron & Green outer swishes */}
        <path d="M22 6 C32 4, 40 10, 42 16" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 36 C16 44, 28 46, 36 42" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />

        {/* Text "Digital India" */}
        <text x="50" y="24" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="#002B49">
          Digital India
        </text>
        {/* Tagline "Power To Empower" */}
        <text x="50" y="37" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#EA580C" letterSpacing="0.5">
          Power To Empower
        </text>
      </svg>
    </div>
  );
};

export const CSCLogo: React.FC<{ className?: string }> = ({ className = 'h-5' }) => {
  return (
    <div className={`flex items-center gap-1 font-bold text-xs ${className}`}>
      <span className="bg-gradient-to-r from-red-600 to-green-600 text-white px-1.5 py-0.5 rounded font-black text-[10px]">
        CSC
      </span>
      <span className="text-gray-800 font-bold tracking-tight">DIGITAL SEVA CONNECT</span>
    </div>
  );
};
