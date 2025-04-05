// Porquê usar isto se já tenho os sockets a funcionar??

/*const express = require('express');
const router = express.Router();
const axios = require('axios');

const generateId = () => Date.now();
const { io } = require('../server');
const getIDDocente = async (Nome) => {
    try{
        const response = await axios.get('https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/docente');
        const docentes = response.data.docente;
        const docente = docentes.find(docente => docente.Nome == Nome);
        if(docente){
            return docente.ID_Docente;
        } else {
            throw new Error("Docente não encontrado");
        }
    } catch (error) {
        console.error("Erro ao buscar ID_Docente:", error);
        throw error;
      }
}
// Função para buscar Cod_Escola baseado na Abreviação
const getCodEscola = async (abreviacao) => {
  try {
    const response = await axios.get('https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/escola');
    const escolas = response.data.escola;
    const escola = escolas.find(escola => escola.Abreviacao === abreviacao);

    if (escola) {
      return escola.Cod_Escola;
    } else {
      throw new Error("Escola não encontrada");
    }
  } catch (error) {
    console.error("Erro ao buscar Cod_Escola:", error);
    throw error;
  }
};

// Função para buscar Cod_Curso baseado no Nome
const getCodCurso = async (nome) => {
  try {
    const response = await axios.get('https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/curso');
    const cursos = response.data.curso;
    const curso = cursos.find(curso => curso.Nome === nome);

    if (curso) {
      return curso.Cod_Curso;
    } else {
      throw new Error("Curso não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar Cod_Curso:", error);
    throw error;
  }
};

// Endpoint para adicionar uma aula
router.post('/adicionar-aula', async (req, res) => {
  console.log("Dados recebidos:", JSON.stringify(req.body, null, 2));
  const { disciplina, sala, professor, duracao, abreviacaoEscola, nomeCurso, ano, turma } = req.body;

  if (!disciplina || !sala || !professor || !duracao || !abreviacaoEscola || !nomeCurso || !ano || !turma) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    // Obter os códigos de escola e curso
    const codEscola = await getCodEscola(abreviacaoEscola);
    const codCurso = await getCodCurso(nomeCurso);
    const IDDocente = await getIDDocente(professor);
    const id = generateId();
    // Agora, você pode fazer o que precisar com os dados da aula, como salvar no Sheety ou banco de dados
    // Exemplo: salvar na planilha (usando o Sheety, por exemplo)
    const sheetyResponse = await axios.post(
      'https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/aula',
      {
        aula: {
            ID_Docente: IDDocente,
            Cod_Sala: sala,
            Cod_Turma: turma,
            Cod_UC: disciplina,
            Cod_Curso: codCurso,
            Cod_AnoSemestre: ano,
            Cod_Escola: codEscola,
            ID_Tipologia: 1,
            Hora_de_inicio: 0,
            Hora_de_fim: 0,
            Duracao: duracao
        }
      }
    );

     // Emitir evento via Socket.io para todos os clientes conectados
     io.emit('new-aula', {
        message: 'Nova aula adicionada!',
        aula: sheetyResponse.data.aula  // Passa os dados da aula para os clientes
      });

    console.log("✅ Aula adicionada via Sheety:", sheetyResponse.data);
    res.status(200).json({ message: 'Aula adicionada com sucesso!', aula: sheetyResponse.data });
  } catch (error) {
    console.error("Full error:", {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    res.status(500).json({ message: 'Error details', error: error.response?.data });
  }
});

module.exports = router;
*/
