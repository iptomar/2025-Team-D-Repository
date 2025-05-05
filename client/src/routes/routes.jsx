import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BackOffice from '../pages/BackOffice';
import Data_Pages from '../pages/Data_Pages.jsx';



import CursoCreate from '../components/create/CursoCreate.jsx'
import DocenteCreate from '../components/create/DocenteCreate.jsx'
import EscolaCreate from '../components/create/EscolaCreate.jsx'
import UCCreate from '../components/create/UCCreate.jsx'
import SalaCreate from '../components/create/SalaCreate.jsx'

const Router = () => {
  return (
    <Routes>
      {/* Rota inicial */}
      <Route path="/backoffice" element={<BackOffice />} />

      {/* Rotas para as páginas */}

      <Route path="/backoffice/docentes" element={<Data_Pages />} />
      <Route path="/backoffice/cursos" element={<Data_Pages />} />
      <Route path="/backoffice/unidades-curriculares" element={<Data_Pages />} />
      <Route path="/backoffice/escolas" element={<Data_Pages />} />
      <Route path="/backoffice/salas" element={<Data_Pages />} />
      <Route path="/backoffice/create-docente" element={<DocenteCreate />} />
      <Route path="/backoffice/create-curso" element={<CursoCreate />} />
      <Route path="/backoffice/create-uc" element={<UCCreate />} />
      <Route path="/backoffice/create-escola" element={<EscolaCreate />} />
      <Route path="/backoffice/create-sala" element={<SalaCreate />} />

    </Routes>
  );
};

export default Router;