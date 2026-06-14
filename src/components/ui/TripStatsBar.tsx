'use client'

import type { TripStats } from '@/types/trip'

interface TripStatsBarProps {
  stats: TripStats
  total: number
}

function SuitcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15"/>
      <line x1="2" y1="12.5" x2="22" y2="12.5" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="9" y1="6" x2="9" y2="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45"/>
      <line x1="15" y1="6" x2="15" y2="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45"/>
      <circle cx="7" cy="21.5" r="1.2" fill="currentColor"/>
      <circle cx="17" cy="21.5" r="1.2" fill="currentColor"/>
    </svg>
  )
}

function RoadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M12 3 L3 21 H21 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <line x1="12" y1="7" x2="12" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="11.5" x2="12" y2="14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="16.5" x2="12" y2="19.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"/>
    </svg>
  )
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M8.5 6V4.5A.5.5 0 0 1 9 4h6a.5.5 0 0 1 .5.5V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.12"/>
      <circle cx="12" cy="13" r="3.8" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="13" r="1.8" fill="currentColor" fillOpacity="0.4"/>
      <rect x="17" y="9" width="2" height="2" rx="0.5" fill="currentColor"/>
    </svg>
  )
}

export function TripStatsBar({ stats, total }: TripStatsBarProps) {
  const { memorableCount, totalDistanceKm, totalDistanceMiles } = stats

  const distanceDisplay = (() => {
    if (totalDistanceKm > 0 && totalDistanceMiles > 0) {
      return `${totalDistanceKm.toFixed(1)} km / ${totalDistanceMiles.toFixed(1)} mi`
    }
    if (totalDistanceKm > 0) return `${totalDistanceKm.toFixed(1)} km`
    if (totalDistanceMiles > 0) return `${totalDistanceMiles.toFixed(1)} mi`
    return '0 km'
  })()

  const cards = [
    {
      icon: <SuitcaseIcon className="h-5 w-5" />,
      value: total,
      label: 'Total Trips',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: <RoadIcon className="h-5 w-5" />,
      value: distanceDisplay,
      label: 'Total Distance',
      color: 'text-[hsl(var(--secondary))]',
      bg: 'bg-[hsl(var(--secondary)/0.12)]',
    },
    {
      icon: <CameraIcon className="h-5 w-5" />,
      value: memorableCount,
      label: 'Memorable',
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3" role="region" aria-label="Trip statistics">
      {cards.map(({ icon, value, label, color, bg }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
            {icon}
          </span>
          <div className="min-w-0">
            <p className={`truncate text-lg font-bold leading-tight ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
