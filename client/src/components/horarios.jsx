import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css"; // Ensure the correct relative path to the CSS file// Importa o ficheiro de CSS
import socket from '../utils/socket'
import AdicionarAulaButton from "./AdicionarAulaButton";

// Definição dos dias da semana
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Gera as faixas horárias do horário (das 8:30 às 24:00)
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2); // Calcula a hora inicial
  const startMinutes = i % 2 === 0 ? "30" : "00"; // Define os minutos (30 ou 00)
  const endHour = startMinutes === "30" ? startHour + 1 : startHour; // Calcula a hora final
  const endMinutes = startMinutes === "30" ? "00" : "30"; // Define os minutos finais
  return `${startHour}:${startMinutes} - ${endHour === 24 ? "00" : endHour}:${endMinutes}`;
});

// Componente que representa uma aula arrastável
function Draggable({ id, children, isBlocked }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: isBlocked, // Desativa o arrastar se o horário estiver bloqueado
  });

  // Aplica estilo para simular o movimento ao arrastar
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isBlocked ? "not-allowed" : "grab", // Altera o cursor se bloqueado
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="aula"
      onDragStart={() => setAulaSendoArrastada(id)} // Define a aula sendo arrastada
    >
      {children}
    </div>
  );
}

// Componente que representa um bloco onde as aulas podem ser soltas (drop target)
function Droppable({ id, aulas, children, isBlocked, aulaSendoArrastada }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  // Verifica se o bloco atual é o inicial da aula sendo arrastada
  const isBlocoInicial = aulas.includes(aulaSendoArrastada);

  // Aplica estilo para destacar o bloco inicial
  const style = {
    backgroundColor: isOver && !isBlocked ? "lightblue" : isBlocoInicial ? "lightgreen" : undefined,
  };

  return (
    <td ref={setNodeRef} style={style} className="empty-slot">
      {/* Renderiza a aula se este bloco estiver ocupado */}
      {aulas.map((aula) => (
        <Draggable key={aula} id={aula} isBlocked={isBlocked}>
          <div className="aula" onClick={() => iniciarEdicao(aula)}>
            {aula}
          </div>
        </Draggable>
      ))}
      {children}
    </td>
  );
}

