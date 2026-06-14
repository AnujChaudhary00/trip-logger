'use client'

export function TripLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-label="Loading trips">
      <svg
        viewBox="0 0 200 96"
        className="w-52 h-auto text-primary"
        aria-hidden="true"
        fill="none"
      >
        {/* Road surface */}
        <rect x="0" y="78" width="200" height="5" rx="2" className="fill-muted" />

        {/* Moving road dashes */}
        <g className="animate-road-dash">
          <rect x="0"   y="79.5" width="22" height="2" rx="1" className="fill-muted-foreground" opacity="0.45" />
          <rect x="40"  y="79.5" width="22" height="2" rx="1" className="fill-muted-foreground" opacity="0.45" />
          <rect x="80"  y="79.5" width="22" height="2" rx="1" className="fill-muted-foreground" opacity="0.45" />
          <rect x="120" y="79.5" width="22" height="2" rx="1" className="fill-muted-foreground" opacity="0.45" />
          <rect x="160" y="79.5" width="22" height="2" rx="1" className="fill-muted-foreground" opacity="0.45" />
          <rect x="200" y="79.5" width="22" height="2" rx="1" className="fill-muted-foreground" opacity="0.45" />
        </g>

        {/* Whole car — bounce up/down */}
        <g className="animate-car-bounce">
          {/* Car body */}
          <rect x="20" y="44" width="160" height="26" rx="6" className="fill-primary" />

          {/* Cabin / roof */}
          <rect x="50" y="27" width="96" height="20" rx="8" className="fill-primary" />

          {/* Rear window (left side of cabin) */}
          <rect x="55" y="30" width="32" height="13" rx="3" fill="white" fillOpacity="0.22" />

          {/* Front windshield (right side of cabin) */}
          <rect x="107" y="30" width="32" height="13" rx="3" fill="white" fillOpacity="0.22" />

          {/* A-pillar separator */}
          <line x1="95" y1="27" x2="97" y2="47" stroke="white" strokeOpacity="0.12" strokeWidth="2" />

          {/* Headlight (front / right) */}
          <ellipse cx="178" cy="55" rx="5" ry="4.5" fill="white" fillOpacity="0.9" />
          <ellipse cx="178" cy="55" rx="3" ry="3" fill="#fde68a" fillOpacity="0.8" />

          {/* Rear taillight (left) */}
          <rect x="20" y="49" width="4" height="13" rx="2" fill="#f87171" fillOpacity="0.9" />

          {/* Door line detail */}
          <line x1="97" y1="47" x2="97" y2="70" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />

          {/* Rear wheel */}
          <circle cx="60"  cy="78" r="13" fill="white" />
          <circle cx="60"  cy="78" r="13" className="stroke-primary" strokeWidth="3.5" />
          <g className="animate-wheel-spin">
            <line x1="60" y1="67" x2="60" y2="89" className="stroke-primary" strokeWidth="2" strokeOpacity="0.55" />
            <line x1="49" y1="78" x2="71" y2="78" className="stroke-primary" strokeWidth="2" strokeOpacity="0.55" />
            <line x1="52" y1="70" x2="68" y2="86" className="stroke-primary" strokeWidth="1.5" strokeOpacity="0.35" />
            <line x1="68" y1="70" x2="52" y2="86" className="stroke-primary" strokeWidth="1.5" strokeOpacity="0.35" />
            <circle cx="60" cy="78" r="3.5" className="fill-primary" />
          </g>

          {/* Front wheel */}
          <circle cx="140" cy="78" r="13" fill="white" />
          <circle cx="140" cy="78" r="13" className="stroke-primary" strokeWidth="3.5" />
          <g className="animate-wheel-spin">
            <line x1="140" y1="67" x2="140" y2="89" className="stroke-primary" strokeWidth="2" strokeOpacity="0.55" />
            <line x1="129" y1="78" x2="151" y2="78" className="stroke-primary" strokeWidth="2" strokeOpacity="0.55" />
            <line x1="132" y1="70" x2="148" y2="86" className="stroke-primary" strokeWidth="1.5" strokeOpacity="0.35" />
            <line x1="148" y1="70" x2="132" y2="86" className="stroke-primary" strokeWidth="1.5" strokeOpacity="0.35" />
            <circle cx="140" cy="78" r="3.5" className="fill-primary" />
          </g>
        </g>
      </svg>

      <p className="text-sm text-muted-foreground tracking-wide">Loading your trips…</p>
    </div>
  )
}
