import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import ChecklistItem from '../components/ChecklistItem'
import data from '../data/checklist.json'

const { sections, colorLegend } = data

export default function SectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const section = sections.find(s => s.id === id)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  if (!section) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Section introuvable.</p>
        <button onClick={() => navigate('/')} className="text-amber-400 text-sm font-semibold">
          ← Retour
        </button>
      </div>
    )
  }

  const { title, subtitle, badge, items, order } = section
  const badgeColor = badge ? colorLegend[badge]?.color : null

  const usedIndicators = [...new Set(items.map(i => i.indicator).filter(Boolean))]
  const itemCount = items.filter(i => !i.isSubItem).length

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 bg-[#0B1423]/95 backdrop-blur-sm border-b border-white/5 pt-safe-top">
        <div className="flex items-center gap-3 px-2 py-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-2 py-2 rounded-lg text-amber-400 active:bg-white/10 transition-colors min-w-[44px] min-h-[44px] justify-center"
            aria-label="Retour à l'accueil"
          >
            <ChevronLeft size={22} />
            <span className="text-sm font-medium hidden sm:block">Retour</span>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-600 tabular-nums">
                {String(order).padStart(2, '0')}
              </span>
              <h1 className="text-[15px] font-bold text-slate-100 tracking-wide uppercase leading-tight truncate">
                {title}
              </h1>
              {badgeColor && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                  style={{
                    backgroundColor: badgeColor + '22',
                    color: badgeColor,
                    border: `1px solid ${badgeColor}44`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-sm inline-block" style={{ backgroundColor: badgeColor }} />
                  {badge?.toUpperCase()}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">{subtitle}</p>
            )}
          </div>

          <span className="text-[11px] text-slate-600 shrink-0 pr-2">{itemCount} items</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full">
        <div className="border-b border-white/5">
          <div className="flex items-center px-4 py-2 gap-6">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest w-7 shrink-0">#</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex-1">Élément</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Action</span>
          </div>
        </div>

        <div>
          {items.map((item, idx) => (
            <ChecklistItem key={`${item.number}-${idx}`} item={item} />
          ))}
        </div>

        {usedIndicators.length > 0 && (
          <div className="mx-4 my-6 p-4 rounded-xl bg-[#111D33] border border-white/5">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-3">Légende</p>
            <div className="flex flex-col gap-2">
              {usedIndicators.map(key => (
                <div key={key} className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: colorLegend[key].color }} />
                  <span className="text-[12px] text-slate-400">{colorLegend[key].label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="pb-safe-bottom pb-4" />
    </div>
  )
}
