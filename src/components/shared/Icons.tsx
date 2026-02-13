import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function LogoIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={24} height={24} {...props}>
      <rect
        x="4"
        y="4"
        width="504"
        height="504"
        rx="64"
        ry="64"
        fill="none"
        stroke="#6366f1"
        strokeWidth="8"
        strokeOpacity="0.5"
      />
      <defs>
        <linearGradient id="logo-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="logo-flask-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="logo-glass-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0" />
        </linearGradient>
        <clipPath id="logo-flask-clip">
          <path d="M215 170 L215 260 L145 370 Q130 395 150 415 Q160 425 180 425 L332 425 Q352 425 362 415 Q382 395 367 370 L297 260 L297 170 Z" />
        </clipPath>
      </defs>
      {/* Floating markdown symbols (left) */}
      <text
        x="48"
        y="168"
        fontFamily="'Courier New', monospace"
        fontSize="34"
        fontWeight="bold"
        fill="#4f46e5"
        opacity="0.7"
      >
        #
      </text>
      <text
        x="55"
        y="225"
        fontFamily="'Courier New', monospace"
        fontSize="24"
        fontWeight="bold"
        fill="#4f46e5"
        opacity="0.6"
      >
        **
      </text>
      <text x="50" y="280" fontFamily="'Courier New', monospace" fontSize="32" fill="#4338ca" opacity="0.65">
        {'>'}
      </text>
      <text
        x="58"
        y="340"
        fontFamily="'Courier New', monospace"
        fontSize="22"
        fontWeight="bold"
        fill="#4f46e5"
        opacity="0.6"
      >
        ```
      </text>
      <text x="48" y="405" fontFamily="'Courier New', monospace" fontSize="28" fill="#4f46e5" opacity="0.55">
        ---
      </text>
      {/* Floating markdown symbols (right) */}
      <text
        x="405"
        y="168"
        fontFamily="'Courier New', monospace"
        fontSize="26"
        fontWeight="bold"
        fill="#4f46e5"
        opacity="0.6"
      >
        []
      </text>
      <text x="408" y="228" fontFamily="'Courier New', monospace" fontSize="28" fill="#4338ca" opacity="0.65">
        ()
      </text>
      <text
        x="405"
        y="288"
        fontFamily="'Courier New', monospace"
        fontSize="22"
        fontWeight="bold"
        fill="#4f46e5"
        opacity="0.55"
      >
        ~~
      </text>
      <text x="410" y="348" fontFamily="'Courier New', monospace" fontSize="30" fill="#4f46e5" opacity="0.65">
        *
      </text>
      <text x="402" y="408" fontFamily="'Courier New', monospace" fontSize="22" fill="#4f46e5" opacity="0.55">
        | |
      </text>
      {/* Horizontal rule decoration (left) */}
      <g opacity="0.5" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round">
        <line x1="45" y1="310" x2="65" y2="310" />
        <line x1="72" y1="310" x2="92" y2="310" />
        <line x1="99" y1="310" x2="119" y2="310" />
      </g>
      {/* Bullet list decoration (right) */}
      <g opacity="0.45" fill="#4f46e5">
        <circle cx="400" cy="370" r="3" />
        <line x1="410" y1="370" x2="445" y2="370" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
        <circle cx="400" cy="384" r="3" />
        <line x1="410" y1="384" x2="440" y2="384" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Heading hierarchy (top-left) */}
      <g opacity="0.55" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round">
        <line x1="108" y1="88" x2="148" y2="88" />
        <line x1="108" y1="97" x2="140" y2="97" />
        <line x1="108" y1="106" x2="132" y2="106" />
      </g>
      {/* Checkbox list (top-right) */}
      <g opacity="0.5" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round">
        <rect x="415" y="85" width="10" height="10" rx="2" fill="none" />
        <path d="M417 91 L420 94 L424 87" stroke="#4338ca" strokeWidth="1.5" fill="none" />
        <line x1="430" y1="91" x2="450" y2="91" />
        <rect x="415" y="100" width="10" height="10" rx="2" fill="none" />
        <line x1="430" y1="106" x2="448" y2="106" />
      </g>
      {/* Accent dots */}
      <circle cx="105" cy="140" r="5" fill="#4f46e5" opacity="0.6" />
      <circle cx="42" cy="248" r="3" fill="#4338ca" opacity="0.5" />
      <circle cx="95" cy="378" r="4" fill="#4f46e5" opacity="0.45" />
      <circle cx="442" cy="145" r="4" fill="#4338ca" opacity="0.55" />
      <circle cx="460" cy="260" r="3" fill="#4f46e5" opacity="0.5" />
      <circle cx="390" cy="400" r="4" fill="#4f46e5" opacity="0.45" />
      <circle cx="132" cy="198" r="3" fill="#6366f1" opacity="0.5" />
      <circle cx="452" cy="332" r="3" fill="#6366f1" opacity="0.45" />
      <circle cx="140" cy="420" r="3" fill="#16a34a" opacity="0.55" />
      <circle cx="380" cy="130" r="3" fill="#16a34a" opacity="0.5" />
      {/* Flask neck */}
      <rect
        x="215"
        y="120"
        width="82"
        height="55"
        rx="4"
        fill="url(#logo-flask-glass)"
        stroke="#6366f1"
        strokeWidth="2"
        strokeOpacity="0.5"
      />
      {/* Flask body */}
      <path
        d="M215 170 L215 260 L145 370 Q130 395 150 415 Q160 425 180 425 L332 425 Q352 425 362 415 Q382 395 367 370 L297 260 L297 170 Z"
        fill="url(#logo-flask-glass)"
        stroke="#6366f1"
        strokeWidth="3"
        strokeOpacity="0.6"
      />
      {/* Liquid */}
      <g clipPath="url(#logo-flask-clip)">
        <rect x="130" y="310" width="250" height="120" fill="url(#logo-liquid)" />
        <path
          d="M130 312 Q180 298 220 314 Q260 330 300 312 Q340 296 380 314 L380 430 L130 430 Z"
          fill="#6366f1"
          opacity="0.5"
        />
        <circle cx="198" cy="368" r="6" fill="#c7d2fe" opacity="0.4" />
        <circle cx="278" cy="388" r="4" fill="#c7d2fe" opacity="0.3" />
        <circle cx="312" cy="358" r="5" fill="#e0e7ff" opacity="0.3" />
      </g>
      {/* Flask outline */}
      <path
        d="M215 170 L215 260 L145 370 Q130 395 150 415 Q160 425 180 425 L332 425 Q352 425 362 415 Q382 395 367 370 L297 260 L297 170"
        fill="none"
        stroke="#6366f1"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {/* Flask rim */}
      <rect x="205" y="115" width="102" height="12" rx="6" fill="#6366f1" opacity="0.55" />
      {/* Glass shine */}
      <path
        d="M220 175 L220 255 L160 355"
        fill="none"
        stroke="url(#logo-glass-shine)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Hash symbol inside flask */}
      <text
        x="218"
        y="310"
        fontFamily="'Courier New', monospace"
        fontSize="92"
        fontWeight="bold"
        fill="#312e81"
        opacity="0.8"
      >
        #
      </text>
      {/* "Md" label */}
      <text
        x="285"
        y="292"
        fontFamily="'Courier New', monospace"
        fontSize="38"
        fontWeight="bold"
        fill="#312e81"
        opacity="0.65"
      >
        Md
      </text>
      {/* Angle brackets */}
      <text
        x="192"
        y="300"
        fontFamily="'Courier New', monospace"
        fontSize="65"
        fontWeight="bold"
        fill="#4f46e5"
        opacity="0.4"
      >
        {'<'}
      </text>
      <text
        x="305"
        y="300"
        fontFamily="'Courier New', monospace"
        fontSize="65"
        fontWeight="bold"
        fill="#4f46e5"
        opacity="0.4"
      >
        {'>'}
      </text>
      {/* Sparkles */}
      <g fill="#4f46e5" opacity="0.5">
        <circle cx="335" cy="138" r="2" />
        <circle cx="175" cy="162" r="1.5" />
        <circle cx="370" cy="278" r="2" />
        <circle cx="200" cy="430" r="1.5" />
        <circle cx="320" cy="440" r="1.5" />
      </g>
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <circle cx={12} cy={12} r={5} />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export function SplitIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <rect x={3} y={3} width={18} height={18} rx={2} />
      <path d="M12 3v18" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1={12} y1={15} x2={12} y2={3} />
    </svg>
  );
}

export function FileIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1={10} y1={14} x2={21} y2={3} />
    </svg>
  );
}

export function BoldIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  );
}

export function ItalicIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <line x1={19} y1={4} x2={10} y2={4} />
      <line x1={14} y1={20} x2={5} y2={20} />
      <line x1={15} y1={4} x2={9} y2={20} />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <line x1={8} y1={6} x2={21} y2={6} />
      <line x1={8} y1={12} x2={21} y2={12} />
      <line x1={8} y1={18} x2={21} y2={18} />
      <line x1={3} y1={6} x2={3.01} y2={6} />
      <line x1={3} y1={12} x2={3.01} y2={12} />
      <line x1={3} y1={18} x2={3.01} y2={18} />
    </svg>
  );
}

export function HeadingIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <path d="M6 4v16M18 4v16M6 12h12" />
    </svg>
  );
}

export function QuoteIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
    </svg>
  );
}

export function SidebarIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <rect x={3} y={3} width={18} height={18} rx={2} />
      <path d="M9 3v18" />
    </svg>
  );
}

export function PrintIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x={6} y={14} width={12} height={8} />
    </svg>
  );
}

export function StrikethroughIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <path d="M16 4H9a3 3 0 0 0-3 3c0 2 1.5 3 3 3" />
      <path d="M12 15c2 0 4 1 4 3a3 3 0 0 1-3 3H8" />
      <line x1={3} y1={12} x2={21} y2={12} />
    </svg>
  );
}

export function OrderedListIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <line x1={10} y1={6} x2={21} y2={6} />
      <line x1={10} y1={12} x2={21} y2={12} />
      <line x1={10} y1={18} x2={21} y2={18} />
      <path d="M4 6h1v4M3 10h3M4 14.5a1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 0 3H3.5l2 2.5H3" />
    </svg>
  );
}

export function TaskListIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <rect x={3} y={5} width={6} height={6} rx={1} />
      <path d="M5 8l1.5 1.5L9 6.5" />
      <line x1={13} y1={8} x2={21} y2={8} />
      <rect x={3} y={14} width={6} height={6} rx={1} />
      <line x1={13} y1={17} x2={21} y2={17} />
    </svg>
  );
}

export function HorizontalRuleIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      width={16}
      height={16}
      {...props}
    >
      <line x1={3} y1={12} x2={8} y2={12} />
      <line x1={10} y1={12} x2={14} y2={12} />
      <line x1={16} y1={12} x2={21} y2={12} />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <rect x={3} y={3} width={18} height={18} rx={2} />
      <circle cx={8.5} cy={8.5} r={1.5} />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function CodeBlockIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <rect x={2} y={3} width={20} height={18} rx={2} />
      <path d="M8 10l-2 2 2 2" />
      <path d="M16 10l2 2-2 2" />
    </svg>
  );
}

export function TableIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <rect x={3} y={3} width={18} height={18} rx={2} />
      <line x1={3} y1={9} x2={21} y2={9} />
      <line x1={3} y1={15} x2={21} y2={15} />
      <line x1={9} y1={3} x2={9} y2={21} />
      <line x1={15} y1={3} x2={15} y2={21} />
    </svg>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

export function RedoIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      {...props}
    >
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}
