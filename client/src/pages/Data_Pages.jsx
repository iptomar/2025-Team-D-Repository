import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/dataPage.css'
import SearchBar from '../components/Searchbar.jsx'
import Docentes from '../components/edit_remove/Docentes_Forms.jsx'
import Cursos from '../components/edit_remove/Cursos_Forms.jsx'
import UCs from '../components/edit_remove/UCs_Forms.jsx'
import Escolas from '../components/edit_remove/Escolas_Forms.jsx'
import Salas from '../components/edit_remove/Salas_Forms.jsx'

import DocenteCreate from '../components/create/DocenteCreate.jsx'
import CursoCreate from '../components/create/CursoCreate.jsx'
import UCseCreate from '../components/create/UCCreate.jsx'
import EscolaCreate from '../components/create/EscolaCreate.jsx'
import SalaCreate from '../components/create/SalaCreate.jsx'

const DataPages = () => {

    const location = useLocation();
    const path = location.pathname;

    const [showModal, setShowModal] = useState(false);
    const [termoPesquisa, setTermoPesquisa] = useState("");

    //Sempre que muda o path, limpa a pesquisa
    useEffect(() => {
        setTermoPesquisa("");
    }, [path]);

    let Conteudo;
    let PaginaCreate;
    let TextoBotao;
    let FormCreate;
    if (path === "/backoffice/docentes") {
        Conteudo = <Docentes filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-docente"
        TextoBotao = "Criar Docente"
        FormCreate = <DocenteCreate />
    } else if (path === "/backoffice/cursos") {
        Conteudo = <Cursos filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-curso"
        TextoBotao = "Criar Curso"
        FormCreate = <CursoCreate />
    } else if (path === "/backoffice/unidades-curriculares") {
        Conteudo = <UCs filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-uc"
        TextoBotao = "Criar Unidade-Curricular"
        FormCreate = <UCseCreate />
    } else if (path === "/backoffice/escolas") {
        Conteudo = <Escolas filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-escola"
        TextoBotao = "Criar Escola"
        FormCreate = <EscolaCreate />
    } else if (path === "/backoffice/salas") {
        Conteudo = <Salas filtro={termoPesquisa} />;
        PaginaCreate = "/backoffice/create-sala"
        TextoBotao = "Criar Sala"
        FormCreate = <SalaCreate />
    } else {
        Conteudo = <p>Página não encontrada</p>;
    }

    return (
        <div>
            <div className='PageTop'>
                <SearchBar pageToGo={() => setShowModal(true)}  ButtonText={TextoBotao} searchValue={termoPesquisa} onSearchChange={setTermoPesquisa} />
            </div>
            {Conteudo}

            {/* Modal simples */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {FormCreate}
                        <button className='botaoModal' onClick={() => setShowModal(false)}>Fechar</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default DataPages;