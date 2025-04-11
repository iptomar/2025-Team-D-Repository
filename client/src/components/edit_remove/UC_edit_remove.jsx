import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Usado para navegação
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal'; // Componente do modal de edição

// Componente principal responsável pela listagem, edição e remoção de Unidades Curriculares
const UCEditRemove = () => {
  const navigate = useNavigate(); // Usado para navegação
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});
  const [tituloModal, setTituloModal] = useState('Editar UC');

  // Simula o carregamento inicial dos dados
  useEffect(() => {
    const dadosSimulados = [
      { id: 1, nome: "Programação Web", horas: "5", codUC: "911" },
      { id: 2, nome: "Programação Java", horas: "4", codUC: "911" },
      { id: 3, nome: "Análise Matemática", horas: "10", codUC: "911" },
      { id: 4, nome: "Gestão de Projetos", horas: "4", codUC: "911" },
      { id: 5, nome: "Sistemas Digitais", horas: "5", codUC: "911" }
    ];
    setDados(dadosSimulados);
  }, []);

  // Funções auxiliares para abrir/fechar modais e manipular dados
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      setDados(dados.filter(item => item.id !== idParaRemover));
    }
    fecharModal();
  };

  const abrirModalEdicao = (item) => {
    setEditarItemId(item.id);
    setEditarCampos(item);
    setTituloModal('Editar UC');
    setModalEdicaoAberta(true);
  };

  const fecharModalEdicao = () => {
    setModalEdicaoAberta(false);
    setEditarItemId(null);
    setEditarCampos({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarCampos(prev => ({ ...prev, [name]: value }));
  };

  const confirmarEdicao = () => {
    setDados(dados.map(item => item.id === editarItemId ? editarCampos : item));
    fecharModalEdicao();
  };

  return (
    <div className="lista-container">
      {/* Adicionar o botão Criar no topo */}
      <div className="page-header">
        <div>
          <input type="text" placeholder="🔍 Procurar" className="input-search" />
          <button 
            onClick={() => navigate("/create-uc")} // Navega para o formulário de criação de UC
            className="botao-create">
            Criar
          </button>
        </div>
      </div>

      <div className="lista">
        {dados.map((item) => (
          <div key={item.id} className="card">
            <div className="card-info">
              <h3>{item.nome}</h3>
              <p>Horas: {item.horas}</p>
              <p>Código da UC: {item.codUC}</p>
              <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                <img src={pencil} alt="Editar" width="20" height="20" />
              </button>
              <button className='btRemove' onClick={() => abrirModal(item.id)}>
                <img src={bin} alt="Remover" width="20" height="20" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmacaoModal
        isOpen={modalAberta}
        onClose={fecharModal}
        onConfirm={confirmarRemocao}
      />

      <ModalEdicao
        isOpen={modalEdicaoAberta}
        onClose={fecharModalEdicao}
        onChange={handleChange}
        campos={editarCampos}
        onSave={confirmarEdicao}
        titulo={tituloModal}
      />
    </div>
  );
};

export default UCEditRemove;
