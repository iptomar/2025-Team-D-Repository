import { useState,useEffect } from 'react';

//Material UI (MUI) é uma biblioteca de componentes de UI para React, inspirada no Material Design do Google. 
// O Material UI fornece componentes prontos e altamente personalizáveis para criar interfaces modernas e responsivas de forma rápida.
import { Tabs, Tab, Box, Typography } from '@mui/material';


//Os hooks useNavigate e useLocation pertencem ao react-router-dom.
import { useNavigate,useLocation } from 'react-router-dom';

import './HorariosAbas.css';


//A função TabPanel é responsável por mostrar ou esconder o conteúdo das abas. A função verifica qual aba está ativa e só exibe o conteúdo dessa aba
// A função recebe três coisas:
// >children → Representa o que estiver dentro do <TabPanel></TabPanel> . Em React, children representa o conteúdo dentro de um componente
// >value →  Índice da aba ativa(vem do useState), ou seja, qual é a aba que está atualmente selecionada.
// >index →  Índice da aba específica que o TabPanel representa
function TabPanel({ children, value, index }) {
  return (
    //Se value !== index, significa que essa aba não está ativa, então ela fica oculta (hidden=true)
    //Se value === index, significa que essa aba está ativa, então ela será exibida e ,por conseguinte, o codigo dentro será renderizado (hidden=false)
    //<TabPanel value={1} index={0}>Turmas</TabPanel>   // Escondido
    //<TabPanel value={1} index={1}>Docentes</TabPanel> // Mostrado
    //Aqui, apenas "Docentes" será exibido porque value === index
    //O hidden={value !== index} só esconde a aba inativa, mas mantém essa aba no DOM.
    //O {value === index && (...)} impede que o conteúdo seja processado quando a aba não está ativa.
    //Isto em conjunto garante um melhor controle do layout e do desempenho da aplicação! 
    <div hidden={value !== index}>
      {value === index && (
         //O Box é um componente do Material UI que serve como um container flexível, semelhante a uma <div>, mas com mais controle sobre o layout e estilos.
        //Neste caso estamos a usar um Box para organizar o conteúdo dentro das abas
        //p={6} → Adiciona espaçamento interno (padding) 
        <Box className="tab-content">
         {/*Typography é um estilo visual do Material UI*/}
          <Typography className="tab-text">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TabsHorarios() {
 

  //O useNavigate permite navegar de uma rota para outra, por exemplo, de /salas para /docentes, simplesmente chamando navigate('/docentes') 
  const navigate = useNavigate(); 
  

//Vamos supor a URL seguinte:http://localhost:3000/sobre?nome=Joao#section1
//O objeto retornado pelo useLocation poderia ser algo parecido com
//{
// pathname: "/sobre",       // O caminho da URL
// search: "?nome=Joao",     // A query string (parâmetros da URL)
// hash: "#section1",        // A âncora (hash) da URL
// state: null,              // Dados de estado que podem ter sido passados durante a navegação
// key: "abc123"             // Uma chave única para a localização
//}
  const location = useLocation();


  // Criação de um array chamado routes com os caminhos das rotas
  const routes = ['/turmas', '/docentes', '/salas'];

  //O valor inicial de tabIndex é -1. No contexto deste código, esse valor indica que, inicialmente, nenhuma aba está selecionada
  const [tabIndex, setTabIndex] = useState(-1);


  //Este hook useEffect monitoriza as mudanças na URL (location) e, se necessário, também as alterações no array routes. 
  // Quando a URL muda (por exemplo, após o navigate ser chamado no handleChange ou por outra navegação), o useEffect é disparado. 
  // O useEffect verifica qual é o caminho atual e atualiza o estado tabIndex de acordo com a posição desse caminho no array de rotas.
  useEffect(() => {

    //Aqui, location.pathname retorna o caminho da URL atual. Por exemplo, se o utilizador estiver na rota /salas, currentPath terá o valor "/salas"
    const currentPath = location.pathname;

    //A variável routes é um array que contém as rotas mapeadas (['/turmas', '/docentes', '/salas']). 
    // O método indexOf procura o valor de currentPath nesse array e retorna o seu índice.
    //Se currentPath for /salas, o foundIndex será 2 (/salas é o terceiro elemento do array).
    //Se a rota atual não estiver presente no array, indexOf retorna -1
    const foundIndex = routes.indexOf(currentPath);

    //// Se foundIndex for -1, significa que não está em nenhuma rota mapeada,
    // então fica sem aba selecionada.
    setTabIndex(foundIndex); 
  }, [location, routes]);//O useEffect é disparado sempre que o objeto location ou o array routes mudar, garantindo que a lógica de sincronização da 
  // aba ativa seja executada quando necessário

  //Quando o utilizador clica numa aba, a função handleChange é chamada fazendo duas coisas:
  // Atualiza o estado tabIndex com o novo índice da aba selecionada.
  //Usa o navigate para alterar a URL para a rota correspondente (usando o array routes).
  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
    ////o navigate muda a URL da aplicação para a rota que corresponde ao índice selecionado, 
    // usando o array routes que contém os caminhos das rotas. Dessa forma, a URL e a aba ativa permanecem sincronizadas.
    navigate(routes[newIndex]);
  };


  return (
    <Box>
      {/*borderBottom: 1->Isso cria uma linha na parte inferior do elemento.*/}
      {/*O valor 3 significa que a borda tem uma espessura média-leve.*/}
      {/*O divider é uma cor padrão do Material UI, geralmente um cinza claro.*/}
      {/* mt: 1 ->Isso adiciona uma margem superior (margin-top) de 1 unidade.*/}
      <Box className="tabs-container">
        {/*Tabs	é o container que segura todas as abas.*/}
        <Tabs

          //value={tabIndex} → Controla qual a aba que está ativa no momento.
          value={tabIndex}

          //Esta propriedade indica qual a função que deve ser chamada quando o utilizador interage com as abas e muda a seleção. 
          // Neste caso, quando o utilizador clica numa aba diferente, a função handleChange é executada para atualizar o estado da aba ativa e navegar
          // para a rota correspondente
          onChange={handleChange}
          className="tabs-wrapper"
          centered // <- Centraliza as abas na tela do cliente
        >

        {/*Cada <Tab> representa uma aba, e label="..." define o nome dela.
            Os índices são automáticos:
            "Turmas" → index = 0
            "Docentes" → index = 1
            "Salas" → index = 2
          */}
          {/*Tab representa uma aba individual dentro de Tabs.*/}
          <Tab label="Turmas" />
          <Tab label="Docentes" />
          <Tab label="Salas" />
        </Tabs>
      </Box>
      {/* Conteúdo das abas */}
      {/*Somente o painel cujo index é igual ao value será exibido.*/}
      <TabPanel value={tabIndex} index={0}>Turmas</TabPanel>
      <TabPanel value={tabIndex} index={1}>Docentes</TabPanel>
      <TabPanel value={tabIndex} index={2}>Salas</TabPanel>
    </Box>
  );
}

export default TabsHorarios;
