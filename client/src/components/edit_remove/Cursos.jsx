import { useState, useEffect } from 'react';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal'; // Componente do modal de edição

// Componente principal responsável pela listagem, edição e remoção de cursos
const Curso_edit_remove = () => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});
  const [tituloModal, setTituloModal] = useState('Editar Curso');

  // Carrega dados simulados ao iniciar o componente
  useEffect(() => {
    const dadosSimulados = [
      { id: 1, nome: "Engenharia Informática", abreviatura: "LEI", codCurso: "911", escola: "ESTT" },
      { id: 2, nome: "Engenharia Eletrotécnica e de Computadores", abreviatura: "LEEC", codCurso: "912", escola: "ESTT" },
      { id: 3, nome: "Engenharia Mecanica", abreviatura: "EMC", codCurso: "824", escola: "ESTT" },
      { id: 4, nome: "Engenharia Bioquimica", abreviatura: "EBQ", codCurso: "45", escola: "ESTA" },
      { id: 5, nome: "Engenharia Eletrotécnica ", abreviatura: "LE", codCurso: "910", escola: "ESTT" },
      { id: 6, nome: "Recursos Humanos", abreviatura: "RH", codCurso: "885", escola: "ESGT" },
      { id: 7, nome: "Contabilidade", abreviatura: "Ct", codCurso: "820", escola: "ESGT" },
      { id: 8, nome: "Psicologia", abreviatura: "PS", codCurso: "42", escola: "ESCT" }
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
    setTituloModal('Editar Curso');
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
      <div className="lista">
        {dados.map((item) => (
          <div key={item.id} className="card">
            <div className="card-info">
              <h3>{item.nome}</h3>
              <p>Abreviatura: {item.abreviatura}</p>
              <p>Código do Curso: {item.codCurso}</p>
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
