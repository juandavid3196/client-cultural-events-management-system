import React from 'react'
import './LeftAside.scss';
import { MdCalendarMonth, MdShield } from 'react-icons/md';
import { TbReportSearch } from "react-icons/tb";
import { Card } from '../Card/Card';
import { Link } from 'react-router-dom';

const LeftAside = () => {
    return (
        <div className='container'>
            <div className="aside-top">
                <img src="/media/img/image 2.svg" alt="img-aside" />
            </div>
            <div className="aside-bottom">
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
                            <Link to="/responsabilidades">Pendientes por cumplimiento</Link>,
                            <Link to="/eventosEspera">Eventos en espera</Link>,
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
                </div>
            </div>
        </div>
    )
}

export default LeftAside