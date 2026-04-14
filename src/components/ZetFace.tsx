import React from 'react';
import { motion } from 'motion/react';

interface ZetFaceProps {
  isSpeaking: boolean;
  emotion: string;
}

export const ZetFace: React.FC<ZetFaceProps> = ({ isSpeaking, emotion }) => {
  // Simple emotion-based eye shapes
  const getEyePath = () => {
    switch (emotion) {
      case 'quvnoq': return "M 20 45 Q 30 35 40 45"; // Happy curve
      case 'xafa': return "M 20 40 Q 30 50 40 40"; // Sad curve
      case 'hayratda': return "M 30 40 A 5 5 0 1 1 30 50 A 5 5 0 1 1 30 40"; // O shape
      default: return "M 20 45 L 40 45"; // Neutral line
    }
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Deep Glow Background */}
      <div className="absolute inset-0 bg-zet-accent/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute inset-10 bg-zet-accent/10 rounded-full blur-[60px]" />
      
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(100,255,218,0.3)]">
        <defs>
          <radialGradient id="headGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#172A45" />
            <stop offset="100%" stopColor="#0A192F" />
          </radialGradient>
          
          <linearGradient id="neuralGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64FFDA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#48D1CC" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#64FFDA" stopOpacity="0.9" />
          </linearGradient>

          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Detailed Ganch Pattern */}
          <pattern id="ganchPatternDetailed" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" fill="none" stroke="#64FFDA" strokeWidth="0.2" strokeOpacity="0.1" />
            <circle cx="20" cy="20" r="2" fill="#64FFDA" fillOpacity="0.05" />
            <path d="M 10 10 L 30 30 M 30 10 L 10 30" stroke="#64FFDA" strokeWidth="0.1" strokeOpacity="0.05" />
          </pattern>
        </defs>

        {/* Realistic Head Shape with Depth */}
        <path 
          d="M 100 15 C 55 15 25 45 25 100 C 25 160 60 185 100 185 C 140 185 175 160 175 100 C 175 45 145 15 100 15 Z" 
          fill="url(#headGradient)" 
          stroke="#64FFDA" 
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Inner Glowing Neural Mesh */}
        <mask id="headMask">
          <path d="M 100 20 C 60 20 30 50 30 100 C 30 150 60 180 100 180 C 140 180 170 150 170 100 C 170 50 140 20 100 20 Z" fill="white" />
        </mask>

        <g mask="url(#headMask)">
          {/* Ganch Background */}
          <rect width="200" height="200" fill="url(#ganchPatternDetailed)" />
          
          {/* Dynamic Neural Connections */}
          <motion.g 
            animate={{ opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 4, repeat: Infinity }}
            filter="url(#glowFilter)"
          >
            {/* Complex Neural Web */}
            <path d="M 50 60 L 100 40 L 150 60 L 160 100 L 100 120 L 40 100 Z" fill="none" stroke="url(#neuralGlow)" strokeWidth="0.5" strokeDasharray="2 2" />
            <path d="M 100 40 L 100 180" stroke="url(#neuralGlow)" strokeWidth="0.3" strokeOpacity="0.2" />
            <path d="M 30 100 L 170 100" stroke="url(#neuralGlow)" strokeWidth="0.3" strokeOpacity="0.2" />
            
            {/* Pulsing Nodes */}
            {[
              {x: 100, y: 40}, {x: 50, y: 60}, {x: 150, y: 60}, 
              {x: 40, y: 100}, {x: 160, y: 100}, {x: 100, y: 120}
            ].map((node, i) => (
              <motion.circle 
                key={i}
                cx={node.x} cy={node.y} r="1.5" 
                fill="#64FFDA"
                animate={{ r: [1.5, 3, 1.5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </motion.g>

          {/* Anor (Pomegranate) Motifs - More detailed */}
          <g opacity="0.8">
            <path d="M 100 150 C 90 150 85 160 85 170 C 85 180 100 190 100 190 C 100 190 115 180 115 170 C 115 160 110 150 100 150 Z" fill="var(--color-zet-anor)" />
            <path d="M 95 145 L 100 140 L 105 145" fill="none" stroke="var(--color-zet-anor)" strokeWidth="1" />
          </g>
          
          {/* Additional Anor accents on the sides */}
          <g transform="translate(40, 60) scale(0.4)" opacity="0.6">
            <circle cx="0" cy="0" r="10" fill="var(--color-zet-anor)" />
          </g>
          <g transform="translate(160, 60) scale(0.4)" opacity="0.6">
            <circle cx="0" cy="0" r="10" fill="var(--color-zet-anor)" />
          </g>
        </g>

        {/* Eyes - Glowing and Expressive */}
        <g filter="url(#glowFilter)">
          <g transform="translate(65, 85)">
            <motion.path 
              d={getEyePath()} 
              stroke="#64FFDA" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, times: [0, 0.05, 0.1] }}
            />
            <motion.circle 
              cx="30" cy="45" r="1" 
              fill="#64FFDA" 
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
          <g transform="translate(105, 85)">
            <motion.path 
              d={getEyePath()} 
              stroke="#64FFDA" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, times: [0, 0.05, 0.1], delay: 0.1 }}
            />
            <motion.circle 
              cx="30" cy="45" r="1" 
              fill="#64FFDA" 
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </g>
        </g>

        {/* Mouth - Fluid Animation */}
        <motion.path 
          d="M 85 145 Q 100 152 115 145" 
          stroke="#64FFDA" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#glowFilter)"
          animate={isSpeaking ? {
            d: [
              "M 85 145 Q 100 152 115 145",
              "M 85 145 Q 100 165 115 145",
              "M 85 145 Q 100 148 115 145",
              "M 88 145 Q 100 158 112 145"
            ]
          } : {
            d: "M 88 145 Q 100 148 112 145"
          }}
          transition={isSpeaking ? {
            duration: 0.15,
            repeat: Infinity,
            repeatType: "reverse"
          } : { duration: 0.5 }}
        />

        {/* Chin and Jawline highlights */}
        <path d="M 70 175 Q 100 185 130 175" fill="none" stroke="#64FFDA" strokeWidth="0.5" strokeOpacity="0.2" />
      </svg>
    </div>
  );
};

