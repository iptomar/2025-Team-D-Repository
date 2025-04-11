import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import CursoCreate from './components/create/CursoCreate.jsx'
import DocenteCreate from './components/create/DocenteCreate.jsx'
import EscolaCreate from './components/create/EscolaCreate.jsx'
import UCCreate from './components/create/UCCreate.jsx'
import SalaCreate from './components/create/SalaCreate.jsx'
import CursoEdit from './components/edit_remove/Curso_edit_remove.jsx'
import DocenteEdit from './components/edit_remove/Docente_edit_remove.jsx'
import EscolaEdit from './components/edit_remove/Escola_edit_remove.jsx'
import UcEdit from './components/edit_remove/UC_edit_remove.jsx'
import SalaEdit from './components/edit_remove/Sala_edit_remove.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cursos" element={<CursoEdit />} />
        <Route path="/docentes" element={<DocenteEdit />} />
        <Route path="/ucs" element={<UcEdit />} />
        <Route path="/escolas" element={<EscolaEdit />} />
        <Route path="/salas" element={<SalaEdit />} />
        <Route path="/create-curso" element={<CursoCreate />} />
        <Route path="/create-docente" element={<DocenteCreate />} />
        <Route path="/create-escola" element={<EscolaCreate />} />
        <Route path="/create-uc" element={<UCCreate />} />
        <Route path="/create-sala" element={<SalaCreate />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
