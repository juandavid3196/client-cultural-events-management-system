import React from 'react'
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import "../styles/LoginPage.scss";
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {

    const { loginWithRedirect } = useAuth0();


    return (
        <div className='login-container'>
            <div className="left">
                <span>!Bienvenido al sistema de Gestión de Eventos del < br />
                    <span className='teather-name'> Teatro Pablo Tobon Uribe¡</span></span>
            </div>
            <div className="right">
                <div className='login-box'>
                    <span>Inicio de Sesión</span>
                    <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>
                </div>
            </div>
        </div >
    )
}

export default LoginPage