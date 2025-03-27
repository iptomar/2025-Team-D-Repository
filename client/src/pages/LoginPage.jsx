import "../styles/login.css";
import iptLogo from "../images/ipt_logo.jpg"
import LoginForm from '../components/LoginForms.jsx'

const Login = () => {


  
    return (
        <div className="loginBackground">
            <div className='centerDiv'>
                <img src={iptLogo}
                 alt="Logo do Instituto Politécnico de Tomar"
                 width= "30%"
                />
                <h1 className='titulo'>Horários IPT</h1>
                <LoginForm />
            </div>
        </div>

    )
  }
  
  export default Login