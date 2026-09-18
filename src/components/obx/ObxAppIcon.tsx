export type ObxAppKind = 'academy' | 'readiness' | 'skills' | 'pricing' | 'contract' | 'token';

type ObxAppIconProps = {
  kind: ObxAppKind;
  className?: string;
};

const ObxAppIcon = ({ kind, className = 'h-6 w-6' }: ObxAppIconProps) => {
  const common = {
    className,
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: 'currentColor',
    'aria-hidden': true,
  };

  switch (kind) {
    case 'academy':
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="39" strokeWidth="1" strokeDasharray="4 3" opacity="0.35" />
          <path d="M18 38 50 21l32 17-32 17L18 38Z" strokeWidth="2.5" />
          <path d="M31 46v22c11 9 27 9 38 0V46" strokeWidth="4" />
          <path d="M82 38v27" strokeWidth="2" />
          <circle cx="82" cy="69" r="4" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'readiness':
      return (
        <svg {...common}>
          <rect x="15" y="15" width="70" height="70" strokeWidth="1" opacity="0.25" />
          <path d="M15 37h70M37 15v70" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
          <circle cx="58" cy="54" r="20" strokeWidth="4" />
          <path d="m72 69 14 14" strokeWidth="6" />
          <rect x="32" y="30" width="10" height="10" fill="currentColor" stroke="none" />
          <path d="M46 55a12 12 0 0 1 24 0M58 55l8-11" strokeWidth="2.5" />
          <circle cx="58" cy="55" r="3" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'skills':
      return (
        <svg {...common}>
          <path d="M14 50h72M50 14v72" strokeWidth="1" opacity="0.3" />
          <rect x="25" y="25" width="50" height="50" strokeWidth="3" />
          <circle cx="50" cy="50" r="13" strokeWidth="5" />
          <circle cx="25" cy="25" r="5" fill="currentColor" stroke="none" />
          <circle cx="75" cy="25" r="5" fill="currentColor" stroke="none" opacity="0.65" />
          <circle cx="25" cy="75" r="5" fill="currentColor" stroke="none" opacity="0.4" />
          <circle cx="75" cy="75" r="5" fill="currentColor" stroke="none" opacity="0.2" />
        </svg>
      );
    case 'pricing':
      return (
        <svg {...common}>
          <path d="M12 82h76" strokeWidth="2" />
          <rect x="17" y="57" width="15" height="25" fill="currentColor" stroke="none" />
          <rect x="42" y="39" width="15" height="43" fill="currentColor" stroke="none" opacity="0.6" />
          <rect x="67" y="20" width="15" height="62" fill="currentColor" stroke="none" opacity="0.25" />
          <path d="m14 56 28-19 14 5 29-26" strokeWidth="2" />
          <circle cx="85" cy="16" r="5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'contract':
      return (
        <svg {...common}>
          <rect x="18" y="12" width="53" height="70" strokeWidth="2" />
          <path d="M29 29h31M29 40h22M29 51h27" strokeWidth="2" opacity="0.45" />
          <path d="m39 72 13-17 7 9 24-31" strokeWidth="5" />
          <circle cx="83" cy="33" r="5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'token':
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="37" strokeWidth="1" opacity="0.3" />
          <path d="m50 15 30 18v34L50 85 20 67V33l30-18Z" strokeWidth="2" />
          <path d="M50 15v70M20 33l60 34M80 33 20 67" strokeWidth="1" opacity="0.45" />
          <circle cx="50" cy="50" r="10" fill="currentColor" stroke="none" />
          <circle cx="50" cy="15" r="4" fill="currentColor" stroke="none" />
          <circle cx="20" cy="67" r="4" fill="currentColor" stroke="none" />
          <circle cx="80" cy="67" r="4" fill="currentColor" stroke="none" />
        </svg>
      );
  }
};

export default ObxAppIcon;