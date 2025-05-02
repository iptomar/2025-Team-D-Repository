import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BackOffice from '../pages/BackOffice';
import Docentes from '../components/edit_remove/Docentes.jsx';
import Cursos from '../components/edit_remove/Cursos';
import UnidadesCurriculares from '../components/edit_remove/UCs.jsx';
import Escolas from '../components/edit_remove/Escolas';
import Salas from '../components/edit_remove/Salas.jsx';

const Router = () => {
  return (
    <Routes>
      {/* Rota inicial */}
      <Route path="/backoffice" element={<BackOffice />} />

      {/* Rotas para as páginas */}
      <Route path="/backoffice/docentes" element={<Docentes />} />
      <Route path="/backoffice/cursos" element={<Cursos />} />
      <Route path="/backoffice/unidades-curriculares" element={<UnidadesCurriculares />} />
      <Route path="/backoffice/escolas" element={<Escolas />} />
      <Route path="/backoffice/salas" element={<Salas />} />
    </Routes>
  );
};

export default Router;