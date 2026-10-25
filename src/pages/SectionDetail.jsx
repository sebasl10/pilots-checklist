import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, CircleCheck, RotateCcw } from 'lucide-react'
import ChecklistItem from '../components/ChecklistItem'
import { useChecklist } from '../lib/checklistContext'
import {
  checkableItems,
  resetSection,
  sectionChecks,
  sectionDoneCount,
  toggleItem,
  useProgress,
} from '../lib/progress'

export default function SectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { meta, sections, colorLegend } = useChecklist()
  const home = `/${meta.id}`
  const sectionPath = sectionId => `${home}/section/${sectionId}`

  const orderedSections = [...sections].sort((a, b) => a.order - b.order)

  const sectionIndex = orderedSections.findIndex(s => s.id === id)
  const section = orderedSections[sectionIndex]
  const prevSection = orderedSections[sectionIndex - 1]
  const nextSection = orderedSections[sectionIndex + 1]

  const progress = useProgress(meta.id)
  const checks = section ? sectionChecks(progress, section) : []
  const doneCount = checks.filter(Boolean).length
  const currentIndex = checks.indexOf(false)

  const [confirmingReset, setConfirmingReset] = useState(false)

  // Al entrar en una sección: arriba, y luego hasta el ítem en curso si ya había progreso.
  useEffect(() => {
    setConfirmingReset(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.querySelector('[data-current]')?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [id])

  // Al marcar/desmarcar dentro de la misma sección: seguir el ítem en curso o el aviso de fin.
  const lastRender = useRef({ id, doneCount })
  useEffect(() => {
    const changedInPlace = lastRender.current.id === id && lastRender.current.doneCount !== doneCount
    lastRender.current = { id, doneCount }
    if (!changedInPlace) return
    document
      .querySelector('[data-current], [data-section-complete]')
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [id, doneCount])

  if (!section) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Sección no encontrada.</p>
        <button onClick={() => navigate(home)} className="text-amber-400 text-sm font-semibold">
          ← Volver
        </button>
      </div>
    )
  }

  const { title, subtitle, badge, items, order } = section
  const badges = badge ? (Array.isArray(badge) ? badge : [badge]) : []

  const usedIndicators = [...new Set(items.map(i => i.indicator).filter(Boolean))]
  const total = checkableItems(section).length
  const isComplete = doneCount === total
  const allSectionsComplete = orderedSections.every(
    s => sectionDoneCount(progress, s) === checkableItems(s).length
  )

  let checkIndex = 0
  const rows = items.map(item => ({ item, checkIndex: item.isSubItem ? null : checkIndex++ }))

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 bg-[#0B1423]/95 backdrop-blur-sm border-b border-white/5 pt-safe-top">
        <div className="flex items-center gap-3 px-2 py-3">
          <button
            onClick={() => navigate(home)}
            className="flex items-center gap-1 px-2 py-2 rounded-lg text-amber-400 active:bg-white/10 transition-colors min-w-[44px] min-h-[44px] justify-center"
            aria-label="Volver al menú principal"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-600 tabular-nums">
                {String(order).padStart(2, '0')}
              </span>
              <h1 className="text-[15px] font-bold text-slate-100 tracking-wide uppercase leading-tight truncate">
                {title}
              </h1>
              {badges.map(key => {
                const color = colorLegend[key]?.color
                return color ? (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                    style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-sm inline-block" style={{ backgroundColor: color }} />
                    {key.toUpperCase()}
                  </span>
                ) : null
              })}
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">{subtitle}</p>
            )}
          </div>

          <span
            className={`text-[12px] font-semibold tabular-nums shrink-0 ${isComplete ? 'text-emerald-400' : 'text-slate-400'}`}
          >
            {doneCount}/{total}
          </span>

          <button
            onClick={() => setConfirmingReset(c => !c)}
            disabled={doneCount === 0}
            className={`flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg transition-colors disabled:text-slate-700 ${confirmingReset ? 'bg-white/10 text-amber-400' : 'text-amber-400 active:bg-white/10'}`}
            aria-label="Reiniciar sección"
            aria-expanded={confirmingReset}
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {confirmingReset && (
          <div className="flex items-center justify-between gap-3 px-4 pb-3">
            <span className="text-[13px] text-red-300">¿Desmarcar los {doneCount} ítems de esta sección?</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setConfirmingReset(false)}
                className="px-3 min-h-[44px] rounded-lg text-[13px] font-semibold text-slate-300 active:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetSection(meta.id, id)
                  setConfirmingReset(false)
                }}
                className="px-3 min-h-[44px] rounded-lg text-[13px] font-bold bg-red-500 text-white active:bg-red-600 transition-colors"
              >
                Reiniciar
              </button>
            </div>
          </div>
        )}
        <div className="h-0.5 bg-white/5">
          <div
            className={`h-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
          />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full">
        <div className="border-b border-white/5">
          <div className="flex items-center px-4 py-2 gap-3 border-l-[3px] border-l-transparent">
            <span className="w-2 shrink-0" />
            <span className="w-6 shrink-0" />
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest w-7 shrink-0">#</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex-1">Elemento</span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Acción</span>
          </div>
        </div>

        <div>
          {rows.map(({ item, checkIndex }, idx) => (
            <ChecklistItem
              key={`${item.number}-${idx}`}
              item={item}
              status={checks[checkIndex] ? 'done' : checkIndex === currentIndex ? 'current' : 'locked'}
              onToggle={() => toggleItem(meta.id, section, checkIndex)}
            />
          ))}
        </div>

        {isComplete && (
          <div
            data-section-complete
            className="mx-4 mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 scroll-mb-28"
          >
            <div className="flex items-center gap-2 text-emerald-400">
              <CircleCheck size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">
                {!nextSection && allSectionsComplete ? 'Lista de verificación completa' : 'Sección completa'}
              </span>
            </div>

            {nextSection ? (
              <button
                onClick={() => navigate(sectionPath(nextSection.id))}
                className="mt-3 w-full flex items-center justify-between gap-2 px-4 min-h-[52px] rounded-lg bg-amber-400 text-[#0B1423] font-bold uppercase tracking-wide active:bg-amber-500 transition-colors"
              >
                <span className="truncate">Siguiente: {nextSection.title}</span>
                <ChevronRight size={22} className="shrink-0" />
              </button>
            ) : (
              <>
                {!allSectionsComplete && (
                  <p className="mt-1 text-[13px] text-slate-400">Quedan secciones pendientes en el menú.</p>
                )}
                <button
                  onClick={() => navigate(home)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 min-h-[52px] rounded-lg bg-amber-400 text-[#0B1423] font-bold uppercase tracking-wide active:bg-amber-500 transition-colors"
                >
                  Volver al menú
                </button>
              </>
            )}
          </div>
        )}

        {usedIndicators.length > 0 && (
          <div className="mx-4 my-6 p-4 rounded-xl bg-[#111D33] border border-white/5">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-3">Leyenda</p>
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

      <nav className="sticky bottom-0 z-10 bg-[#0B1423]/95 backdrop-blur-sm border-t border-white/5 pb-safe-bottom">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-2 px-2 py-2">
          {prevSection ? (
            <button
              onClick={() => navigate(sectionPath(prevSection.id))}
              className="flex items-center gap-1 px-2 min-h-[52px] rounded-lg text-left active:bg-white/10 transition-colors"
              aria-label={`Sección anterior: ${prevSection.title}`}
            >
              <ChevronLeft size={22} className="text-amber-400 shrink-0" />
              <span className="min-w-0">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Anterior</span>
                <span className="block text-[13px] font-semibold text-slate-100 uppercase truncate">{prevSection.title}</span>
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextSection ? (
            <button
              onClick={() => navigate(sectionPath(nextSection.id))}
              className="flex items-center justify-end gap-1 px-2 min-h-[52px] rounded-lg text-right active:bg-white/10 transition-colors"
              aria-label={`Sección siguiente: ${nextSection.title}`}
            >
              <span className="min-w-0">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Siguiente</span>
                <span className="block text-[13px] font-semibold text-slate-100 uppercase truncate">{nextSection.title}</span>
              </span>
              <ChevronRight size={22} className="text-amber-400 shrink-0" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </nav>
    </div>
  )
}
