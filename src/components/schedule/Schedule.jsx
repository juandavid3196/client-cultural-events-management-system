import React, { useState } from 'react'
import "./Schedule.scss";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

const Schedule = () => {

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTitle, setEventTitle] = useState('');
    const [selectEvent, setSelectEvent] = useState(null);
    const [close, setClose] = useState(false);

    const handleClose = () => {
        setClose(true);
        setShowModal(false);
    }

    const handleSelectSlot = (slotInfo) => {
        setShowModal(true);
        setClose(false);
        setSelectedDate(slotInfo.start);
        setSelectEvent(null);
    };

    const handleSelectedEvent = (event) => {
        setShowModal(true);
        setClose(false);
        setSelectEvent(event);
        setEventTitle(event.title);
    };

    const saveEvent = () => {
        if (eventTitle && selectedDate) {
            if (selectEvent) {
                const updatedEvent = { ...selectEvent, title: eventTitle };
                const updatedEvents = events.map((event) =>
                    event === selectEvent ? updatedEvent : event
                );
                setEvents(updatedEvents);
            } else {
                const newEvent = {
                    title: eventTitle,
                    start: selectedDate,
                    end: moment(selectedDate)
                        .add(1, "hours")
                        .toDate(),
                };
                setEvents([...events, newEvent]);
            }
            setShowModal(false);
            setEventTitle("");
            setSelectEvent(null);
            handleClose();
        }
    };

    const deleteEvents = () => {
        if (selectEvent) {
            const updatedEvents = events.filter((event) => event !== selectEvent);
            setEvents(updatedEvents);
            setShowModal(false);
            setEventTitle('');
            setSelectEvent(null);
            handleClose();
        }
    }


    return (
        <div style={{ height: "500px", width: "100%" }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ margin: "50px" }}
                selectable={true}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectedEvent}
            />

            {showModal && (

                <div className={`modal-container ${close ? 'close' : ''}`}>
                    <div className={`modal-content ${close ? 'close' : ''}`}>
                        <div className="modal-header">
                            <div className='form-title'>
                                <span> {selectEvent ? "Editar Evento" : "Crear Evento"} </span>
                                <i class="fa-regular fa-circle-xmark" onClick={() => {
                                    handleClose();
                                    setShowModal(false);
                                    setEventTitle("");
                                    setSelectEvent(null);
                                }}></i>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="form-box">
                                    <label htmlFor="event-title">Titulo del Evento</label>
                                    <input
                                        type="text"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                    />
                                </div>
                                <div className="form-box">
                                    <label htmlFor="event_type">Tipo de Evento</label>
                                    <select name="event_type">
                                        <option value="" disabled>seleccionar</option>
                                        <option value="propio">Propio</option>
                                        <option value="copro">Co-Producción</option>
                                        <option value="canje">Canje</option>
                                        <option value="apoyo">Apoyo</option>
                                        <option value="alquiler">Alquiler</option>
                                    </select>
                                </div>
                                <div><span className='form-subtitle'>Fecha y Hora</span></div>
                                <div className="row two-colums">
                                    <div className="form-box">
                                        <label htmlFor="date_start">Inicio</label>
                                        <input type="date" name='date_start' />

                                    </div>
                                    <div className="form-box">
                                        <label htmlFor="date_finishing">Finalización</label>
                                        <input type="date" name='date_finishing' />
                                    </div>
                                </div>
                                <div className="row two-colums">
                                    <div className="form-box">
                                        <label htmlFor="place">Lugar</label>
                                        <select name="place">
                                            <option value="" disabled>Seleccionar</option>
                                            <option value="sala">Sala</option>
                                            <option value="cafe-teatro">Cafe Teatro</option>
                                            <option value="plazoleta">Plazoleta</option>
                                            <option value="aula-taller">Aula Taller</option>
                                            <option value="otros">Otros</option>
                                        </select>
                                    </div>
                                    <div className="form-box">
                                        <label htmlFor="type_state">Estado</label>
                                        <select name="type_state">
                                            <option value="pre-reserva">Pre-reserva</option>
                                            <option value="confirmado">Confirmado</option>
                                            <option value="ejecutar">Listo para Ejecutar</option>
                                            <option value="cancelado">Cancelado</option>
                                            <option value="ejecucion">En Ejecución</option>
                                            <option value="terminado">Terminado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className={`row ${selectEvent ? "two-colums" : ""}`}>
                                {selectEvent && (
                                    <div className="form-box form-box-btn">
                                        <button type="button" className="btn-delete" onClick={deleteEvents} > Eliminar </button>
                                    </div>
                                )}
                                <div className="form-box form-box-btn">
                                    <button type="button" className='btn-send-form' onClick={saveEvent} > {selectEvent ? "Editar" : "Guardar"} </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default Schedule