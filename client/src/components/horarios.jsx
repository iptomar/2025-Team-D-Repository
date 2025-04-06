import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket";
import AdicionarAulaButton from "./AdicionarAulaButton";

// Weekdays definition
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Create time slots (from 8:30 to 24:00)
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2);
  const startMinutes = i % 2 === 0 ? "30" : "00";
  const endHour = startMinutes === "30" ? startHour + 1 : startHour;
  const endMinutes = startMinutes === "30" ? "00" : "30";
  return `${startHour}:${startMinutes} - ${endHour === 24 ? "00" : endHour}:${endMinutes}`;
});

// Draggable component – receives setAulaSendoArrastada as prop
function Draggable({ id, children, isBlocked, setAulaSendoArrastada }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: isBlocked,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isBlocked ? "not-allowed" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="aula"
      onDragStart={() => setAulaSendoArrastada(id)}
    >
      {children}
    </div>
  );
}

// Droppable component – receives setAulaSendoArrastada and passes it to Draggable
function Droppable({ id, aulas, children, isBlocked, aulaSendoArrastada, setAulaSendoArrastada, iniciarEdicao }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const isBlocoInicial = aulas.includes(aulaSendoArrastada);
  const style = {
    backgroundColor: isOver && !isBlocked ? "lightblue" : isBlocoInicial ? "lightgreen" : undefined,
  };

  return (
    <td ref={setNodeRef} style={style} className="empty-slot">
      {aulas.map((aula) => (
        <Draggable key={aula} id={aula} isBlocked={isBlocked} setAulaSendoArrastada={setAulaSendoArrastada}>
          <div className="aula" onClick={() => iniciarEdicao(aula)}>
            {aula}
          </div>
        </Draggable>
      ))}
      {children}
    </td>
  );
}

