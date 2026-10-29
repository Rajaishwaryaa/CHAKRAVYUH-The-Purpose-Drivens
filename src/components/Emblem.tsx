export function Emblem({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#10172A" />
      <path
        d="M12 32h12m16-14 10 14m-10 14 10-14M12 32c6-12 12-16 18-18m-18 18c6 12 12 16 18 18"
        stroke="#36D9F5"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="16" cy="32" r="4" fill="#36D9F5" />
      <circle cx="32" cy="16" r="4" fill="#4263EB" />
      <circle cx="48" cy="32" r="4" fill="#8B5CF6" />
      <circle cx="32" cy="48" r="5" fill="#FFB454" />
    </svg>
  )
}

export function HeroCircuit() {
  return (
    <div className="scene" aria-hidden="true">
      <svg viewBox="0 0 400 360">
        <g className="spin">
          <rect x="70" y="70" width="260" height="220" rx="18" fill="none" stroke="#36D9F5" strokeOpacity="0.35" />
          <path
            d="M90 180h50l20-40h40l20 80h40l20-40h50"
            fill="none"
            stroke="#36D9F5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="140" cy="180" r="7" fill="#FFB454" />
          <circle cx="200" cy="140" r="7" fill="#8B5CF6" />
          <circle cx="250" cy="220" r="7" fill="#4263EB" />
          <circle cx="310" cy="180" r="8" fill="#36D9F5" />
        </g>
        <text x="200" y="310" textAnchor="middle" fill="#d7e3f5" fontSize="13" fontFamily="Manrope, sans-serif">
          Circuit-inspired motion · not a SPICE model
        </text>
      </svg>
    </div>
  )
}
