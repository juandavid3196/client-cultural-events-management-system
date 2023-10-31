import React from 'react'
import '../eventData/EventData.scss';
import { useState } from 'react';

const EventData = ({ element, onCloseData }) => {

    const [section, setSection] = useState('evento');
    const [close, setClose] = useState(false);

    const handleClose = () => {
        setClose(true);
        setTimeout(() => {
            onCloseData();
        }, 500)
    }

    return (
        <div className={`data-container ${close ? 'close' : ''}`}>
            <div className={`data-main-box ${close ? 'close' : ''}`}>
                <div className='form-title'>
                    <span>{`Datos ${element.eventId ? `${element.specificName}` : `${element.generalName}`}`}</span>
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
                            <span>Datos {section}</span>
                        </div>
                        <table>
                            <tbody>

                                {section === 'evento' && (
                                    <>
                                        <tr>
                                            <td>Tipo de Evento</td>
                                            <td>{element.eventType}</td>
                                        </tr>
                                        <tr>
                                            <td>Estado</td>
                                            <td>{element.state}</td>
                                        </tr>
                                        <tr>
                                            <td>Fecha de Estado</td>
                                            <td>{element.dateState}</td>
                                        </tr>
                                        <tr>
                                            <td>Nombre General</td>
                                            <td>{element.generalName}</td>
                                        </tr>
                                        <tr>
                                            <td>Nombre Especifico</td>
                                            <td>{element.specificName}</td>
                                        </tr>
                                        <tr>
                                            <td>Fecha de Inicio</td>
                                            <td>{element.dateStart}</td>
                                        </tr>
                                        <tr>
                                            <td>Fecha de Finalizacion</td>
                                            <td>{element.dateFinishing}</td>
                                        </tr>
                                        <tr>
                                            <td>Hora de Inicio</td>
                                            <td>{element.hourStart}</td>
                                        </tr>
                                        <tr>
                                            <td>Hora de Finalización</td>
                                            <td>{element.hourFinishig}</td>
                                        </tr>
                                        <tr>
                                            <td>Lugar</td>
                                            <td>{element.place}</td>
                                        </tr>
                                    </>
                                )
                                }

                                {
                                    section === 'cliente' && (
                                        <>
                                            <tr>
                                                <td>Nombre de Usuario</td>
                                                <td>{element.userName}</td>
                                            </tr>
                                            <tr>
                                                <td>Telefono</td>
                                                <td>{element.phone}</td>
                                            </tr>
                                            <tr>
                                                <td>Tipo de Identificación</td>
                                                <td>{element.identificationType}</td>
                                            </tr>
                                            <tr>
                                                <td>Identificación</td>
                                                <td>{element.identificationValue}</td>
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
                                                <td>{element.mountingDate}</td>
                                            </tr>
                                            <tr>
                                                <td>Hora de Inicio</td>
                                                <td>{element.mountingStarHour}</td>
                                            </tr>
                                            <tr>
                                                <td>Hora de Finalización</td>
                                                <td>{element.mountingFinishingHour}</td>
                                            </tr>
                                            <tr>
                                                <td>Contacto técnico</td>
                                                <td>{element.technicContact}</td>
                                            </tr>
                                            <tr>
                                                <td>rider</td>
                                                <td>{element.rider}</td>
                                            </tr>
                                            <tr>
                                                <td>Minuto a Minuto</td>
                                                <td>{element.minTomin}</td>
                                            </tr>
                                        </>
                                    )
                                }
                                {
                                    section === 'comunicaciones' && (
                                        <>
                                            <tr>
                                                <td>Contacto Comunicaciones</td>
                                                <td>{element.communicationContact}</td>
                                            </tr>
                                            <tr>
                                                <td>Pulep</td>
                                                <td>{element.pulep}</td>
                                            </tr>
                                            <tr>
                                                <td>Informacion de Acceso</td>
                                                <td>{element.accessData}</td>
                                            </tr>
                                            <tr>
                                                <td>Compañia de Tiquetes</td>
                                                <td>{element.ticketCompany}</td>
                                            </tr>
                                            <tr>
                                                <td>Restriccion de Edad</td>
                                                <td>{element.ageRestriction}</td>
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