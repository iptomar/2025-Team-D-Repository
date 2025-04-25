import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Importar o BrowserRouter
import RouterConfig from '../routes/routes'; // Importar o arquivo de rotas

function App() {
  return (
    <Router> {/* Envolver toda a aplicação com BrowserRouter */}
      <RouterConfig /> {/* Renderizar as rotas configuradas */}
    </Router>
  );
}

export default App;