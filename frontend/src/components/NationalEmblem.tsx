import React from 'react';

interface NationalEmblemProps {
  className?: string;
  size?: number;
  showMotto?: boolean;
}

export const NationalEmblem: React.FC<NationalEmblemProps> = ({
  className = 'w-14 h-18 sm:w-16 sm:h-20',
  showMotto = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${className}`}
      title="State Emblem of India (भारत का राज्य प्रतीक)"
    >
      <svg
        viewBox="0 0 160 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
        aria-label="State Emblem of India - Lion Capital of Ashoka with Satyameva Jayate"
      >
        <defs>
          <filter id="emblemShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodOpacity="0.15" />
          </filter>
        </defs>

        <g id="Ashoka-Stambh-Lion-Capital" filter="url(#emblemShadow)">
          {/* ========================================================================= */}
          {/* LION CAPITAL CROWN (Three Visible Asiatic Lions) */}
          {/* ========================================================================= */}
          
          {/* Center Lion - Face & Head */}
          <path
            d="M80 12 C72 12, 67 18, 66 26 C62 25, 57 28, 57 34 C57 41, 62 46, 65 52 C64 62, 66 74, 80 78 C94 74, 96 62, 95 52 C98 46, 103 41, 103 34 C103 28, 98 25, 94 26 C93 18, 88 12, 80 12 Z"
            fill="#1E1E1E"
          />

          {/* Center Lion - Mane Curls & High Detail Grooves */}
          <path
            d="M74 18 C70 20, 68 25, 71 29 C74 33, 79 34, 80 37 C81 34, 86 33, 89 29 C92 25, 90 20, 86 18 C83 16, 77 16, 74 18 Z"
            fill="#333333"
          />
          {/* Mane strands */}
          <path
            d="M62 38 C60 44, 63 50, 68 54 C66 60, 68 66, 72 70 C76 74, 84 74, 88 70 C92 66, 94 60, 92 54 C97 50, 100 44, 98 38"
            stroke="#FFFFFF"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />

          {/* Center Lion - Eyes, Snout, Whiskers & Open Roaring Mouth */}
          <circle cx="73" cy="32" r="2" fill="#FFFFFF" />
          <circle cx="73" cy="32" r="1" fill="#000000" />
          <circle cx="87" cy="32" r="2" fill="#FFFFFF" />
          <circle cx="87" cy="32" r="1" fill="#000000" />

          {/* Snout & Nose */}
          <path d="M78 35 L82 35 L80 39 Z" fill="#FFFFFF" />
          <path d="M76 40 C78 43, 82 43, 84 40" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          
          {/* Teeth / Open Roar */}
          <path d="M77 44 H83 L80 47 Z" fill="#FFFFFF" />

          {/* Left Facing Lion */}
          <path
            d="M62 24 C54 22, 44 28, 42 38 C36 42, 33 50, 37 58 C41 66, 48 71, 56 75 C53 66, 56 54, 58 46 C57 38, 59 30, 62 24 Z"
            fill="#222222"
          />
          {/* Left Lion Mane strands */}
          <path
            d="M48 35 C42 42, 44 50, 48 56 C50 62, 54 68, 60 72"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            fill="none"
            opacity="0.3"
          />
          <circle cx="48" cy="38" r="1.5" fill="#FFFFFF" />
          <circle cx="48" cy="38" r="0.75" fill="#000000" />
          <path d="M42 44 L45 43 L44 47 Z" fill="#FFFFFF" />

          {/* Right Facing Lion */}
          <path
            d="M98 24 C106 22, 116 28, 118 38 C124 42, 127 50, 123 58 C119 66, 112 71, 104 75 C107 66, 104 54, 102 46 C103 38, 101 30, 98 24 Z"
            fill="#222222"
          />
          {/* Right Lion Mane strands */}
          <path
            d="M112 35 C118 42, 116 50, 112 56 C110 62, 106 68, 100 72"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            fill="none"
            opacity="0.3"
          />
          <circle cx="112" cy="38" r="1.5" fill="#FFFFFF" />
          <circle cx="112" cy="38" r="0.75" fill="#000000" />
          <path d="M118 44 L115 43 L116 47 Z" fill="#FFFFFF" />

          {/* Center & Lateral Paws / Pillars */}
          {/* Left Leg */}
          <path d="M54 75 C48 85, 50 100, 55 110 C60 112, 66 112, 70 110 C69 100, 68 85, 66 75 Z" fill="#1C1C1C" />
          {/* Right Leg */}
          <path d="M106 75 C112 85, 110 100, 105 110 C100 112, 94 112, 90 110 C91 100, 92 85, 94 75 Z" fill="#1C1C1C" />
          {/* Center Front Legs */}
          <path d="M72 82 C70 92, 71 102, 74 110 C76 111, 84 111, 86 110 C89 102, 90 92, 88 82 Z" fill="#2A2A2A" />

          {/* Muscular Shading & Claws on Abacus */}
          <path d="M52 108 Q55 112 59 110 Q63 112 67 110" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M72 108 Q76 112 80 110 Q84 112 88 110" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M93 108 Q97 112 101 110 Q105 112 108 110" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.4" />

          {/* ========================================================================= */}
          {/* CIRCULAR ABACUS / FRIEZE (Chakra, Galloping Horse & Sacred Bull) */}
          {/* ========================================================================= */}
          
          {/* Abacus Top Plate */}
          <rect x="28" y="110" width="104" height="6" rx="2" fill="#1E1E1E" />
          
          {/* Abacus Center Band */}
          <path d="M22 116 L138 116 L134 136 L26 136 Z" fill="#2C2C2C" />

          {/* 1. Galloping Horse (Left Side of Abacus) */}
          <g id="Galloping-Horse" fill="#FFFFFF" opacity="0.95">
            {/* Horse Head & Ears */}
            <path d="M38 120 C40 118, 43 119, 44 122 C43 124, 40 125, 38 126 C36 127, 34 126, 33 124 C34 122, 36 120, 38 120 Z" />
            {/* Horse Body & Mane */}
            <path d="M42 123 C46 122, 51 123, 53 126 C51 129, 46 131, 41 130 C38 129, 36 128, 38 125 Z" />
            {/* Galloping Forelegs */}
            <path d="M38 128 L32 134 L30 133 L35 127 Z" />
            <path d="M42 129 L39 135 L37 134 L40 128 Z" />
            {/* Hind Legs */}
            <path d="M51 127 L54 134 L56 133 L53 126 Z" />
          </g>

          {/* 2. Central Ashoka Dharma Chakra (High Precision 24 Spokes) */}
          <g id="Central-Ashoka-Chakra">
            {/* Outer Rim */}
            <circle cx="80" cy="126" r="8.5" fill="#FFFFFF" stroke="#002B49" strokeWidth="1.2" />
            {/* Inner Hub Ring */}
            <circle cx="80" cy="126" r="2.2" fill="#002B49" stroke="#FFFFFF" strokeWidth="0.6" />
            <circle cx="80" cy="126" r="0.9" fill="#FFFFFF" />

            {/* 24 Spokes Vector Assembly */}
            <g stroke="#002B49" strokeWidth="0.55" strokeLinecap="round">
              <line x1="80" y1="118" x2="80" y2="134" />
              <line x1="72" y1="126" x2="88" y2="126" />
              <line x1="74.34" y1="120.34" x2="85.66" y2="131.66" />
              <line x1="74.34" y1="131.66" x2="85.66" y2="120.34" />
              <line x1="77.1" y1="118.5" x2="82.9" y2="133.5" />
              <line x1="82.9" y1="118.5" x2="77.1" y2="133.5" />
              <line x1="72.5" y1="123.1" x2="87.5" y2="128.9" />
              <line x1="72.5" y1="128.9" x2="87.5" y2="123.1" />
            </g>
          </g>

          {/* 3. Sacred Bull (Right Side of Abacus) */}
          <g id="Sacred-Bull" fill="#FFFFFF" opacity="0.95">
            {/* Bull Horns & Head */}
            <path d="M120 121 C122 119, 125 120, 126 123 C124 125, 121 126, 119 125 C118 123, 118 121, 120 121 Z" />
            {/* Hump & Muscular Body */}
            <path d="M117 122 C114 120, 110 122, 107 125 C108 129, 113 131, 118 130 C121 129, 123 126, 120 123 Z" />
            {/* Strong Legs */}
            <path d="M110 128 L108 135 L110 135 L113 129 Z" />
            <path d="M121 128 L123 135 L125 135 L123 128 Z" />
          </g>

          {/* Abacus Bottom Rim */}
          <rect x="25" y="136" width="110" height="5" rx="1.5" fill="#1A1A1A" />

          {/* ========================================================================= */}
          {/* BELL-SHAPED INVERTED LOTUS BASE */}
          {/* ========================================================================= */}
          <g id="Lotus-Base">
            {/* Primary Lotus Bell Contour */}
            <path
              d="M32 141 C42 153, 60 160, 80 160 C100 160, 118 153, 128 141 C118 145, 100 148, 80 148 C60 148, 42 145, 32 141 Z"
              fill="#222222"
            />
            {/* Lotus Petals Curves */}
            <path
              d="M42 143 C50 156, 62 163, 80 163 C98 163, 110 156, 118 143 C108 151, 94 156, 80 156 C66 156, 52 151, 42 143 Z"
              fill="#181818"
            />
            {/* Petal separator ribs */}
            <path d="M58 146 Q64 156 70 161" stroke="#3A3A3A" strokeWidth="1" fill="none" />
            <path d="M80 148 L80 163" stroke="#3A3A3A" strokeWidth="1.2" fill="none" />
            <path d="M102 146 Q96 156 90 161" stroke="#3A3A3A" strokeWidth="1" fill="none" />
          </g>
        </g>

        {/* ========================================================================= */}
        {/* "सत्यमेव जयते" (SATYAMEVA JAYATE) DEVANAGARI MOTTO AT THE BOTTOM */}
        {/* ========================================================================= */}
        {showMotto && (
          <g id="Satyameva-Jayate-Motto">
            {/* Crisp High-Legibility Devanagari Typography */}
            <text
              x="80"
              y="190"
              textAnchor="middle"
              fontFamily="'Noto Sans Devanagari', 'Mangal', 'Segoe UI Devanagari', 'Lohit Devanagari', 'Arial Unicode MS', serif"
              fontSize="16"
              fontWeight="900"
              letterSpacing="0.8"
              fill="#111111"
              style={{ fontFeatureSettings: '"kern" 1' }}
            >
              सत्यमेव जयते
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