// Componente principal que contém o horário
function Horarios() {
  // Estados para armazenar os filtros
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");

  // Estado para armazenar as aulas colocadas no horário
  const [aulas, setAulas] = useState({});

  // Estado com a lista de aulas disponíveis para arrastar
  const [disponiveis, setDisponiveis] = useState([]); // Inicializa como uma lista vazia

  // Estado para controlar se o horário está bloqueado
  const [isBlocked, setIsBlocked] = useState(false);

  const [novaAula, setNovaAula] = useState({
    disciplina: "",
    sala: "",
    professor: "",
    duracao: "1h",
  });

  const [aulaEmEdicao, setAulaEmEdicao] = useState(null); // Armazena a aula em edição

  const [aulaSelecionada, setAulaSelecionada] = useState(""); // Armazena a seleção do dropdown

  // Estado para armazenar mensagens de erro
  const [erro, setErro] = useState("");

  // Estado para armazenar o termo de pesquisa
  const [termoPesquisa, setTermoPesquisa] = useState("");

  const [aulaSendoArrastada, setAulaSendoArrastada] = useState(null); // Armazena o ID da aula sendo arrastada

  // Filtra as aulas disponíveis com base no termo de pesquisa
  const aulasFiltradas = disponiveis.filter((aula) =>
    aula.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  // Verifica se todos os filtros foram selecionados
  const filtrosSelecionados = escola && curso && ano && turma;

  const handleDragEnd = (event) => {
    if (isBlocked) return; // Impede mudanças se o horário estiver bloqueado

    const { active, over } = event;

    // Limpa o estado da aula sendo arrastada
    setAulaSendoArrastada(null);

    if (!over) {
      // Se a aula for solta fora de um bloco válido, adiciona de volta à lista de disponíveis
      setDisponiveis((prevDisponiveis) => {
        if (!prevDisponiveis.includes(active.id)) {
          return [...prevDisponiveis, active.id];
        }
        return prevDisponiveis;
      });

      // Remove a aula do horário (estado de aulas)
      setAulas((prevAulas) => {
        const newAulas = { ...prevAulas };
        Object.keys(newAulas).forEach((key) => {
          if (newAulas[key] === active.id) {
            delete newAulas[key];
          }
        });
        return newAulas;
      });

      return;
    }

    const aula = disponiveis.find((a) => a === active.id) || Object.values(aulas).find((a) => a === active.id);
    const duracao = parseInt(aula.match(/\((\d+)h\)/)?.[1] || "1", 10); // Extrai a duração da aula (ex.: "2h" -> 2)
    const [dia, hora] = over.id.split("-"); // Divide o ID do bloco (ex.: "Segunda-8:30")

    const horaIndex = horas.findIndex((h) => h.startsWith(hora)); // Encontra o índice da hora inicial
    const blocosNecessarios = Array.from({ length: duracao * 2 }, (_, i) => `${dia}-${horas[horaIndex + i]}`); // Calcula os blocos consecutivos

    // Verifica se algum dos blocos já está ocupado por outra aula
    const conflito = blocosNecessarios.some((bloco) => aulas[bloco] && aulas[bloco] !== active.id);
    if (conflito) {
      setErro("Conflito: Um ou mais blocos já estão ocupados!");
      return;
    }

    // Atualiza o estado de aulas para incluir os blocos ocupados
    setAulas((prevAulas) => {
      const newAulas = { ...prevAulas };

      // Remove a aula da posição anterior
      Object.keys(newAulas).forEach((key) => {
        if (newAulas[key] === active.id) {
          delete newAulas[key];
        }
      });

      // Adiciona a aula aos blocos necessários
      blocosNecessarios.forEach((bloco) => {
        newAulas[bloco] = active.id;
      });

      return newAulas;
    });

    // Remove a aula da lista de disponíveis, se ela estava lá
    setDisponiveis((prevDisponiveis) =>
      prevDisponiveis.filter((aula) => aula !== active.id)
    );

    // Limpa a mensagem de erro, se houver
    setErro("");
  };

  const iniciarEdicao = (aula) => {
    const [disciplina, sala, professor, duracao] = aula
      .match(/^(.*?) - (.*?) - (.*?) \((.*?)\)$/)
      .slice(1); // Extrai os campos da aula
  
    setAulaEmEdicao({ disciplina, sala, professor, duracao, original: aula });
  };

  const salvarEdicao = () => {
    const { disciplina, sala, professor, duracao, original } = aulaEmEdicao;
  
    if (!disciplina || !sala || !professor || !duracao) {
      alert("Preencha todos os campos antes de salvar a aula.");
      return;
    }
  
    const novaAulaTexto = `${disciplina} - ${sala} - ${professor} (${duracao})`;
  
    // Atualiza a lista de aulas disponíveis
    setDisponiveis((prev) =>
      prev.map((aula) => (aula === original ? novaAulaTexto : aula))
    );
  
    // Atualiza as aulas no horário
    setAulas((prevAulas) => {
      const newAulas = { ...prevAulas };
      Object.keys(newAulas).forEach((key) => {
        if (newAulas[key] === original) {
          newAulas[key] = novaAulaTexto;
        }
      });
      return newAulas;
    });
  
    setAulaEmEdicao(null); // Limpa o estado de edição
  };

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <div className="horarios-container">
        <div className="layout">
          {/* Filtros à esquerda */}
          <div className="filtros">
            <h3>Filtros</h3>
            <select onChange={(e) => setEscola(e.target.value)} value={escola}>
              <option value="">Escolher Escola</option>
              <option value="ESTT">ESTT</option>
              <option value="ESGT">ESGT</option>
            </select>
            <select onChange={(e) => setCurso(e.target.value)} value={curso}>
              <option value="">Escolher Curso</option>
              <option value="Engenharia Informática">Engenharia Informática</option>
              <option value="Gestão">Gestão</option>
            </select>
            <select onChange={(e) => setAno(e.target.value)} value={ano}>
              <option value="">Escolher Ano</option>
              <option value="1">1º Ano</option>
              <option value="2">2º Ano</option>
              <option value="3">3º Ano</option>
            </select>
            <select onChange={(e) => setTurma(e.target.value)} value={turma}>
              <option value="">Escolher Turma</option>
              <option value="A">Turma A</option>
              <option value="B">Turma B</option>
            </select>
          </div>

          {/* Exibe o horário e a aba de aulas disponíveis apenas se os filtros forem selecionados */}
          {filtrosSelecionados ? (
            <div className="conteudo">
              <div className="timetable-container">
                <button onClick={() => setIsBlocked((prev) => !prev)} className="block-btn">
                  {isBlocked ? "Desbloquear Horário" : "Bloquear Horário"}
                </button>
                {erro && <div className="error-message">{erro}</div>}
                <table className="timetable">
                  <thead>
                    <tr>
                      <th>Horas</th>
                      {diasSemana.map((dia) => (
                        <th key={dia}>{dia}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {horas.map((hora, index) => (
                      <tr key={index}>
                        <td className="hora">{hora}</td>
                        {diasSemana.map((dia) => (
                          <Droppable
                            key={`${dia}-${hora}`}
                            id={`${dia}-${hora}`}
                            aulas={aulas[`${dia}-${hora}`] ? [aulas[`${dia}-${hora}`]] : []}
                            isBlocked={isBlocked}
                            aulaSendoArrastada={aulaSendoArrastada} // Passa o estado como prop
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="aulas">
                <h3>Aulas Disponíveis</h3>
                <input
                  type="text"
                  placeholder="Pesquisar aulas..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="barra-pesquisa"
                />
                {aulasFiltradas.map((aula) => (
                  <Draggable key={aula} id={aula} isBlocked={isBlocked}>
                    <div className="aula" onClick={() => iniciarEdicao(aula)}>
                      {aula}
                    </div>
                  </Draggable>
                ))}

                <div className="nova-aula">
                  <h3>Adicionar Nova Aula</h3>
                  <div className="inputs-container">
                    <input
                      type="text"
                      placeholder="Disciplina"
                      value={novaAula.disciplina}
                      onChange={(e) => setNovaAula({ ...novaAula, disciplina: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Sala"
                      value={novaAula.sala}
                      onChange={(e) => setNovaAula({ ...novaAula, sala: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Professor"
                      value={novaAula.professor}
                      onChange={(e) => setNovaAula({ ...novaAula, professor: e.target.value })}
                    />
                  </div>
                  <div className="actions-container">
                    <select
                      onChange={(e) => setNovaAula({ ...novaAula, duracao: e.target.value })}
                      value={novaAula.duracao}
                    >
                      <option value="1h">1h</option>
                      <option value="2h">2h</option>
                      <option value="3h">3h</option>
                      <option value="4h">4h</option>
                    </select>
                    <AdicionarAulaButton
                      novaAula={novaAula}
                      escola={escola}
                      curso={curso}
                      ano={ano}
                      turma={turma}
                      socket={socket}
                      setNovaAula={setNovaAula}
                    />
                  </div>
                </div>

                {aulaEmEdicao && (
                  <div className="editar-aula">
                    <h3>Editar Aula</h3>
                    <div className="inputs-container">
                      <input
                        type="text"
                        placeholder="Disciplina"
                        value={aulaEmEdicao.disciplina}
                        onChange={(e) =>
                          setAulaEmEdicao({ ...aulaEmEdicao, disciplina: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Sala"
                        value={aulaEmEdicao.sala}
                        onChange={(e) =>
                          setAulaEmEdicao({ ...aulaEmEdicao, sala: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Professor"
                        value={aulaEmEdicao.professor}
                        onChange={(e) =>
                          setAulaEmEdicao({ ...aulaEmEdicao, professor: e.target.value })
                        }
                      />
                    </div>
                    <div className="actions-container">
                      <select
                        onChange={(e) =>
                          setAulaEmEdicao({ ...aulaEmEdicao, duracao: e.target.value })
                        }
                        value={aulaEmEdicao.duracao}
                      >
                        <option value="1h">1h</option>
                        <option value="2h">2h</option>
                        <option value="3h">3h</option>
                        <option value="4h">4h</option>
                      </select>
                      <button onClick={salvarEdicao}>Salvar</button>
                      <button onClick={() => setAulaEmEdicao(null)}>Cancelar</button>
                    </div>
                  </div>
                )}

                <div className="editar-aula-container">
                  <h3>Editar Aula</h3>
                  <select
                    onChange={(e) => setAulaSelecionada(e.target.value)} // Atualiza apenas o estado do dropdown
                    value={aulaSelecionada}
                    className="editar-aula-select"
                  >
                    <option value="" disabled>
                      Selecione uma aula para editar
                    </option>
                    {disponiveis.map((aula) => (
                      <option key={aula} value={aula}>
                        {aula}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!aulaSelecionada) {
                        alert("Por favor, selecione uma aula para editar.");
                        return;
                      }
                      iniciarEdicao(aulaSelecionada); // Atualiza o estado `aulaEmEdicao` com a aula selecionada
                    }}
                    className="editar-aula-btn"
                  >
                    Editar Aula
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mensagem-filtros">
              Por favor, selecione a escola, o curso, o ano e a turma para visualizar o horário.
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default Horarios;