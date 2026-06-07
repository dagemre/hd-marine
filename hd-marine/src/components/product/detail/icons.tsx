/**
 * Ürün detay sayfası ikonları — spec etiketine / özellik başlığına göre
 * anahtar kelime eşleşmesiyle uygun çizgi ikon seçilir (içerik değil, sunum).
 */

type IconProps = { className?: string };

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Svg({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      {children}
    </svg>
  );
}

/* --- ikonlar --- */

export const GaugeIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 13a7 7 0 1 1 14 0" {...stroke} />
    <path d="M12 13 15.5 9.5" {...stroke} />
    <path d="M4 17h16" {...stroke} />
  </Svg>
);

export const FlowIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 8h11a3 3 0 1 0-3-3" {...stroke} />
    <path d="M3 13h15a3 3 0 1 1-3 3" {...stroke} />
    <path d="M3 18h6" {...stroke} />
  </Svg>
);

export const BoltIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" {...stroke} />
  </Svg>
);

export const ThermometerIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z" {...stroke} />
    <path d="M12 17v-5" {...stroke} />
  </Svg>
);

export const LayersIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" {...stroke} />
    <path d="m3 13 9 5 9-5" {...stroke} />
  </Svg>
);

export const VolumeIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" {...stroke} />
    <path d="M15 9.5a4 4 0 0 1 0 5" {...stroke} />
    <path d="M17.5 7a8 8 0 0 1 0 10" {...stroke} />
  </Svg>
);

export const RotateIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6" {...stroke} />
    <path d="M20 4v4h-4" {...stroke} />
  </Svg>
);

export const RulerIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="3" y="9" width="18" height="6" rx="1" {...stroke} />
    <path d="M7 9v3m4-3v3m4-3v3" {...stroke} />
  </Svg>
);

export const ScaleIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3v4m0 0L6 7m6 0 6 0" {...stroke} />
    <path d="m6 7-3 7a3.5 3.5 0 0 0 6 0L6 7Zm12 0-3 7a3.5 3.5 0 0 0 6 0l-3-7Z" {...stroke} />
    <path d="M9 21h6" {...stroke} />
    <path d="M12 17v4" {...stroke} />
  </Svg>
);

export const DropIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" {...stroke} />
  </Svg>
);

export const WaveIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M2 12h2l2-5 3 10 3-14 3 12 2-3h5" {...stroke} />
  </Svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8.5" {...stroke} />
    <path d="M12 7.5V12l3 2" {...stroke} />
  </Svg>
);

export const ShieldIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z" {...stroke} />
    <path d="m9 12 2 2 4-4" {...stroke} />
  </Svg>
);

export const WrenchIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path
      d="M14.5 6.5a4 4 0 0 0-5.6 4.7L4 16.1a2 2 0 1 0 2.8 2.8l4.9-4.9a4 4 0 0 0 4.7-5.6L13.5 11l-2-2 3-2.5Z"
      {...stroke}
    />
  </Svg>
);

export const ToolboxIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="3" y="8" width="18" height="12" rx="2" {...stroke} />
    <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" {...stroke} />
    <path d="M3 13h18" {...stroke} />
    <path d="M10 13v2h4v-2" {...stroke} />
  </Svg>
);

export const GlobeIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8.5" {...stroke} />
    <path d="M3.5 12h17" {...stroke} />
    <path d="M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5S14.5 18.2 12 20.5c-2.5-2.3-3.8-5.2-3.8-8.5S9.5 5.8 12 3.5Z" {...stroke} />
  </Svg>
);

export const CheckCircleIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8.5" {...stroke} />
    <path d="m8.5 12 2.5 2.5 4.5-5" {...stroke} />
  </Svg>
);

export const CogIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="3" {...stroke} />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
      {...stroke}
    />
  </Svg>
);

/* --- anahtar kelime eşlemesi --- */

type IconComponent = (props: IconProps) => React.ReactNode;

/** Sıra önemli: ilk eşleşen kazanır (TR + EN anahtar kelimeler) */
const KEYWORD_ICONS: [RegExp, IconComponent][] = [
  [/sıcaklı|temperat|°c/i, ThermometerIcon],
  [/basınç|pressure|bar\b|mbar/i, GaugeIcon],
  [/debi|flow|kapasite|capacity|m³|m3/i, FlowIcon],
  [/volt|elektrik|electric|güç|power|motor|kw|hp/i, BoltIcon],
  [/gürültü|noise|ses\b|sound|dba|db\b/i, VolumeIcon],
  [/malzeme|material|gövde|body|döküm|paslanmaz|stainless|alümin/i, LayersIcon],
  [/ağırlık|weight|kg\b/i, ScaleIcon],
  [/viskozite|viscosity|yağ\b|oil|sıvı|fluid|liquid|akışkan/i, DropIcon],
  [/boyut|ölçü|dimension|size|bağlantı|connection|çap|diameter|inch|inç/i, RulerIcon],
  [/prensib|principle|çalışma|operat|emiş|suction|üfleme/i, RotateIcon],
  [/titreşim|vibrat|sessiz|quiet/i, WaveIcon],
  [/performans|performance|verim|efficien/i, GaugeIcon],
  [/ömür|dayanık|life|durab|sağlam/i, ClockIcon],
  [/enerji|energy|tasarruf|saving/i, BoltIcon],
  [/bakım|maintenance|servis|service|yedek|spare/i, ToolboxIcon],
  [/kullanım|alan|use|application|endüstri|industr|çok yönlü|versatile/i, GlobeIcon],
  [/kalite|quality|güven|reliab|garanti|warrant/i, ShieldIcon],
];

/** Etikete göre ikon seç — eşleşme yoksa genel dişli ikonu */
export function iconFor(label: string): IconComponent {
  for (const [re, Icon] of KEYWORD_ICONS) {
    if (re.test(label)) return Icon;
  }
  return CogIcon;
}
