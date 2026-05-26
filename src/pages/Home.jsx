import { Shield } from 'lucide-react'
import SectionCard from '../components/SectionCard'
import data from '../data/checklist.json'

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
          © {new Date().getFullYear()} NexAI. All rights reserved.
        </p>
      </main>
    </div>
  )
}
