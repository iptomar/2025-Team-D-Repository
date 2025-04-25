import React from 'react';
import "../styles/dashboard-backoffice.css"
import { Link } from 'react-router-dom'; // Importe o Link

const Backoffice = () => {


  return (
    <div className="area">
      <h1 className="titulo">BackOffice</h1>
      <div className="botoes-container">
        <Link to="/docentes" className="botao">Docentes</Link>
        <Link to="/cursos" className="botao">Cursos</Link>
        <Link to="/unidades-curriculares" className="botao">Unidades Curriculares</Link>
        <Link to="/escolas" className="botao">Escolas</Link>
        <Link to="/salas" className="botao">Salas</Link>
      </div>
    </div>
  );
};

export default Backoffice;
