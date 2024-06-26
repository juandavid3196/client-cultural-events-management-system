import React, { useState } from 'react';
import './LeftAside.scss';
import { MdCalendarMonth, MdShield, MdMenu } from 'react-icons/md';
import { IoCalendarNumberSharp, IoSettingsOutline } from 'react-icons/io5';
import { TbReportSearch } from 'react-icons/tb';
import { Card } from '../Card/Card';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { IoIosReturnLeft } from "react-icons/io";

const LeftAside = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const { logout, user, isAuthenticated } = useAuth0();

    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    };

    return (
        <>
            <div className={`container ${openMenu ? 'open' : ''}`}>
                <div className="aside-top">
                    <img src="/media/img/image 2.svg" alt="img-aside" />
                    <MdMenu className="menu-icon" onClick={toggleMenu} />
                    <IoIosReturnLeft className='return-icon' onClick={toggleMenu} />

                </div>
                <div className="aside-bottom  event-section">
                    {isAuthenticated && (
                        <div className='user-info'>
                            <span className='user-name'>{user.nickname}</span>
                            <span className='user-icon' style={{ backgroundImage: `url(${user.picture})` }}></span>
                        </div>
                    )}
                    <div className='text-white'>
                        <Card
                            options={[
                                <Link to="/tablapermisos?modeId=1">Alquiler</Link>,
                                <Link to="/tablapermisos?modeId=2">Propio</Link>,
                                <Link to="/tablapermisos?modeId=3">Proyecto</Link>,
                                <Link to="/tablapermisos?modeId=4">Co-producción</Link>,
                                <Link to="/tablapermisos?modeId=5">Apoyo</Link>,
                                <Link to="/tablapermisos?modeId=6">Canje</Link>,
                            ]}
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
                                <Link to="/states">Gestor de Estados</Link>,
                                <Link to="/places">Gestor de Espacios</Link>,
                                <Link to="/modalities">Gestor de Modalidades</Link>,
                                <Link to="/responsabilities">Gestor de Responsabilidades</Link>,
                            ]}
                            text="Configuración"
                            icon={<IoSettingsOutline />}
                        />
                    </div>
                    <div className='logout-section'>
                        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Cerrar sesión</button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default LeftAside;