// Main component
function Horarios() {
  // Instead of separate filter states, we embed these into novaAula.
  // The timetable is rendered only if these properties are non-empty.
  const [aulas, setAulas] = useState({});
  const [disponiveis, setDisponiveis] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const [novaAula, setNovaAula] = useState({
    docente: "",
    sala: "",
    turma: "",
    uc: "",
    curso: "",
    ano: "",
    escola: "",
    tipologia: "",
    inicio: "",
    fim: "",
    duracao: "1h",
  });

  const [aulaEmEdicao, setAulaEmEdicao] = useState(null);
  const [aulaSelecionada, setAulaSelecionada] = useState("");
  const [erro, setErro] = useState("");
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [aulaSendoArrastada, setAulaSendoArrastada] = useState(null);

  // Filter available classes based on search term
  const aulasFiltradas = disponiveis.filter((aula) =>
    aula.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  // Render timetable only if these required fields (filters) are set
  const filtrosSelecionados =
    novaAula.escola && novaAula.curso && novaAula.ano && novaAula.turma;

  const handleDragEnd = (event) => {
    if (isBlocked) return;
    const { active, over } = event;
    setAulaSendoArrastada(null);

    if (!over) {
      setDisponiveis((prev) => (!prev.includes(active.id) ? [...prev, active.id] : prev));
      setAulas((prev) => {
        const newAulas = { ...prev };
        Object.keys(newAulas).forEach((key) => {
          if (newAulas[key] === active.id) delete newAulas[key];
        });
        return newAulas;
      });
      return;
    }

    const aula = disponiveis.find((a) => a === active.id) || Object.values(aulas).find((a) => a === active.id);
    const duracao = parseInt(aula.match(/\((\d+)h\)/)?.[1] || "1", 10);
    const [dia, hora] = over.id.split("-");
    const horaIndex = horas.findIndex((h) => h.startsWith(hora));
    const blocosNecessarios = Array.from({ length: duracao * 2 }, (_, i) => `${dia}-${horas[horaIndex + i]}`);

    const conflito = blocosNecessarios.some((bloco) => aulas[bloco] && aulas[bloco] !== active.id);
    if (conflito) {
      setErro("Conflito: Um ou mais blocos já estão ocupados!");
      return;
    }

    setAulas((prev) => {
      const newAulas = { ...prev };
      Object.keys(newAulas).forEach((key) => {
        if (newAulas[key] === active.id) delete newAulas[key];
      });
      blocosNecessarios.forEach((bloco) => {
        newAulas[bloco] = active.id;
      });
      return newAulas;
    });

    setDisponiveis((prev) => prev.filter((aula) => aula !== active.id));
    setErro("");
  };

  const iniciarEdicao = (aula) => {
    const [disciplina, sala, professor, duracao] = aula
      .match(/^(.*?) - (.*?) - (.*?) \((.*?)\)$/)
      .slice(1);
    setAulaEmEdicao({ disciplina, sala, professor, duracao, original: aula });
  };

  const salvarEdicao = () => {
    const { disciplina, sala, professor, duracao, original } = aulaEmEdicao;
    if (!disciplina || !sala || !professor || !duracao) {
      alert("Preencha todos os campos antes de salvar a aula.");
      return;
    }
    const novaAulaTexto = `${disciplina} - ${sala} - ${professor} (${duracao})`;
    setDisponiveis((prev) => prev.map((aula) => (aula === original ? novaAulaTexto : aula)));
    setAulas((prev) => {
      const newAulas = { ...prev };
      Object.keys(newAulas).forEach((key) => {
        if (newAulas[key] === original) newAulas[key] = novaAulaTexto;
      });
      return newAulas;
    });
    setAulaEmEdicao(null);
  };

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <div className="horarios-container">
        <div className="layout">
          {/* Left filters */}
          <div className="filtros">
            <h3>Filtros</h3>
            <select
              onChange={(e) =>
                setNovaAula((prev) => ({ ...prev, escola: e.target.value }))
              }
              value={novaAula.escola}
            >
              <option value="">Escolher Escola</option>
              <option value="ESTT">ESTT</option>
              <option value="ESGT">ESGT</option>
            </select>
            <select
              onChange={(e) =>
                setNovaAula((prev) => ({ ...prev, curso: e.target.value }))
              }
              value={novaAula.curso}
            >
              <option value="">Escolher Curso</option>
              <option value="Engenharia Informática">Engenharia Informática</option>
              <option value="Gestão">Gestão</option>
            </select>
            <select
              onChange={(e) =>
                setNovaAula((prev) => ({ ...prev, ano: e.target.value }))
              }
              value={novaAula.ano}
            >
              <option value="">Escolher Ano</option>
              <option value="1">1º Ano</option>
              <option value="2">2º Ano</option>
              <option value="3">3º Ano</option>
            </select>
            <select
              onChange={(e) =>
                setNovaAula((prev) => ({ ...prev, turma: e.target.value }))
              }
              value={novaAula.turma}
            >
              <option value="">Escolher Turma</option>
              <option value="A">Turma A</option>
              <option value="B">Turma B</option>
            </select>
          </div>

          {/* Render timetable only if filters are selected */}
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
                            aulaSendoArrastada={aulaSendoArrastada}
                            setAulaSendoArrastada={setAulaSendoArrastada}
                            iniciarEdicao={iniciarEdicao}
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
                  <Draggable
                    key={aula}
                    id={aula}
                    isBlocked={isBlocked}
                    setAulaSendoArrastada={setAulaSendoArrastada}
                  >
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
                      value={novaAula.uc}
                      onChange={(e) => setNovaAula({ ...novaAula, uc: e.target.value })}
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
                      value={novaAula.docente}
                      onChange={(e) => setNovaAula({ ...novaAula, docente: e.target.value })}
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
                        onChange={(e) => setAulaEmEdicao({ ...aulaEmEdicao, disciplina: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Sala"
                        value={aulaEmEdicao.sala}
                        onChange={(e) => setAulaEmEdicao({ ...aulaEmEdicao, sala: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Professor"
                        value={aulaEmEdicao.professor}
                        onChange={(e) => setAulaEmEdicao({ ...aulaEmEdicao, professor: e.target.value })}
                      />
                    </div>
                    <div className="actions-container">
                      <select
                        onChange={(e) => setAulaEmEdicao({ ...aulaEmEdicao, duracao: e.target.value })}
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
                    onChange={(e) => setAulaSelecionada(e.target.value)}
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
                      iniciarEdicao(aulaSelecionada);
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
