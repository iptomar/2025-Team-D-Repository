import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BackOffice from '../pages/BackOffice';
import Docentes from '../pages/Docentes';
 import Cursos from '../pages/Cursos';
 import UnidadesCurriculares from '../pages/UCs.jsx';
 import Escolas from '../pages/Escolas';
 import Salas from '../pages/Salas.jsx';


import CursoCreate from '../pages/CursoCreate.jsx'
import DocenteCreate from '../pages/DocenteCreate.jsx'
import EscolaCreate from '../pages/EscolaCreate.jsx'
import UCCreate from '../pages/UCCreate.jsx'
import SalaCreate from '../pages/SalaCreate.jsx'

const Router = () => {
  return (
    <Routes>
      {/* Rota inicial */}
      <Route path="/" element={<BackOffice />} />

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