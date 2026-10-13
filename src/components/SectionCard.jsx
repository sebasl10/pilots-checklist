import { Check, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import data from '../data/checklist.json'
import { checkableItems, sectionDoneCount, useProgress } from '../lib/progress'

const { colorLegend } = data

const GROUP_ICONS = {
  preflight: '✈',
  flight: '🛫',
}

export default function SectionCard({ section }) {
  const navigate = useNavigate()
  const { id, title, subtitle, order, badge, group } = section

  const progress = useProgress()
  const total = checkableItems(section).length
  const doneCount = sectionDoneCount(progress, section)
  const isComplete = doneCount === total
  const badges = badge ? (Array.isArray(badge) ? badge : [badge]) : []

  return (
    <button
      onClick={() => navigate(`/section/${id}`)}
      className="w-full text-left flex items-center gap-4 px-4 py-4 rounded-xl bg-[#111D33] border border-white/5 active:scale-[0.98] transition-all duration-150 hover:border-amber-500/30 hover:bg-[#152240] group"
    >
      {isComplete ? (
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 shrink-0" aria-label="Sección completa">
          <Check size={18} strokeWidth={3} className="text-[#0B1423]" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-[#1E3A5F] shrink-0">
          <span className="text-xs font-bold text-amber-400 tabular-nums leading-none">{String(order).padStart(2, '0')}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] font-semibold text-slate-100 leading-tight tracking-wide uppercase">
            {title}
          </span>
          {badges.map(key => {
            const color = colorLegend[key]?.color
            return color ? (
              <span
                key={key}
                className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
              >
                <span className="w-1.5 h-1.5 rounded-sm inline-block" style={{ backgroundColor: color }} />
                {key.toUpperCase()}
              </span>
            ) : null
          })}
        </div>
        {subtitle && (
          <span className="text-xs text-slate-500 block mt-0.5 uppercase tracking-wider">{subtitle}</span>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-xs tabular-nums shrink-0 ${isComplete ? 'text-emerald-400' : 'text-slate-500'}`}>
            {doneCount}/{total} ítems
          </span>
          {doneCount > 0 && (
            <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-amber-400'}`}
                style={{ width: `${(doneCount / total) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <ChevronRight
        size={18}
        className="text-slate-600 shrink-0 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all"
      />
    </button>
  )
}
