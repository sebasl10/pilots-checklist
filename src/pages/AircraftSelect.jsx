import { ChevronRight, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { checklists } from '../data/checklists'
import { checklistTotals, useProgress } from '../lib/progress'

function AircraftCard({ checklist }) {
  const navigate = useNavigate()
  const { meta } = checklist
  const progress = useProgress(meta.id)
  const { total, done } = checklistTotals(progress, checklist)
  const isComplete = done === total
  const [model, avionics] = meta.aircraft.split(' ')

  return (
    <button
      onClick={() => navigate(`/${meta.id}`)}
      className="w-full text-left flex items-center gap-4 px-5 py-5 rounded-2xl bg-[#111D33] border border-white/5 active:scale-[0.98] transition-all duration-150 hover:border-amber-500/30 hover:bg-[#152240] group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">{model}</p>
        <p className="text-2xl font-bold text-amber-400 tracking-wide leading-tight">{avionics}</p>
        <p className="text-[11px] text-slate-500 mt-1">
          {meta.revision} · {meta.od}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className={`text-xs tabular-nums shrink-0 ${isComplete ? 'text-emerald-400' : 'text-slate-400'}`}>
            {done}/{total} ítems
          </span>
          <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-amber-400'}`}
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <ChevronRight
        size={22}
        className="text-slate-600 shrink-0 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all"
      />
    </button>
  )
}

export default function AircraftSelect() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 bg-[#0B1423]/95 backdrop-blur-sm border-b border-white/5 pt-safe-top">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#1E3A5F] border border-amber-500/30 shrink-0">
            <Shield size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-wide leading-tight">C-208B</h1>
            <p className="text-[11px] text-slate-500 tracking-widest uppercase">Lista de Verificación · FAC</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-amber-500">Seleccione la aeronave</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="flex flex-col gap-3">
          {checklists.map(checklist => (
            <AircraftCard key={checklist.meta.id} checklist={checklist} />
          ))}
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-8 pb-safe-bottom">© 2026 CT LAGUNA WILSON - LAKE</p>
      </main>
    </div>
  )
}
