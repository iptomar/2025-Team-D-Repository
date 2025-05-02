import { useState, useEffect } from 'react';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal'; 

// Componente principal para listar, editar e remover salas
const Curso_edit_remove = () => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});
  const [tituloModal, setTituloModal] = useState('Editar Sala'); 

  // Carrega dados simulados ao montar o componente
  useEffect(() => {
    const dadosSimulados = [
      { id: 1, nome: "B255", escola: "2"},
      { id: 2, nome: "B128", escola: "1"},
      { id: 3, nome: "O105", escola: "1"},
      { id: 4, nome: "I174", escola: "2"},
      { id: 5, nome: "10", escola: "3"}
    ];
    setDados(dadosSimulados);
  }, []);

  // Abre o modal de confirmação e define o ID da sala a remover
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  // Fecha o modal de confirmação e limpa o ID
  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  // Remove a sala confirmada e fecha o modal
  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      setDados(dados.filter(item => item.id !== idParaRemover));
    }
    fecharModal();
  };

  // Abre o modal de edição com os dados da sala selecionada
  const abrirModalEdicao = (item) => {
    setEditarItemId(item.id);
    setEditarCampos(item);
    setTituloModal('Editar Sala');  
    setModalEdicaoAberta(true);
  };

  // Fecha o modal de edição e limpa os campos
  const fecharModalEdicao = () => {
    setModalEdicaoAberta(false);
    setEditarItemId(null);
    setEditarCampos({});
  };

  // Atualiza os campos enquanto o utilizador edita o formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarCampos(prev => ({ ...prev, [name]: value }));
  };

  // Aplica as alterações e atualiza a lista de salas
  const confirmarEdicao = () => {
    setDados(dados.map(item => item.id === editarItemId ? editarCampos : item));
    fecharModalEdicao();
  };

  return (
    <div className="lista-container">
      <div className="lista">
        {dados.map((item) => (
          <div key={item.id} className="card">
            <div className="card-info">
              <h3>{item.nome}</h3>
              <p>Escola: {item.escola}</p>
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

export default Curso_edit_remove;
