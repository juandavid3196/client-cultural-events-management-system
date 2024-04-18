import React, { useEffect } from 'react'
import '../eventData/EventData.scss';
import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import crudService from '../../services/crudService';

const EventData = ({ element, onCloseData, openData }) => {

    const [section, setSection] = useState('evento');
    const [close, setClose] = useState(false);
    const [stateData, setStateData] = useState({});
    const { setSubEvent, typeModalityFilter, typePlaceFilter, typeStateFilter, modalities, spaces, unicState } = useAppContext();


    const handleClose = () => {
        setClose(true);
        setSubEvent(false);
        setTimeout(() => {
            onCloseData();
        }, 500)
    }

    useEffect(() => {
        getStateById(element.id);
        typeModalityFilter(element.event_type_id);
        typePlaceFilter(element.place_id)
    }, [])

    const getStateById = async (id) => {
        let data = await crudService.fetchItems('eventstate');
        data.map((element) => {
            if (element.event_id == id) {
                setStateData(element);
                typeStateFilter(element.state_id);
                return;
            }
        })

    }


    return (
        <div className={`data-container ${close ? 'close' : ''}`}>
            <div className={`data-main-box ${close ? 'close' : ''}`}>
                <div className='form-title'>
                    <span>{`Datos ${element.parent_event_id ? `${element.specific_name}` : `${element.general_name}`}`}</span>
                    <i class="fa-regular fa-circle-xmark" onClick={() => handleClose()}></i>
                </div>
                <main>
                    <div className='form-eyeslashes'>
                        <span className={`eyeslashes-box ${section === 'evento' ? 'selected' : ''}`} onClick={() => setSection('evento')}>Evento</span>
                        <span className={`eyeslashes-box ${section === 'cliente' ? 'selected' : ''}`} onClick={() => setSection('cliente')}>Cliente</span>
                        <span className={`eyeslashes-box ${section === 'tecnica' ? 'selected' : ''}`} onClick={() => setSection('tecnica')}>Info Técnica</span>
                        <span className={`eyeslashes-box ${section === 'comunicaciones' ? 'selected' : ''}`} onClick={() => setSection('comunicaciones')}>Info Comunicaciones</span>
                    </div>

                    <div className="event-section">
                        <div className="section-title">
                            <span>Datos {section === 'tecnica' ? 'Técnica' : section.charAt(0).toUpperCase() + section.slice(1)}</span>
                        </div>
                        <table>
                            <tbody>

                                {section === 'evento' && (
                                    <>
                                        <tr>
                                            <td>Tipo de Evento</td>
                                            <td>{modalities}</td>
                                        </tr>
                                        <tr>
                                            <td>Estado</td>
                                            <td>{unicState}</td>
                                        </tr>
                                        <tr>
                                            <td>Fecha de Estado</td>
                                            <td>{stateData.created_at}</td>
                                        </tr>
                                        <tr>
                                            <td>Nombre General</td>
                                            <td>{element.general_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Nombre Especifico</td>
                                            <td>{element.specific_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Fecha de Inicio</td>
                                            <td>{element.date_start}</td>
                                        </tr>
                                        <tr>
                                            <td>Fecha de Finalizacion</td>
                                            <td>{element.date_finishing}</td>
                                        </tr>
                                        <tr>
                                            <td>Hora de Inicio</td>
                                            <td>{element.hour_start}</td>
                                        </tr>
                                        <tr>
                                            <td>Hora de Finalización</td>
                                            <td>{element.hour_finishing}</td>
                                        </tr>
                                        <tr>
                                            <td>Lugar</td>
                                            <td>{spaces}</td>
                                        </tr>
                                    </>
                                )
                                }

                                {
                                    section === 'cliente' && (
                                        <>
                                            <tr>
                                                <td>Nombre de Usuario</td>
                                                <td>{element.user_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Telefono</td>
                                                <td>{element.phone}</td>
                                            </tr>
                                            <tr>
                                                <td>Tipo de Identificación</td>
                                                <td>{element.identification_type}</td>
                                            </tr>
                                            <tr>
                                                <td>Identificación</td>
                                                <td>{element.identification_value}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>{element.email}</td>
                                            </tr>
                                            <tr>
                                                <td>Descripción</td>
                                                <td>{element.description}</td>
                                            </tr>
                                            <tr>
                                                <td>Observación</td>
                                                <td>{element.observation}</td>
                                            </tr>
                                        </>
                                    )
                                }
                                {
                                    section === 'tecnica' && (
                                        <>
                                            <tr>
                                                <td>Duración</td>
                                                <td>{element.duration}</td>
                                            </tr>
                                            <tr>
                                                <td>Fecha de Montaje</td>
                                                <td>{element.mounting_date}</td>
                                            </tr>
                                            <tr>
                                                <td>Hora de Inicio</td>
                                                <td>{element.mounting_star_hour}</td>
                                            </tr>
                                            <tr>
                                                <td>Hora de Finalización</td>
                                                <td>{element.mounting_finishing_hour}</td>
                                            </tr>
                                            <tr>
                                                <td>Contacto técnico</td>
                                                <td>{element.technic_contact}</td>
                                            </tr>
                                            <tr>
                                                <td>rider</td>
                                                <td>{element.rider}</td>
                                            </tr>
                                            <tr>
                                                <td>Minuto a Minuto</td>
                                                <td>{element.min_tomin}</td>
                                            </tr>
                                        </>
                                    )
                                }
                                {
                                    section === 'comunicaciones' && (
                                        <>
                                            <tr>
                                                <td>Contacto Comunicaciones</td>
                                                <td>{element.communication_contact}</td>
                                            </tr>
                                            <tr>
                                                <td>Pulep</td>
                                                <td>{element.pulep}</td>
                                            </tr>
                                            <tr>
                                                <td>Informacion de Acceso</td>
                                                <td>{element.access_data}</td>
                                            </tr>
                                            <tr>
                                                <td>Compañia de Tiquetes</td>
                                                <td>{element.ticket_company}</td>
                                            </tr>
                                            <tr>
                                                <td>Restriccion de Edad</td>
                                                <td>{element.age_restriction}</td>
                                            </tr>
                                            <tr>
                                                <td>Acuerdo</td>
                                                <td>{element.agreement}</td>
                                            </tr>
                                        </>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default EventData