import React from 'react';
import Navbar from '../components/Navbar.jsx'
import { BrowserRouter as Router } from 'react-router-dom'; // Importar o BrowserRouter
import RouterConfig from '../routes/routes'; // Importar o arquivo de rotas
import Horario from './Horario.jsx';

function App() {
  return (
    <Router> {/* Envolver toda a aplicação com BrowserRouter */}
      <Navbar />
      <RouterConfig />  {/*Renderizar as rotas configuradas */}
    </Router>
  );
}

export default App;