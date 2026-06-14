'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OfflineIndicatorProps {
  isOnline: boolean
  queueLength: number
}

export function OfflineIndicator({ isOnline, queueLength }: OfflineIndicatorProps) {
  if (isOnline && queueLength === 0) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300',
        !isOnline
          ? 'bg-destructive/10 text-destructive animate-pulse-badge'
          : 'bg-yellow-100 text-yellow-800'
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="h-3 w-3" aria-hidden="true" />
          Offline
        </>
      ) : (
        <>
          <RefreshCw className="h-3 w-3 animate-spin" aria-hidden="true" />
          Syncing {queueLength} pending
        </>
      )}
    </div>
  )
}
