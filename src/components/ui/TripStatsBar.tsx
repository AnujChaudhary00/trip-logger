'use client'

import { MapPin, Star, Navigation } from 'lucide-react'
import type { TripStats } from '@/types/trip'

interface TripStatsBarProps {
  stats: TripStats
  total: number
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
      icon: <MapPin className="h-5 w-5" aria-hidden="true" />,
      value: total,
      label: 'Total Trips',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      icon: <Navigation className="h-5 w-5" aria-hidden="true" />,
      value: distanceDisplay,
      label: 'Total Distance',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      icon: <Star className="h-5 w-5" aria-hidden="true" />,
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
