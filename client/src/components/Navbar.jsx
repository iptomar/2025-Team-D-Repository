import React from 'react';
import '../styles/navbar.css'
import { useLocation, Link } from 'react-router-dom';
import logo from '../images/ipt_logo.jpg'; // substitui pelo teu logo


const Navbar = () => {

  const location = useLocation();
  const path = location.pathname;
  const estaNoBackoffice = path.startsWith('/backoffice');

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo IPT" className="logo" />
        <span className="instituto">Instituto Politécnico de Tomar</span>
      </div>

       {/* Links adicionais para o backoffice */}
       {estaNoBackoffice && (
            <>
              <Link to="/backoffice/docentes">Docentes</Link>
              <Link to="/backoffice/cursos">Cursos</Link>
              <Link to="/backoffice/escolas">Escolas</Link>
              <Link to="/backoffice/salas">Salas</Link>
              <Link to="/backoffice/unidades-curriculares">Unidades Curriculares</Link>
            </>
          )}

      <div className="navbar-right">
        <div className="links">
          <a href="/perfil">Perfil</a>
          <a href="/logout">Terminar sessão</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
