import { useSyncExternalStore } from 'react'

// Progreso guardado por aeronave y sección:
// { [aircraftId]: { [sectionId]: índices de los ítems marcados } }.
// Los índices cuentan solo los ítems marcables (sin sub-ítems).
// v2: la Rev. 20 cambió los ítems del G-1000, así que el progreso de v1 no se reutiliza.
const STORAGE_KEY = 'checklist-progress-v2'

const EMPTY = {}
const listeners = new Set()

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

let progress = load()

function save(next) {
  progress = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Almacenamiento no disponible (modo privado): el progreso vive solo en memoria.
  }
  listeners.forEach(listener => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function aircraftProgress(aircraftId) {
  return progress[aircraftId] ?? EMPTY
}

function saveAircraft(aircraftId, sectionsProgress) {
  save({ ...progress, [aircraftId]: sectionsProgress })
}

export function useProgress(aircraftId) {
  return useSyncExternalStore(subscribe, () => aircraftProgress(aircraftId))
}

export function checkableItems(section) {
  return section.items.filter(i => !i.isSubItem)
}

// Lista de booleanos, uno por ítem marcable de la sección.
export function sectionChecks(progressMap, section) {
  const total = checkableItems(section).length
  const stored = progressMap[section.id]
  const checks = Array(total).fill(false)
  if (Array.isArray(stored)) {
    stored.forEach(i => {
      if (Number.isInteger(i) && i >= 0 && i < total) checks[i] = true
    })
  }
  return checks
}

export function sectionDoneCount(progressMap, section) {
  return sectionChecks(progressMap, section).filter(Boolean).length
}

export function checklistTotals(progressMap, checklist) {
  const { sections } = checklist
  const total = sections.reduce((n, s) => n + checkableItems(s).length, 0)
  const done = sections.reduce((n, s) => n + sectionDoneCount(progressMap, s), 0)
  const sectionsDone = sections.filter(s => sectionDoneCount(progressMap, s) === checkableItems(s).length).length
  return { total, done, sectionsDone }
}

// Orden estricto: solo se puede marcar el primer ítem sin marcar.
// Desmarcar un ítem desmarca también todos los que le siguen.
export function toggleItem(aircraftId, section, index) {
  const current = aircraftProgress(aircraftId)
  const checks = sectionChecks(current, section)
  if (checks[index]) checks.fill(false, index)
  else if (index === checks.indexOf(false)) checks[index] = true
  else return
  saveAircraft(aircraftId, { ...current, [section.id]: checks.flatMap((checked, i) => (checked ? [i] : [])) })
}

export function resetSection(aircraftId, sectionId) {
  const { [sectionId]: _removed, ...rest } = aircraftProgress(aircraftId)
  saveAircraft(aircraftId, rest)
}

export function resetProgress(aircraftId) {
  const { [aircraftId]: _removed, ...rest } = progress
  save(rest)
}
