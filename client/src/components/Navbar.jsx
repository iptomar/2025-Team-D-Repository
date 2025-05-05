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
        <a href="https://www.ipt.pt" target="_blank" rel="noopener noreferrer" style={{ cursor: 'default' }}>
         <img src={logo} alt="Logo IPT" className="logo" />
        </a>
        <span className="instituto">Instituto Politécnico de Tomar</span>
      </div>

      {/* Links adicionais para o backoffice */}
      {estaNoBackoffice && (
        <>
          <Link className='linksToBack' to="/backoffice">BackOffice</Link>
          <Link className='linksToBack' to="/backoffice/docentes">Docentes</Link>
          <Link className='linksToBack' to="/backoffice/cursos">Cursos</Link>
          <Link className='linksToBack' to="/backoffice/unidades-curriculares">Unidades Curriculares</Link>
          <Link className='linksToBack' to="/backoffice/escolas">Escolas</Link>
          <Link className='linksToBack' to="/backoffice/salas">Salas</Link>

        </>
      )}

      <div className="navbar-right">

      </div>
    </div>
  );
};

export default Navbar;
