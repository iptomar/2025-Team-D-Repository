import React from "react";

const AdicionarAulaButton = ({ novaAula,socket, setNovaAula }) => {
  const adicionarAula = () => {
    console.log("Nova aula:", novaAula);
    
    // Check if all fields are filled in
    if (
      !novaAula.uc ||
      !novaAula.sala ||
      !novaAula.docente ||
      !novaAula.duracao ||
      !novaAula.escola ||
      !novaAula.curso ||
      !novaAula.ano ||
      !novaAula.turma
    ) {
      alert("Preencha todos os campos antes de adicionar a aula!");
      return;
    }
  
    // Now we wrap novaAula in "aula" to match the structure expected by Sheety
    const aulaData = {
      aula: {
        docente: novaAula.docente,
        sala: novaAula.sala,
        turma: novaAula.turma,
        uc: novaAula.uc,
        curso: novaAula.curso,
        ano: novaAula.anosem,
        escola: novaAula.escola,
        tipologia: novaAula.tipologia || "1",  // If no value, use an empty string
        inicio: novaAula.inicio || "1", // Same here
        fim: novaAula.fim || "1", // Same here
        duracao: novaAula.duracao, // Keep the duration
      }
    };
  
    console.log("📤 Emitting add-aula event", aulaData);
    
    // Emit the aulaData object with "aula" as the key
    socket.emit("add-data.novaAula", aulaData);
  
    // Reset the novaAula state to initial empty values
    setNovaAula({
      docente: "",
      sala: "",
      turma: "",
      uc: "",
      curso: "",
      anosem: "",
      escola: "",
      tipologia: "",
      inicio: "",
      fim: "",
      duracao: "",
    });
  };
  

  return (
    <button onClick={adicionarAula}>Adicionar Aula</button>
  );
};

export default AdicionarAulaButton;
