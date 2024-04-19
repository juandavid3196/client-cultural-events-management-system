import React from 'react'
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import "../styles/LoginPage.scss";
const LoginPage = () => {
    return (
        <div className='login-container'>
            <div className="left">
                <span>!Bienvenido al sistema de Gestión de Eventos del < br />
                    <span className='teather-name'> Teatro Pablo Tobon Uribe¡</span></span>
            </div>
            <div className="right">
                <div className='login-box'>
                    <span>Inicio de Sesión</span>
                    <div className="form-content">
                        <div className="form-box">
                            <input type="text" placeholder='Usuario' />
                            <i><FaUser /></i>
                        </div>
                        <div className="form-box">
                            <input type="password" placeholder='Contraseña' />
                            <i><FaKey /></i>
                        </div>
                    </div>
                    <div className="register-message">
                        ¿No tienes una cuenta aun? <button>Resgistrarse</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default LoginPage