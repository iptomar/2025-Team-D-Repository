import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BackOffice from '../pages/BackOffice';
import Docentes from '../components/edit_remove/Docentes.jsx';
import Cursos from '../components/edit_remove/Cursos';
import UnidadesCurriculares from '../components/edit_remove/UCs.jsx';
import Escolas from '../components/edit_remove/Escolas';
import Salas from '../components/edit_remove/Salas.jsx';


import CursoCreate from '../pages/CursoCreate.jsx'
import DocenteCreate from '../pages/DocenteCreate.jsx'
import EscolaCreate from '../pages/EscolaCreate.jsx'
import UCCreate from '../pages/UCCreate.jsx'
import SalaCreate from '../pages/SalaCreate.jsx'

const Router = () => {
  return (
    <Routes>
      {/* Rota inicial */}
      <Route path="/backoffice" element={<BackOffice />} />

      {/* Rotas para as páginas */}

      <Route path="/docentes" element={<Docentes />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/unidades-curriculares" element={<UnidadesCurriculares />} />
      <Route path="/escolas" element={<Escolas />} />
      <Route path="/salas" element={<Salas />} />
      <Route path="/create-curso" element={<CursoCreate />} />
      <Route path="/create-docente" element={<DocenteCreate />} />
      <Route path="/create-escola" element={<EscolaCreate />} />
      <Route path="/create-uc" element={<UCCreate />} />
      <Route path="/create-sala" element={<SalaCreate />} />

    </Routes>
  );
};

export default Router;