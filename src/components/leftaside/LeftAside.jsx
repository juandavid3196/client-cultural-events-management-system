import React, { useEffect, useState } from 'react'
import './LeftAside.scss';
import { MdCalendarMonth, MdShield } from 'react-icons/md';
import { IoCalendarNumberSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { FaBuildingUser, FaTrowelBricks } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { Card } from '../Card/Card';
import { Link } from 'react-router-dom';



const LeftAside = () => {

    const [modes, setModes] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8007/api/contractual-modes/?skip=0&limit=10');
                const data = await response.json();
                setModes(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='container'>
            <div className="aside-top">
                <img src="/media/img/image 2.svg" alt="img-aside" />
            </div>
            <div className="aside-bottom">
                <div className='text-white'>
                    <Card
                        options={
                            modes.map(mode => <Link to={`/tablapermisos?modeId=${mode.id}`}>{mode.name}</Link>)
                        }
                        text="Modos de contratación"
                        icon={<MdShield />}
                    />
                    <Card
                        options={[
                            <Link to="/responsabilidades">Responsabilidades</Link>,
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

                    <Card
                        options={[
                            <Link to="/calendar">Calendario</Link>
                        ]}
                        text="Calendario"
                        icon={<IoCalendarNumberSharp />}
                    />

                    <Card
                        options={[
                            <Link to="/states"> Gestor de Estados</Link>
                        ]}
                        text="Estados"
                        icon={<MdOutlineRealEstateAgent />}
                    />
                    <Card
                        options={[
                            <Link to="/places"> Gestor de Espacios</Link>
                        ]}
                        text="Espacios"
                        icon={<FaBuildingUser />}
                    />
                    <Card
                        options={[
                            <Link to="/modalities"> Gestor de Modalidades</Link>
                        ]}
                        text="Modalidades"
                        icon={<FaUserFriends />}
                    />
                    <Card
                        options={[
                            <Link to="/responsabilities"> Gestor de Responsabilidades</Link>
                        ]}
                        text="Responsabilidades"
                        icon={<FaTrowelBricks />}
                    />
                </div>
            </div>
        </div>
    )
}

export default LeftAside