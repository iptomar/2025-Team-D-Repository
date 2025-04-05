// AdicionarAulaButton.jsx
import React from "react";

const AdicionarAulaButton = ({ novaAula, escola, curso, ano, turma, socket, setNovaAula }) => {
  const adicionarAula = () => {
    const { disciplina, sala, professor, duracao } = novaAula;

    if (!disciplina || !sala || !professor || !duracao || !escola || !curso || !ano || !turma) {
      alert("Preencha todos os campos antes de adicionar a aula!");
      return;
    }

    console.log("📤 Emitting add-aula event", {
      newAula: { cod_uc:disciplina, cod_sala:sala, id_docente:professor,
        duracao:duracao, cod_escola:escola, cod_curso:curso, cod_anosem:ano, cod_turma:turma }
    });

    socket.emit("add-aula", {
      newAula: { disciplina, sala, professor, duracao, escola, curso, ano, turma }
    });

    setNovaAula({ disciplina: "", sala: "", professor: "", duracao: "1h" });
  };

  return (
    <button onClick={adicionarAula}>Adicionar Aula</button>
  );
};

export default AdicionarAulaButton;
