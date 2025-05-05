import { useState, useEffect, use } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'


const EscolaCreate = () => {

    const [nome, setNome] = useState("");
    const [abreviatura, setAbreviatura] = useState("");
    const [localidade, setLocalidade] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        //previne que a página de refresh, por default o onsubmit do forms da refresh na página
        e.preventDefault();
        //elimina todos os erros
        setError("");

        // Verifica se os campos estão vazios
        if (!nome.trim() || !abreviatura.trim() || !localidade.trim()) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Criar escola para mandar para o backend
        const novaEscola = {
            nome,
            abreviatura,
            localidade
        };

        //post no backend através de axios
        //dá post do nome, abreviatura, localidade no backend
        axios.post("http://localhost:5170/createEscola", novaEscola, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("Escola criado com sucesso!");
                    setNome("");
                    setAbreviatura("")
                    setLocalidade("")
                }
            })
            .catch(err => {
                setError(err.response?.data?.message || "Erro ao criar Escola.");
            });

    };



    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Escola</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Nome da Escola</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Abreviatura da Escola</font></label>
                        <input className='textbox_input' type="text" name="abtr" required="" value={abreviatura} onChange={(e) => setAbreviatura(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Localidade da Escola</font></label>
                        <input className='textbox_input' type="text" name="localidade" required="" value={localidade} onChange={(e) => setLocalidade(e.target.value)} />
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>

    )
}

export default EscolaCreate