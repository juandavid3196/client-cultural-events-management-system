import React, { useEffect, useState } from 'react'
import "./Schedule.scss";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { useAppContext } from '../../contexts/AppContext';
import moment from 'moment'
import crudService from '../../services/crudService';
import Spinner from '../spinner/Spinner';

const localizer = momentLocalizer(moment)

const Schedule = () => {

    const uuid = require('uuid');
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [close, setClose] = useState(false);
    const { subEvent } = useAppContext();
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        setLoading(true);
        try {
            const data = await crudService.fetchItems('event');
            const eventsCalendar = [];

            if (data.length > 0)
                for (let i = 0; i < data.length; i++) {

                    const [year, month, day] = data[i].date_start.split("-").map(Number);
                    const [yearf, monthf, dayf] = data[i].date_finishing.split("-").map(Number);

                    eventsCalendar.push({
                        id: data[i].id,
                        title: data[i].general_name,
                        start: new Date(year, month - 1, day, 10, 0),
                        end: new Date(yearf, monthf - 1, dayf, 12, 0),
                    });
                }
            setEvents(eventsCalendar)
        } catch (error) {
            console.error('Error al cargar los eventos:', error);
        } finally {
            setLoading(false);

        }
    }

    const [formData, setFormData] = useState({
        id: uuid.v4(),
        event_type: "",
        ...(subEvent ? { event_id: null } : {}),
        general_name: "",
        ...(subEvent ? { specific_name: "" } : {}),
        date_start: selectedDate,
        date_finishing: "",
        place: "",
        description: "",
        observation: "",
    }
    );

    const [stateData, setStateData] = useState({
        id_state: uuid.v4(),
        type_state: 'pre-reserva',
        date_state: '',
        hour_state: '',
        justification: '',
        user_state: 'default',
        ...(subEvent ? { subevent_id: formData.id } : { event_id: formData.id })
    });

    const handleInputChange = (e) => {

        const { name, value, type } = e.target;

        if (name === 'type_state') {
            setStateData({
                ...stateData,
                ['type_state']: value
            })
        } else {

            setFormData({
                ...formData,
                [name]: value,
            });

        }

    };

    const generateDate = (currentDate) => {
        let date = new Date(currentDate);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        setFormData({
            ...formData, date_start: `${day + "-" + month + "-" + year}`,
        })
    }

    const handleForm = (e) => {
        e.preventDefault();
        saveEvent();
    }


    const handleClose = () => {
        setClose(true);
        setShowModal(false);
    }

    const handleSelectSlot = (slotInfo) => {
        setShowModal(true);
        setClose(false);
        generateDate(slotInfo.start);
    };

    const handleSelectEvent = (event) => {
        setShowModal(true)
        setClose(false);
        setUpdate(true);
        getDataById(event);
    }

    const getDataById = async (event) => {
        const data = await crudService.fetchItemById('event', event.id);
        setFormData(data);
    }


    const saveEvent = () => {
        if (update) {
            crudService.updateItem('event', formData.id, formData);
            setUpdate(false);
            console.log("editado");
        } else {
            crudService.createItem('event', formData);
            console.log("creado");
        }
        setShowModal(false);
        handleClose(true);
    }


    const deleteEvents = async () => {
        const data = await crudService.deleteItem('event', formData.id);
        setShowModal(false);
        handleClose(true);
    }


    return (

        <>
            {loading ? (
                <Spinner />
            ) : (
                <div style={{ height: "500px", width: "100%" }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ margin: "50px" }}
                        selectable={true}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                    />

                    {showModal && (

                        <div className={`form-container ${close ? 'close' : ''}`}>
                            <div className={`form-main-box ${close ? 'close' : ''}`}>

                                <div className='form-title'>
                                    <span> {update ? "Editar Evento" : "Crear Evento"} </span>
                                    <i class="fa-regular fa-circle-xmark" onClick={() => { handleClose() }}></i>
                                </div>
                                <div className="main-form">
                                    <form onSubmit={handleForm}>
                                        <div className='form-section event-section'>
                                            <span className='section-title'>Datos del Evento</span>
                                            <div className="row">
                                                <div className="form-box">
                                                    <label htmlFor="general_name">Nombre General</label>
                                                    <input type="text" name='general_name' onChange={handleInputChange} value={formData.general_name} placeholder='Nombre General' required />
                                                </div>
                                                <div className="form-box">
                                                    <label htmlFor="event_type">Modalidad Contractual</label>
                                                    <select name="event_type" onChange={handleInputChange} value={formData.event_type}>
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
                                                        <input type="date" name='date_start' onChange={handleInputChange} value={formData.date_start} />

                                                    </div>
                                                    <div className="form-box">
                                                        <label htmlFor="date_finishing">Finalización</label>
                                                        <input type="date" name='date_finishing' onChange={handleInputChange} value={formData.date_finishing} />
                                                    </div>
                                                </div>
                                                <div className="row two-colums">
                                                    <div className="form-box">
                                                        <label htmlFor="place">Lugar</label>
                                                        <select name="place" onChange={handleInputChange} value={formData.place} >
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
                                                        <select name="type_state" onChange={handleInputChange} value={stateData.type_state}>
                                                            <option value="pre-reserva">Pre-reserva</option>
                                                            <option value="confirmado">Confirmado</option>
                                                            <option value="ejecutar">Listo para Ejecutar</option>
                                                            <option value="cancelado">Cancelado</option>
                                                            <option value="ejecucion">En Ejecución</option>
                                                            <option value="terminado">Terminado</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-box">
                                                        <label htmlFor="description">Descripción</label>
                                                        <input type="text" name='description' onChange={handleInputChange} value={formData.description} placeholder='Breve descripción del evento: Concierto, Obra Teatral, Exposición ' />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-box">
                                                        <label htmlFor="Observation">Observaciones</label>
                                                        <textarea name="observation" cols="30" rows="6" onChange={handleInputChange} value={formData.observation} placeholder='Observacion, Comentario, Indicación'></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`row ${update ? "two-colums" : ""}`}>
                                                {update && (
                                                    <div className="form-box form-box-btn">
                                                        <button type="button" className="btn-delete" onClick={deleteEvents} > Eliminar </button>
                                                    </div>
                                                )}
                                                <div className="form-box form-box-btn">
                                                    <button type="submit" className='btn-send-form' > {update ? "Editar" : "Guardar"} </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>

    )
}

export default Schedule