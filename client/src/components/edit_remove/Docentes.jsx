// Importações de dependências, estilos, imagens e componentes auxiliares
import { useState, useEffect } from 'react';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal'; 

// Componente principal que permite listar, editar e remover docentes
const Curso_edit_remove = () => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});

  // Título do modal de edição
  const [tituloModal, setTituloModal] = useState('Editar Docente'); 

  // Carrega os dados simulados ao iniciar
  useEffect(() => {
    const dadosSimulados = [
      { id: 1, nome: "André Benquerer", email: "andre_benquerer@ipt.pt", password: "1234"},
      { id: 2, nome: "Daniel Afonso", email: "daniel_afonso@ipt.pt", password: "1234"},
      { id: 3, nome: "Diogo Cardeira", email: "diogo_cardeira@ipt.pt", password: "1234"},
      { id: 4, nome: "Diogo Larangeira", email: "diogo_larangeira@ipt.pt", password: "1234"},
      { id: 5, nome: "Guilherme Simões", email: "guilherme_simoes@ipt.pt", password: "1234"},
      { id: 6, nome: "Rúben Dias", email: "ruben_dias@ipt.ptH", password: "1234"}
    ];
    setDados(dadosSimulados);
  }, []);

  // Abre o modal de confirmação de remoção
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  // Fecha o modal de confirmação
  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  // Remove o docente selecionado
  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      setDados(dados.filter(item => item.id !== idParaRemover));
    }
    fecharModal();
  };

  // Abre o modal de edição e preenche os campos
  const abrirModalEdicao = (item) => {
    setEditarItemId(item.id);
    setEditarCampos(item);
    setTituloModal('Editar Docente');  
    setModalEdicaoAberta(true);
  };

  // Fecha o modal de edição
  const fecharModalEdicao = () => {
    setModalEdicaoAberta(false);
    setEditarItemId(null);
    setEditarCampos({});
  };

  // Atualiza os campos conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarCampos(prev => ({ ...prev, [name]: value }));
  };

  // Salva as alterações feitas no docente
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
              <p>Email: {item.email}</p>
              <p>Password: {item.password}</p>
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
