import data from '../data/checklist.json'

const { colorLegend } = data

export default function ChecklistItem({ item }) {
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

  return (
    <div className="flex items-center gap-3 px-4 min-h-[52px] border-b border-white/5 active:bg-white/5 transition-colors">
      <div className="w-2 shrink-0">
        {indicatorColor && (
          <span
            className="block w-2 h-2 rounded-sm"
            style={{ backgroundColor: indicatorColor }}
            aria-label={colorLegend[indicator]?.label}
          />
        )}
      </div>

      <span className="text-xs text-slate-500 font-mono w-7 shrink-0 tabular-nums">{number}</span>

      <span className="flex-1 text-[15px] text-slate-100 leading-snug py-3">{name}</span>

      {action && (
        <span className="text-[13px] font-semibold text-amber-400 text-right shrink-0 max-w-[45%] leading-snug py-3">
          {action}
        </span>
      )}
    </div>
  )
}
