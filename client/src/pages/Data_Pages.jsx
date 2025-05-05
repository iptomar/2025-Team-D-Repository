import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/dataPage.css'
import SearchBar from '../components/Searchbar.jsx'
import Docentes from '../components/edit_remove/Docentes_Forms.jsx'
import Cursos from '../components/edit_remove/Cursos_Forms.jsx'
import UCs from '../components/edit_remove/UCs_Forms.jsx'
import Escolas from '../components/edit_remove/Escolas_Forms.jsx'
import Salas from '../components/edit_remove/Salas_Forms.jsx'

const DataPages = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const [termoPesquisa, setTermoPesquisa] = useState("");

    // ⬇️ Sempre que muda o path, limpa a pesquisa
    useEffect(() => {
        setTermoPesquisa("");
    }, [path]);

    let Conteudo;
    let PaginaCreate;
    let TextoBotao;
    if (path === "/backoffice/docentes") {
        Conteudo = <Docentes filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-docente"
        TextoBotao = "Criar Docente"
    } else if (path === "/backoffice/cursos") {
        Conteudo = <Cursos filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-curso"
        TextoBotao = "Criar Curso"
    } else if (path === "/backoffice/unidades-curriculares") {
        Conteudo = <UCs filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-uc"
        TextoBotao = "Criar Unidade-Curricular"
    } else if (path === "/backoffice/escolas") {
        Conteudo = <Escolas filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-escola"
        TextoBotao = "Criar Escola"
    } else if (path === "/backoffice/salas") {
        Conteudo = <Salas filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-sala"
        TextoBotao = "Criar Sala"
    } else {
        Conteudo = <p>Página não encontrada</p>;
    }

    const irPaginaCreate = () => {
        navigate(PaginaCreate);
    };

    return (
        <div>
            <div className='PageTop'>
                <SearchBar pageToGo={irPaginaCreate} ButtonText={TextoBotao} searchValue={termoPesquisa} onSearchChange={setTermoPesquisa} />
            </div>
            {Conteudo}
        </div>
    );
}

export default DataPages;