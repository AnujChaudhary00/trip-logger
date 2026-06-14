'use client'

import { X } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteToast({ id }: { id: string | number }) {
  return (
    <div className="flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg">
      <style>{`
        @keyframes dtl-del-lid {
          0%   { transform: rotate(0deg); }
          18%  { transform: rotate(-26deg); }
          72%  { transform: rotate(-26deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes dtl-del-fall {
          0%   { transform: translateY(0) rotate(-4deg); opacity: 1; }
          55%  { transform: translateY(15px) rotate(-2deg); opacity: 1; }
          72%  { transform: translateY(17px) rotate(-2deg); opacity: 0; }
          100% { transform: translateY(17px); opacity: 0; }
        }
        @keyframes dtl-del-spark {
          0%   { transform: scale(0); opacity: 0; }
          35%  { transform: scale(1.7); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        .dtl-del-lid { transform-box: fill-box; transform-origin: center bottom; animation: dtl-del-lid 1.8s 0.15s ease-in-out forwards; }
        .dtl-del-p1  { transform-box: fill-box; transform-origin: center center; animation: dtl-del-fall 1.0s 0.30s ease-in forwards; }
        .dtl-del-p2  { transform-box: fill-box; transform-origin: center center; animation: dtl-del-fall 1.0s 0.52s ease-in forwards; }
        .dtl-del-p3  { transform-box: fill-box; transform-origin: center center; animation: dtl-del-fall 1.0s 0.74s ease-in forwards; }
        .dtl-del-s1  { transform-box: fill-box; transform-origin: center; animation: dtl-del-spark 0.65s 1.25s ease-out forwards; }
        .dtl-del-s2  { transform-box: fill-box; transform-origin: center; animation: dtl-del-spark 0.65s 1.42s ease-out forwards; }
        .dtl-del-s3  { transform-box: fill-box; transform-origin: center; animation: dtl-del-spark 0.65s 1.58s ease-out forwards; }
        .dtl-del-s4  { transform-box: fill-box; transform-origin: center; animation: dtl-del-spark 0.65s 1.72s ease-out forwards; }
        .dtl-del-s5  { transform-box: fill-box; transform-origin: center; animation: dtl-del-spark 0.65s 1.88s ease-out forwards; }
      `}</style>

      {/* Animated SVG */}
      <svg viewBox="0 0 56 56" className="h-14 w-14 shrink-0" aria-hidden="true">
        {/* Bin body */}
        <rect x="6" y="20" width="44" height="33" rx="4" fill="white" stroke="#7C3AED" strokeWidth="2" />
        {/* Stripe lines */}
        <line x1="17" y1="26" x2="17" y2="47" stroke="#7C3AED" strokeOpacity="0.25" strokeWidth="1.5" />
        <line x1="28" y1="26" x2="28" y2="47" stroke="#7C3AED" strokeOpacity="0.25" strokeWidth="1.5" />
        <line x1="39" y1="26" x2="39" y2="47" stroke="#7C3AED" strokeOpacity="0.25" strokeWidth="1.5" />

        {/* Papers — rendered BEFORE lid so lid paints over them */}
        <rect className="dtl-del-p1" x="9"  y="3" width="12" height="17" rx="2" fill="#7C3AED" fillOpacity="0.85" />
        <rect className="dtl-del-p2" x="22" y="3" width="12" height="15" rx="2" fill="#0EA5E9" fillOpacity="0.85" />
        <rect className="dtl-del-p3" x="35" y="5" width="12" height="15" rx="2" fill="#F59E0B" fillOpacity="0.85" />

        {/* Sparkle dots */}
        <circle className="dtl-del-s1" cx="12" cy="22" r="3"   fill="#0EA5E9" opacity="0" />
        <circle className="dtl-del-s2" cx="44" cy="20" r="2.5" fill="#F59E0B" opacity="0" />
        <circle className="dtl-del-s3" cx="28" cy="17" r="2.5" fill="#7C3AED" opacity="0" />
        <circle className="dtl-del-s4" cx="8"  cy="34" r="2"   fill="#10B981" opacity="0" />
        <circle className="dtl-del-s5" cx="48" cy="36" r="2"   fill="#F43F5E" opacity="0" />

        {/* Lid group — rendered LAST so it covers papers */}
        <g className="dtl-del-lid">
          <rect x="3"  y="10" width="50" height="10" rx="3" fill="#7C3AED" />
          <rect x="20" y="3"  width="16" height="8"  rx="3" fill="#6D28D9" />
        </g>
      </svg>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-card-foreground">Trip deleted</p>
        <p className="text-xs text-muted-foreground">Removed from your log</p>
      </div>

      <button
        onClick={() => toast.dismiss(id)}
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
