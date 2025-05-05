import React from 'react';
import "../styles/dashboard-backoffice.css";
import { useNavigate } from 'react-router-dom';

const Backoffice = () => {
  const navigate = useNavigate();

  return (
    <div className="area">
      <h1 className="titulo">BackOffice</h1>
      <div className="botoes-container">
        {/* Botão Docentes */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/docentes')}
        >
          Docentes
        </button>

        {/* Botão Cursos */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/cursos')}
        >
          Cursos
        </button>

        {/* Botão Unidades Curriculares */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/unidades-curriculares')}
        >
          Unidades Curriculares
        </button>

        {/* Botão Escolas */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/escolas')}
        >
          Escolas
        </button>

        {/* Botão Salas */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/salas')}
        >
          Salas
        </button>
      </div>
    </div>
  );
};

export default Backoffice;