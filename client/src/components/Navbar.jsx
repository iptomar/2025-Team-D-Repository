import React from 'react';
import "../styles/Navbar.css";
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Instituto Politécnico de Tomar</div>
      <div className="nav-links">
        <Link to="/docentes">Docentes</Link>
        <Link to="/cursos">Cursos</Link>
        <Link to="/ucs">UCs</Link>
        <Link to="/escolas">Escolas</Link>
        <Link to="/salas">Salas</Link>
      </div>
      <div className="user-info">
        <a href="#">Perfil</a>
        <a href="#">Terminar sessão</a>
        
      </div>
    </nav>
  );
};

export default Navbar;
