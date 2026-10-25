import { createContext, useContext } from 'react'

// Lista de verificación de la aeronave elegida (G-1000 o G-600).
export const ChecklistContext = createContext(null)

export function useChecklist() {
  return useContext(ChecklistContext)
}
