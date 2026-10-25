import { Check } from 'lucide-react'
import { useChecklist } from '../lib/checklistContext'

// status: 'done' | 'current' | 'locked'
// Un ítem marcado se desmarca con un segundo toque.
export default function ChecklistItem({ item, status, onToggle }) {
  const { colorLegend } = useChecklist()
  const { number, name, action, indicator, isSubItem } = item

  const indicatorColor = indicator ? colorLegend[indicator]?.color : null

  if (isSubItem) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 pl-10 border-b border-white/5">
        <span className="text-xs text-slate-500 font-mono w-8 shrink-0">{number}</span>
        <span className="text-sm text-slate-400 italic">{name}</span>
      </div>
    )
  }

  const isDone = status === 'done'
  const isCurrent = status === 'current'
  const interactive = isCurrent || isDone

  return (
    <button
      type="button"
      onClick={interactive ? onToggle : undefined}
      disabled={!interactive}
      aria-pressed={isDone}
      data-current={isCurrent || undefined}
      className={[
        'w-full text-left flex items-center gap-3 px-4 min-h-[56px] border-b border-white/5 border-l-[3px] transition-colors scroll-mt-24 scroll-mb-28',
        isCurrent ? 'border-l-amber-400 bg-amber-400/10 active:bg-amber-400/20' : 'border-l-transparent',
        isDone ? 'active:bg-white/5' : '',
        status === 'locked' ? 'opacity-40' : '',
      ].join(' ')}
    >
      <div className="w-2 shrink-0">
        {indicatorColor && (
          <span
            className="block w-2 h-2 rounded-sm"
            style={{ backgroundColor: indicatorColor }}
            aria-label={colorLegend[indicator]?.label}
          />
        )}
      </div>

      <span
        className={[
          'flex items-center justify-center w-6 h-6 rounded-full border-2 shrink-0 transition-colors',
          isDone ? 'bg-emerald-500 border-emerald-500' : isCurrent ? 'border-amber-400' : 'border-slate-600',
        ].join(' ')}
      >
        {isDone && <Check size={14} strokeWidth={3} className="text-[#0B1423]" />}
      </span>

      <span className="text-xs text-slate-500 font-mono w-7 shrink-0 tabular-nums">{number}</span>

      <span className={`flex-1 text-[15px] leading-snug py-3 ${isDone ? 'text-slate-500' : 'text-slate-100'}`}>
        {name}
      </span>

      {action && (
        <span
          className={`text-[13px] font-semibold text-right shrink-0 max-w-[40%] leading-snug py-3 ${isDone ? 'text-slate-500' : 'text-amber-400'}`}
        >
          {action}
        </span>
      )}
    </button>
  )
}
