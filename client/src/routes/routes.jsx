import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BackOffice from '../pages/BackOffice';
import Docentes from '../pages/Docentes';
import Cursos from '../pages/Cursos';
import UnidadesCurriculares from '../pages/UCs.jsx';
import Escolas from '../pages/Escolas';
import Salas from '../pages/Salas.jsx';

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
    </Routes>
  );
};

export default Router;