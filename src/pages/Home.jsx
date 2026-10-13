import { useState } from 'react'
import { RotateCcw, Shield } from 'lucide-react'
import SectionCard from '../components/SectionCard'
import data from '../data/checklist.json'
import { checkableItems, resetProgress, sectionDoneCount, useProgress } from '../lib/progress'

const { meta, sections, colorLegend } = data

const preflight = sections.filter(s => s.group === 'preflight')
const flight = sections.filter(s => s.group === 'flight')

function GroupLabel({ label, count }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-amber-500">{label}</span>
      <span className="text-[11px] text-slate-600 font-medium">{count} secciones</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  )
}

function FlightProgress() {
  const progress = useProgress()
  const [confirming, setConfirming] = useState(false)

  const total = sections.reduce((n, s) => n + checkableItems(s).length, 0)
  const done = sections.reduce((n, s) => n + sectionDoneCount(progress, s), 0)
  const sectionsDone = sections.filter(s => sectionDoneCount(progress, s) === checkableItems(s).length).length
  const isComplete = done === total

  return (
    <div className="mb-7 p-4 rounded-xl bg-[#111D33] border border-white/5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">Progreso</p>
        <span className={`text-[13px] font-semibold tabular-nums ${isComplete ? 'text-emerald-400' : 'text-slate-200'}`}>
          {done}/{total} ítems
        </span>
      </div>

      <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : 'bg-amber-400'}`}
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[12px] text-slate-500">
          {sectionsDone}/{sections.length} secciones completas
        </span>

        {confirming ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setConfirming(false)}
              className="px-3 min-h-[44px] rounded-lg text-[13px] font-semibold text-slate-300 active:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                resetProgress()
                setConfirming(false)
              }}
              className="px-3 min-h-[44px] rounded-lg text-[13px] font-bold bg-red-500 text-white active:bg-red-600 transition-colors"
            >
              Reiniciar todo
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            disabled={done === 0}
            className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-lg text-[13px] font-semibold text-amber-400 active:bg-white/10 transition-colors disabled:text-slate-700 shrink-0"
          >
            <RotateCcw size={14} />
            Reiniciar
          </button>
        )}
      </div>

      {confirming && (
        <p className="mt-1 text-[12px] text-red-300">Se borrará el progreso de todas las secciones.</p>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 bg-[#0B1423]/95 backdrop-blur-sm border-b border-white/5 pt-safe-top">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#1E3A5F] border border-amber-500/30 shrink-0">
            <Shield size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-wide leading-tight">
              C-208B G-1000
            </h1>
            <p className="text-[11px] text-slate-500 tracking-widest uppercase">
              Lista de Verificación · FAC
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] text-slate-600 leading-snug">{meta.revision}</p>
            <p className="text-[10px] text-slate-600 leading-snug">{meta.od}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-5 pb-8 max-w-2xl mx-auto w-full">
        <FlightProgress />

        <section className="mb-7">
          <GroupLabel label="Pre-Vuelo" count={preflight.length} />
          <div className="flex flex-col gap-2">
            {preflight.map(section => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </section>

        <section className="mb-7">
          <GroupLabel label="Vuelo" count={flight.length} />
          <div className="flex flex-col gap-2">
            {flight.map(section => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </section>

        <div className="mt-6 p-4 rounded-xl bg-[#111D33] border border-white/5">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-3">Leyenda</p>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(colorLegend).map(([key, { label, color }]) => (
              <div key={key} className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[12px] text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-3 pb-safe-bottom">
          © 2026 CT LAGUNA WILSON - LAKE
        </p>
      </main>
    </div>
  )
}
