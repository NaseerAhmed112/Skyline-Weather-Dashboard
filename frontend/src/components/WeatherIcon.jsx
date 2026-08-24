// Lightweight inline SVG icon set matching the screenshot aesthetics.
// Blue-outline style for weather and UI telemetry.

const common = {
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function getSvgProps(props) {
  const { size, ...rest } = props;
  return {
    width: size || 24,
    height: size || 24,
    ...common,
    ...rest,
  };
}

export function Sun(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" />
      <path
        stroke="currentColor"
        d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77"
      />
    </svg>
  );
}

export function Cloud(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M17.5 19a4.5 4.5 0 1 0-1.44-8.765 5 5 0 1 0-9.302 3.717A4 4 0 0 0 8 19h9.5Z"
      />
    </svg>
  );
}

export function PartlyCloudy(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M12 4V2M4.93 4.93 3.52 3.52M2 12H4M19.07 4.93l1.41-1.41M15.5 7.5A4.5 4.5 0 0 0 12 6"
      />
      <path
        stroke="currentColor"
        d="M17 19a4 4 0 1 0-1.28-7.79 4.5 4.5 0 1 0-8.37 3.3A3.5 3.5 0 0 0 8.5 19H17Z"
      />
    </svg>
  );
}

export function Rain(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M16 12a4.5 4.5 0 1 0-1.44-8.765 5 5 0 1 0-9.302 3.717A4 4 0 0 0 6.5 12H16Z"
      />
      <path stroke="currentColor" d="M8 15.5l-1 3.5M12 15.5l-1 3.5M16 15.5l-1 3.5" />
    </svg>
  );
}

export function Drizzle(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M16 12a4.5 4.5 0 1 0-1.44-8.765 5 5 0 1 0-9.302 3.717A4 4 0 0 0 6.5 12H16Z"
      />
      <path stroke="currentColor" d="M8 15v2M12 15v2M16 15v2M8 19v1.5M12 19v1.5M16 19v1.5" />
    </svg>
  );
}

export function Snow(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M16 12a4.5 4.5 0 1 0-1.44-8.765 5 5 0 1 0-9.302 3.717A4 4 0 0 0 6.5 12H16Z"
      />
      <path stroke="currentColor" d="M8 15.5v3M6.5 17h3M12 15.5v3M10.5 17h3M16 15.5v3M14.5 17h3" />
    </svg>
  );
}

export function Haze(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M6 7h12M4 11h16M6 15h12M8 19h8" />
    </svg>
  );
}

export function Breezy(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M17.5 18a3.5 3.5 0 1 0-1.12-6.82 4 4 0 1 0-7.44 2.89A3 3 0 0 0 7.5 18h10Z"
      />
      <path stroke="currentColor" d="M3 21h12M2 17h4" />
    </svg>
  );
}

export function Storm(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M16 11.5a4.5 4.5 0 1 0-1.44-8.765 5 5 0 1 0-9.302 3.717A4 4 0 0 0 6.5 11.5H16Z"
      />
      <path stroke="currentColor" d="m12 13-2.5 4h3L10 21" />
    </svg>
  );
}

// Telemetry & UI icons
export function ThermometerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

export function DropletIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export function WindIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"
      />
    </svg>
  );
}

export function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
    </svg>
  );
}

export function SunriseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M12 2v6m0 0-3-3m3 3 3-3M2 20h20M4 16a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function SunsetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M12 8V2m0 6-3-3m3 3 3-3M2 20h20M4 16a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function PulseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <circle cx="11" cy="11" r="8" stroke="currentColor" />
      <path stroke="currentColor" d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <rect width="7" height="7" x="3" y="3" rx="1.5" stroke="currentColor" />
      <rect width="7" height="7" x="14" y="3" rx="1.5" stroke="currentColor" />
      <rect width="7" height="7" x="14" y="14" rx="1.5" stroke="currentColor" />
      <rect width="7" height="7" x="3" y="14" rx="1.5" stroke="currentColor" />
    </svg>
  );
}

export function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path stroke="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" stroke="currentColor" />
      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" />
      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" />
      <polyline points="10 9 9 9 8 9" stroke="currentColor" />
    </svg>
  );
}

export function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        stroke="currentColor"
      />
    </svg>
  );
}

export function BrandLogoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...getSvgProps(props)}>
      <path
        stroke="currentColor"
        d="M17.5 19a4.5 4.5 0 1 0-1.44-8.765 5 5 0 1 0-9.302 3.717A4 4 0 0 0 8 19h9.5Z"
      />
      <path stroke="currentColor" d="M9 13.5v4M12 11.5v6M15 13.5v4" />
    </svg>
  );
}

const ICONS = {
  sun: Sun,
  clear: Sun,
  cloud: Cloud,
  "partly-cloudy": PartlyCloudy,
  rain: Rain,
  drizzle: Drizzle,
  snow: Snow,
  haze: Haze,
  storm: Storm,
  breezy: Breezy,
};

export default function WeatherIcon({ icon = "cloud", size = 40, className = "", style }) {
  const Cmp = ICONS[icon] || Cloud;
  return (
    <Cmp
      size={size}
      className={`weather-icon ${className}`}
      style={style}
    />
  );
}
