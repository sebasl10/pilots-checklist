import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SectionDetail from './pages/SectionDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/section/:id" element={<SectionDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
