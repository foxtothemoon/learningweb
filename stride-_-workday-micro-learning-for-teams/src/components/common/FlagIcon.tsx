import React from 'react';

interface FlagProps {
  className?: string;
  size?: number;
}

export const ThaiFlag: React.FC<FlagProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={`rounded-full shrink-0 ${className}`}
    aria-label="Thailand Flag"
  >
    <defs>
      <clipPath id="thai-circle-clip">
        <circle cx="16" cy="16" r="16" />
      </clipPath>
    </defs>
    <g clipPath="url(#thai-circle-clip)">
      {/* Top and Bottom Red stripes */}
      <rect x="0" y="0" width="32" height="32" fill="#A51931" />
      {/* White stripes */}
      <rect x="0" y="5.33" width="32" height="21.34" fill="#F4F5F8" />
      {/* Middle Dark Navy Blue stripe */}
      <rect x="0" y="10.67" width="32" height="10.66" fill="#2D2A4A" />
    </g>
  </svg>
);

export const UkFlag: React.FC<FlagProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={`rounded-full shrink-0 ${className}`}
    aria-label="United Kingdom Flag"
  >
    <defs>
      <clipPath id="uk-circle-clip">
        <circle cx="16" cy="16" r="16" />
      </clipPath>
    </defs>
    <g clipPath="url(#uk-circle-clip)">
      {/* Deep Blue background */}
      <rect width="32" height="32" fill="#012169" />
      {/* White Diagonals */}
      <path d="M-4,-4 L36,36 M36,-4 L-4,36" stroke="#FFFFFF" strokeWidth="5.5" />
      {/* Red Diagonals */}
      <path d="M-4,-4 L16,16 M36,-4 L16,16 M36,36 L16,16 M-4,36 L16,16" stroke="#C8102E" strokeWidth="2" />
      {/* White Cross */}
      <path d="M16,-4 V36 M-4,16 H36" stroke="#FFFFFF" strokeWidth="9.5" />
      {/* Red St George Cross */}
      <path d="M16,-4 V36 M-4,16 H36" stroke="#C8102E" strokeWidth="5.5" />
    </g>
  </svg>
);
