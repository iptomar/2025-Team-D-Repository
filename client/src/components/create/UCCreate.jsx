import { useState, useEffect, use } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'


const UCCreate = () => {

    const [nome, setNome] = useState("");
    const [horas, setHoras] = useState("");
    const [curso, setCurso] = useState([""]);
    const [codUC, setCodUC] = useState("");
    const [error, setError] = useState("");
    const opcoesCurso = ["Curso A", "Curso B", "Curso C"]; // Simulação de dados do backend

    const handleSubmit = async (e) => {
        //previne que a página de refresh, por default o onsubmit do forms da refresh na página
        e.preventDefault();
        //elimina todos os erros
        setError("");

        // Verifica se os campos estão vazios
        if (!nome.trim() || curso[0] == "" ||  codUC === null || codUC === "" ||  horas === null || horas === "") {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Criar Unidade Curricular para mandar para o backend
        const novoCurso = {
            nome,
            horas,
            curso,
            codUC
        };

        //post no backend através de axios
        //dá post do nome, horas, curso, codUC no backend
        axios.post("http://localhost:5170/createUC", novoCurso, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("UC criada com sucesso!");
                    setNome("");
                    setHoras("")
                    setCurso("")
                    setCodUC("")
                }
            })
            .catch(err => {
                setError(err.response?.data?.message || "Erro ao criar UC.");
            });

    };

    // Função para adicionar uma nova dropdown ao array de cursos
    const adicionarDropdown = () => {
        // Adiciona um novo curso vazia ao array
        setCurso([...curso, ""]);
    };

    // Função para atualizar o valor da dropdown quando o utilizador seleciona uma opção
    const handleChange = (index, value) => {
        // Cria uma cópia do array atual de escolas
        const novosCursos = [...curso];
        // Atualiza o valor do curso na posição selecionada
        novosCursos[index] = value;
        // Atualiza o estado com a nova lista de cursos
        setCurso(novosCursos);
    };


    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Unidade Curricular</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Nome da UC</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Código da UC</font></label>
                        <input className='textbox_input' type="number" name="codUc" required="" value={codUC} onChange={(e) => setCodUC(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Horas Totais</font></label>
                        <input className='textbox_input' type="number" name="horas" required="" value={horas} onChange={(e) => setHoras(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Cursos da UC</font></label>
                        {curso.map((escola, index) => (
                            <select
                                key={index}
                                className='input_dropdown'
                                value={escola}
                                onChange={(e) => handleChange(index, e.target.value)}
                            >
                                <option value="">Selecione um Curso</option>
                                {opcoesCurso.map((opcao, idx) => (
                                    <option key={idx} value={opcao}>{opcao}</option>
                                ))}
                            </select>
                        ))}
                        <button className="botao_create" type="button" onClick={adicionarDropdown} style={{ marginTop: '5px' }}>Adicionar outro curso</button>
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>

    )
}

export default UCCreate