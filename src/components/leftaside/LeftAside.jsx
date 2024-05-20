import React, { useState, useEffect } from 'react';
import './LeftAside.scss';
import { MdCalendarMonth, MdShield } from 'react-icons/md';
import { IoCalendarNumberSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { Card } from '../Card/Card';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const LeftAside = () => {

    const [modes, setModes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8007/api/contractual-modes?active=true')
            .then(response => {
                setModes(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const { logout, user, isAuthenticated } = useAuth0();

    return (
        <div className='container'>
            <div className="aside-top">
                <img src="/media/img/image 2.svg" alt="img-aside" />
            </div>
            <div className="aside-bottom">
                {isAuthenticated && (
                    <div className='user-info'>
                        <span className='user-name'>{user.nickname}</span>
                        <span className='user-icon' style={{ backgroundImage: `url(${user.picture})` }}></span>
                    </div>
                )
                }
                <div className='text-white'>
                    <Card
                        options={modes.map(mode => (
                            <Link key={mode.id} to={`/tablapermisos?modeId=${mode.id}`}>{mode.name}</Link>
                        ))}
                        text="Modalidades"
                        icon={<MdShield />}
                    />
                    <Card
                        options={[
                            <Link to="/responsabilidades">Responsabilidades</Link>,
                            <Link to="/">Gestor de Eventos</Link>

                        ]}
                        text="Eventos"
                        icon={<MdCalendarMonth />}
                    />

                    <Card
                        options={[
                            <Link to="/reports">Graficas de Reportes</Link>
                        ]}
                        text="Reportes"
                        icon={<TbReportSearch />}
                    />

                    <Card
                        options={[
                            <Link to="/calendar">Calendario</Link>
                        ]}
                        text="Calendario"
                        icon={<IoCalendarNumberSharp />}
                    />

                    <Card
                        options={[
                            <Link to="/states"> Gestor de Estados</Link>,
                            <Link to="/places"> Gestor de Espacios</Link>,
                            <Link to="/modalities"> Gestor de Modalidades</Link>,
                            <Link to="/responsabilities"> Gestor de Responsabilidades</Link>,
                        ]}

                        text="Configuración"
                        icon={<IoSettingsOutline />}
                    />

                </div>

                <div className='logout-section'>
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>cerrar sesión</button>
                </div>
            </div>
        </div>
    )
}

export default LeftAside