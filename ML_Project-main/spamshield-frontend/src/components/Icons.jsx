// SpamShield AI — SVG Illustrations & Icons as React Components

export const ShieldLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6C3EE8"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
    </defs>
    <path d="M40 8 L68 20 L68 44 C68 58 55 70 40 74 C25 70 12 58 12 44 L12 20 Z"
          fill="url(#shieldGrad)" opacity="0.15"/>
    <path d="M40 12 L64 22 L64 44 C64 56 53 67 40 71 C27 67 16 56 16 44 L16 22 Z"
          fill="url(#shieldGrad)"/>
    <path d="M30 40 L37 47 L52 32" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HeroIllustration = () => (
  <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',maxWidth:520}}>
    <defs>
      <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6C3EE8" stopOpacity="0.12"/>
        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.12"/>
      </linearGradient>
      <linearGradient id="hg2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6C3EE8"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
      <linearGradient id="hg3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06B6D4"/>
        <stop offset="100%" stopColor="#6C3EE8"/>
      </linearGradient>
    </defs>
    {/* Background circles */}
    <circle cx="250" cy="200" r="160" fill="url(#hg1)"/>
    <circle cx="250" cy="200" r="110" fill="white" opacity="0.6"/>
    {/* Email envelope */}
    <rect x="120" y="130" width="260" height="180" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
    <path d="M120 146 L250 220 L380 146" stroke="url(#hg2)" strokeWidth="3" fill="none"/>
    {/* Shield overlay */}
    <rect x="195" y="185" width="110" height="80" rx="12" fill="url(#hg2)" opacity="0.1"/>
    <path d="M250 200 L278 212 L278 230 C278 242 265 252 250 256 C235 252 222 242 222 230 L222 212 Z"
          fill="url(#hg2)"/>
    <path d="M241 230 L247 236 L261 220" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Floating badges */}
    <rect x="50" y="100" width="90" height="36" rx="18" fill="#EF4444" opacity="0.9"/>
    <text x="95" y="123" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Inter">SPAM</text>
    <rect x="365" y="100" width="90" height="36" rx="18" fill="#10B981" opacity="0.9"/>
    <text x="410" y="123" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Inter">SAFE</text>
    {/* AI dots */}
    <circle cx="90" cy="200" r="8" fill="#6C3EE8" opacity="0.7">
      <animate attributeName="cy" values="200;190;200" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="415" cy="180" r="6" fill="#06B6D4" opacity="0.7">
      <animate attributeName="cy" values="180;190;180" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="130" cy="290" r="10" fill="#8B5CF6" opacity="0.5">
      <animate attributeName="cy" values="290;280;290" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="380" cy="300" r="7" fill="#06B6D4" opacity="0.6">
      <animate attributeName="cy" values="300;292;300" dur="2.2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const SpamIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#FEE2E2"/>
    <path d="M20 20 L44 44M44 20 L20 44" stroke="#EF4444" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

export const SafeIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#D1FAE5"/>
    <path d="M18 32 L27 41 L46 22" stroke="#10B981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AIIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="12" fill="#EDE9FE"/>
    <path d="M12 20 C12 15.58 15.58 12 20 12 C24.42 12 28 15.58 28 20 C28 24.42 24.42 28 20 28 C15.58 28 12 24.42 12 20Z" stroke="#6C3EE8" strokeWidth="2"/>
    <circle cx="20" cy="20" r="4" fill="#6C3EE8"/>
    <line x1="20" y1="8" x2="20" y2="12" stroke="#6C3EE8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="20" y1="28" x2="20" y2="32" stroke="#6C3EE8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="20" x2="12" y2="20" stroke="#6C3EE8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="28" y1="20" x2="32" y2="20" stroke="#6C3EE8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CompareIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="12" fill="#E0F2FE"/>
    <rect x="9" y="24" width="8" height="8" rx="2" fill="#06B6D4"/>
    <rect x="23" y="16" width="8" height="16" rx="2" fill="#6C3EE8"/>
    <line x1="9" y1="32" x2="31" y2="32" stroke="#94A3B8" strokeWidth="1.5"/>
  </svg>
);

export const SecureIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="12" fill="#D1FAE5"/>
    <path d="M20 8 L31 13 L31 22 C31 28 26 33 20 35 C14 33 9 28 9 22 L9 13 Z" fill="#10B981" opacity="0.3"/>
    <path d="M20 10 L29 14.5 L29 22 C29 27 25 31.5 20 33 C15 31.5 11 27 11 22 L11 14.5 Z" fill="#10B981"/>
    <path d="M15 21 L19 25 L26 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const EasyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="12" fill="#FEF3C7"/>
    <path d="M20 10 C14.5 10 10 14.5 10 20 C10 25.5 14.5 30 20 30 C25.5 30 30 25.5 30 20 C30 14.5 25.5 10 20 10Z" fill="#F59E0B" opacity="0.3"/>
    <path d="M20 12 C15.58 12 12 15.58 12 20 C12 24.42 15.58 28 20 28 C24.42 28 28 24.42 28 20 C28 15.58 24.42 12 20 12Z" stroke="#F59E0B" strokeWidth="2"/>
    <path d="M20 16 L20 21 M20 24 L20 24.5" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.7"/>
    <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor"/>
    <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor"/>
    <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.7"/>
  </svg>
);

export const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
