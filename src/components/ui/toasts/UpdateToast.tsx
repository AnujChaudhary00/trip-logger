'use client'

import { X } from 'lucide-react'
import { toast } from 'sonner'

export function UpdateToast({ id }: { id: string | number }) {
  return (
    <div className="flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg">
      <style>{`
        @keyframes dtl-upd-doc {
          0%   { transform: scale(0.75); opacity: 0; }
          65%  { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes dtl-upd-check {
          from { stroke-dashoffset: 44; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes dtl-upd-pen {
          0%   { offset-distance: 0%;   opacity: 0; }
          5%   { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes dtl-upd-badge {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes dtl-upd-spark {
          0%   { transform: scale(0); opacity: 0; }
          35%  { transform: scale(1.8); opacity: 1; }
          100% { transform: scale(0);   opacity: 0; }
        }
        .dtl-upd-doc   { transform-box: fill-box; transform-origin: center; animation: dtl-upd-doc 0.45s ease-out forwards; }
        .dtl-upd-check {
          stroke-dasharray: 44;
          stroke-dashoffset: 44;
          animation: dtl-upd-check 0.85s 0.45s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .dtl-upd-pen {
          offset-path: path("M13,36 L23,46 L41,24");
          offset-rotate: auto;
          animation: dtl-upd-pen 1.1s 0.45s ease-in-out forwards;
          opacity: 0;
        }
        .dtl-upd-badge { transform-box: fill-box; transform-origin: center; animation: dtl-upd-badge 0.4s 1.28s cubic-bezier(0.175,0.885,0.32,1.275) forwards; opacity: 0; }
        .dtl-upd-s1    { transform-box: fill-box; transform-origin: center; animation: dtl-upd-spark 0.6s 1.3s ease-out forwards; }
        .dtl-upd-s2    { transform-box: fill-box; transform-origin: center; animation: dtl-upd-spark 0.6s 1.5s ease-out forwards; }
        .dtl-upd-s3    { transform-box: fill-box; transform-origin: center; animation: dtl-upd-spark 0.6s 1.7s ease-out forwards; }
      `}</style>

      {/* Animated SVG */}
      <svg viewBox="0 0 56 56" className="h-14 w-14 shrink-0" aria-hidden="true">
        {/* Document body */}
        <g className="dtl-upd-doc">
          <rect x="6" y="3" width="38" height="50" rx="4" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.5" />
          {/* Fold corner */}
          <path d="M36 3 L44 11 L36 11 Z" fill="#DDD6FE" />
          {/* Text lines */}
          <rect x="12" y="20" width="22" height="2.5" rx="1" fill="#C4B5FD" />
          <rect x="12" y="28" width="18" height="2.5" rx="1" fill="#C4B5FD" />
          <rect x="12" y="36" width="14" height="2.5" rx="1" fill="#C4B5FD" />
        </g>

        {/* Checkmark path (drawn via stroke-dashoffset) */}
        <path
          className="dtl-upd-check"
          d="M13,36 L23,46 L41,24"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pen tip that travels the checkmark path */}
        <rect className="dtl-upd-pen" x="-4" y="-4" width="8" height="8" rx="2" fill="#6D28D9" />

        {/* Success badge (pops after check finishes) */}
        <g className="dtl-upd-badge">
          <circle cx="44" cy="44" r="10" fill="#10B981" />
          <path d="M39,44 L43,48 L49,39" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Sparkle dots */}
        <circle className="dtl-upd-s1" cx="8"  cy="44" r="3"   fill="#7C3AED" opacity="0" />
        <circle className="dtl-upd-s2" cx="28" cy="52" r="2.5" fill="#0EA5E9" opacity="0" />
        <circle className="dtl-upd-s3" cx="50" cy="22" r="2.5" fill="#F59E0B" opacity="0" />
      </svg>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-card-foreground">Trip updated</p>
        <p className="text-xs text-muted-foreground">Changes saved successfully</p>
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
