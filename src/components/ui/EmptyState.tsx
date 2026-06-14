'use client'

import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onAddTrip: () => void
}

export function EmptyState({ onAddTrip }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MapPin className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
      <h2 className="text-xl font-semibold">No trips logged yet</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Start tracking your driving trips to see them here.
      </p>
      <Button className="mt-6" onClick={onAddTrip}>
        Add Your First Trip
      </Button>
    </div>
  )
}
