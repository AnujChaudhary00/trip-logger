'use client'

import { Star, StickyNote, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { createRipple } from '@/lib/ripple'
import type { TripFilters, TripSortOption } from '@/types/trip'

interface TripFiltersProps {
  filters: TripFilters
  onChange: (filters: TripFilters) => void
}

const SORT_OPTIONS: { value: TripSortOption; label: string }[] = [
  { value: 'recent',        label: 'Newest first'   },
  { value: 'oldest',        label: 'Oldest first'   },
  { value: 'distance_desc', label: 'Distance: high → low' },
  { value: 'distance_asc',  label: 'Distance: low → high' },
]

export function TripFilters({ filters, onChange }: TripFiltersProps) {
  function toggle(key: 'memorable' | 'hasNotes') {
    onChange({ ...filters, [key]: !filters[key] })
  }

  function setSort(sort: TripSortOption) {
    onChange({ ...filters, sort })
  }

  const hasActiveFilter = filters.memorable || filters.hasNotes || filters.sort !== 'recent'

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Trip filters">
      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        <Select value={filters.sort} onValueChange={(v) => setSort(v as TripSortOption)}>
          <SelectTrigger className="h-8 w-auto min-w-[150px] text-xs" aria-label="Sort trips">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-5 w-px bg-border" aria-hidden="true" />

      {/* Memorable toggle */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'h-8 gap-1.5 overflow-hidden px-3 text-xs transition-all active:scale-95',
          filters.memorable && 'border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-400'
        )}
        onMouseDown={createRipple}
        onClick={() => toggle('memorable')}
        aria-pressed={filters.memorable}
      >
        <Star
          className={cn('h-3.5 w-3.5', filters.memorable ? 'fill-yellow-400 text-yellow-400' : '')}
          aria-hidden="true"
        />
        Memorable
      </Button>

      {/* Has notes toggle */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'h-8 gap-1.5 overflow-hidden px-3 text-xs transition-all active:scale-95',
          filters.hasNotes && 'border-primary bg-primary/10 text-primary hover:bg-primary/15'
        )}
        onMouseDown={createRipple}
        onClick={() => toggle('hasNotes')}
        aria-pressed={filters.hasNotes}
      >
        <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
        Has notes
      </Button>

      {/* Clear filters */}
      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground active:scale-95 overflow-hidden"
          onMouseDown={createRipple}
          onClick={() => onChange({ memorable: false, hasNotes: false, sort: 'recent' })}
        >
          Clear
        </Button>
      )}
    </div>
  )
}
