import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom'
import AircraftSelect from './pages/AircraftSelect'
import Home from './pages/Home'
import SectionDetail from './pages/SectionDetail'
import { getChecklist } from './data/checklists'
import { ChecklistContext } from './lib/checklistContext'

function AircraftLayout() {
  const { aircraft } = useParams()
  const checklist = getChecklist(aircraft)

  if (!checklist) return <Navigate to="/" replace />

  return (
    <ChecklistContext.Provider value={checklist}>
      <Outlet />
    </ChecklistContext.Provider>
  )
}

// Enlaces de la versión anterior (solo G-1000): /section/:id
function LegacySectionRedirect() {
  const { id } = useParams()
  return <Navigate to={`/g1000/section/${id}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AircraftSelect />} />
        <Route path="/section/:id" element={<LegacySectionRedirect />} />
        <Route path="/:aircraft" element={<AircraftLayout />}>
          <Route index element={<Home />} />
          <Route path="section/:id" element={<SectionDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
