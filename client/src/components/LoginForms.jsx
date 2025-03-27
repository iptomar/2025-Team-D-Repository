import { useState, useEffect, use } from 'react'
import "../styles/login.css";
import axios from 'axios'


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    
    const handleSubmit = async (e) => {
        //previne que a página de refresh, por default o onsubmit do forms da refresh na página
        e.preventDefault();
        //elimina todos os erros
        setError("");

        // Verifica se os campos estão vazios
        if (!email.trim() || !password.trim()) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        
        //post no backend através de axios
        //dá post do email e da password n backend
        await axios.post("http://localhost:5170/auth/login", {
            email: email,
            password: password,
          })
          //apresenta na consola a mensagem de sucesso
          .then(res => {
            console.log(res.data.message)
            setEmail("")
            setPassword("")
          })
          //apresenta na consola a mensagem de erro e limpa a variável da password
          .catch(error => {
            setError("Erro ao fazer login. Verifique suas credenciais.");
            console.error(error);
            setPassword("")
          })
    
      };



  
    return (
                <div className="formulario">
                    <div className='loginSquare'>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <form className='forms' onSubmit={handleSubmit}>
                            <div className='loginIdentifier'>
			                    <p><b>Login</b></p>
			                </div>
                            <div className="login_input_field">
                                <label><font color="#75c734">Email IPT</font></label>
                                <input type="email" name="user" required="" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="login_input_field">
                                <label><font color="#75c734">Password</font></label>
                                <input type="password" name="pass" required="" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
			                <button id="botao_login" type='submit' >Login</button>
                        </form>
                    </div>
                </div>
    )
  }
  
  export default Login