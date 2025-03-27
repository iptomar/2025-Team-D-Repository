// imports
import { useState, useEffect } from 'react';
import axios from 'axios';
import TabsHorarios from './HorariosAbas';
import { BrowserRouter} from 'react-router-dom';



function App() {
  // base endpoint message
  const [baseMessage, setBaseMessage] = useState("Fetching server's base endpoint...");

  // fetch base endpoint message
  useEffect(() => {
    axios
      .get('http://localhost:5170/')
      .then((res) => setBaseMessage(res.data.message))
      .catch((err) => {
        console.log("Error: Fetch to base endpoint. " + err);
        setBaseMessage("Error: Fetch to base endpoint.");
      });
  }, []);

  return (

    //Sem o BrowserRouter, os hooks de navegação, como useNavigate e useLocation, não teriam o ambiente adequado para gerenciar as rotas, 
    // e a aplicação não conseguiria responder às mudanças de URL.
    <BrowserRouter>
      
      
      
      <a
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1>Eazy Schedule IPT</h1>
      </a>

      <h3>{baseMessage}</h3>
    <TabsHorarios/>

    </BrowserRouter>
  );
}

export default App; 