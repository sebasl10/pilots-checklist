import { useSyncExternalStore } from 'react'

// Progreso guardado por sección: { [sectionId]: índices de los ítems marcados }.
// Los índices cuentan solo los ítems marcables (sin sub-ítems).
const STORAGE_KEY = 'checklist-progress-v1'

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

export function useProgress() {
  return useSyncExternalStore(subscribe, () => progress)
}

export function checkableItems(section) {
  return section.items.filter(i => !i.isSubItem)
}

// Lista de booleanos, uno por ítem marcable de la sección.
export function sectionChecks(progressMap, section) {
  const total = checkableItems(section).length
  const stored = progressMap[section.id]
  // Versión anterior: se guardaba solo el número de ítems marcados desde el inicio.
  const indices = Array.isArray(stored) ? stored : Array.from({ length: Number(stored) || 0 }, (_, i) => i)
  const checks = Array(total).fill(false)
  indices.forEach(i => {
    if (Number.isInteger(i) && i >= 0 && i < total) checks[i] = true
  })
  return checks
}

export function sectionDoneCount(progressMap, section) {
  return sectionChecks(progressMap, section).filter(Boolean).length
}

// Orden estricto: solo se puede marcar el primer ítem sin marcar.
// Desmarcar un ítem desmarca también todos los que le siguen.
export function toggleItem(section, index) {
  const checks = sectionChecks(progress, section)
  if (checks[index]) checks.fill(false, index)
  else if (index === checks.indexOf(false)) checks[index] = true
  else return
  save({ ...progress, [section.id]: checks.flatMap((checked, i) => (checked ? [i] : [])) })
}

export function resetSection(sectionId) {
  const { [sectionId]: _removed, ...rest } = progress
  save(rest)
}

export function resetProgress() {
  save({})
}
