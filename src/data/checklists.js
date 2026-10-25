import g1000 from './g1000.json'
import g600 from './g600.json'

// Una lista de verificación por aeronave, en el orden en que se muestran al elegir.
export const checklists = [g1000, g600]

export function getChecklist(aircraftId) {
  return checklists.find(c => c.meta.id === aircraftId)
}
