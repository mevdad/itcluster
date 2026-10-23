import { showImageLabels, sites } from "@/content/site";
import { Pin } from "./icons";

// Schematic (not geographic) map: only the relative position of the two cities matters.
// Rendered only when the geography is confirmed (content/site.ts → confirmed.geography).
export function SitesMap() {
  return (
    <div className="card relative overflow-hidden p-4 sm:p-6">
      <svg viewBox="0 0 400 220" className="h-auto w-full" role="img" aria-label="Схема: Санкт-Петербург на северо-западе, Москва южнее и восточнее">
        <defs>
          <pattern id="map-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#c9d0d9" strokeWidth="1" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="220" rx="16" fill="#f7f8fa" />
        <rect width="400" height="220" rx="16" fill="url(#map-grid)" />
        <path d="M120 58 C 170 70 210 120 262 150" fill="none" stroke="#2f6bff" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        {[
          { x: 120, y: 58, name: sites[1]?.city ?? "" },
          { x: 262, y: 150, name: sites[0]?.city ?? "" },
        ].map((p) => (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r="16" fill="#2f6bff" opacity="0.15" />
            <circle cx={p.x} cy={p.y} r="7" fill="#2f6bff" stroke="#fff" strokeWidth="3" />
            <text x={p.x + 16} y={p.y + 5} fontSize="15" fontWeight="700" fill="#12161b">
              {p.name}
            </text>
          </g>
        ))}
      </svg>
      {showImageLabels && (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <Pin className="size-4 text-accent-600" />
          Схема, не карта: показано только расположение площадок.
        </p>
      )}
    </div>
  );
}
