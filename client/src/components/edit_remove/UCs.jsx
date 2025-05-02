import { useState, useEffect } from 'react';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';

// Componente principal para listar, editar e remover unidades curriculares
const Curso_edit_remove = () => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});
  const [tituloModal, setTituloModal] = useState('Editar Curso');

  // Simula o carregamento inicial dos dados
  useEffect(() => {
    const dadosSimulados = [
      { id: 1, nome: "Programação Web", horas: "5", codCurso: "911"},
      { id: 2, nome: "Programação Java", horas: "4", codCurso: "911"},
      { id: 3, nome: "Análise Matemática", horas: "10", codCurso: "911"},
      { id: 4, nome: "Gestão de Projetos", horas: "4", codCurso: "911"},
      { id: 5, nome: "Sistemas Digitais", horas: "5", codCurso: "911"}
    ];
    setDados(dadosSimulados);
  }, []);

  // Abrir o modal de confirmação e guardar o ID do item a remover
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  // Fechar o modal de confirmação
  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  // Confirmar e aplicar a remoção do item
  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      setDados(dados.filter(item => item.id !== idParaRemover));
    }
    fecharModal();
  };

  // Abrir o modal de edição e preencher os campos com os dados do item
  const abrirModalEdicao = (item) => {
    setEditarItemId(item.id);
    setEditarCampos(item);
    setTituloModal('Editar Unidade Curricular');  
    setModalEdicaoAberta(true);
  };

  // Fechar o modal de edição e limpar os dados
  const fecharModalEdicao = () => {
    setModalEdicaoAberta(false);
    setEditarItemId(null);
    setEditarCampos({});
  };

  // Atualizar campos do formulário conforme o utilizador edita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarCampos(prev => ({ ...prev, [name]: value }));
  };

  // Confirmar e aplicar as alterações no item editado
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
              <p>Horas: {item.horas}</p>
              <p>Código do Curso: {item.codCurso}</p>
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
