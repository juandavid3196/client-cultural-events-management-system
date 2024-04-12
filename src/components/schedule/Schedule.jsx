import React, { useEffect, useState } from 'react'
import "./Schedule.scss";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import crudService from '../../services/crudService';
import Spinner from '../spinner/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const localizer = momentLocalizer(moment)

const Schedule = () => {

    const uuid = require('uuid');
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [close, setClose] = useState(false);
    const [subEvent, setSubEvent] = useState(false);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);



    const [formData, setFormData] = useState({
        id: uuid.v4(),
        event_type: "",
        ...(subEvent ? { event_id: null } : {}),
        general_name: "",
        ...(subEvent ? { specific_name: "" } : {}),
        date_start: "",
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

    const [historyData, setHistoryData] = useState({
        type_state: '',
        date_state: '',
        hour_state: '',
        justification: 'default',
        user_state: 'default',
        ...(subEvent ? { subeventstate_id: '' } : { eventstate_id: '' })
    })

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

                    eventsCalendar.push({
                        id: data[i].id,
                        title: data[i].general_name,
                        start: new Date(year, month - 1, day, 10, 0),
                        end: moment(data[i].date_start)
                            .add(1, "hours")
                            .toDate(),
                    });
                }
            setEvents(eventsCalendar)
        } catch (error) {
            console.error('Error al cargar los eventos:', error);
        } finally {
            setLoading(false);

        }
    }

    const handleInputChange = (e) => {

        const { name, value } = e.target;

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
        let dateHour = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let hour = dateHour.getHours();
        let minutes = dateHour.getMinutes();


        let fullDate = `${year + "-" + `${month < 10 ? "0" + month : month}` + "-" + `${day < 10 ? "0" + day : day}`}`;
        let fullHour = `${hour}:${minutes < 10 ? '0' + minutes : minutes}`;


        setStateData({
            ...stateData,
            hour_state: fullHour,
            date_state: fullDate,
        })

        setHistoryData({
            ...historyData,
            hour_state: fullHour,
            date_state: fullDate,
        })

        setFormData({
            ...formData, date_start: fullDate,
        })

    }

    const setInfo = () => {
        if (subEvent) {
            historyData.subeventstate_id = stateData.id_state;
        } else {
            stateData.event_id = formData.id;
            historyData.eventstate_id = stateData.id_state;
        }
        historyData.type_state = stateData.type_state;
    }

    const resetFormData = () => {
        const keys = Object.keys(formData);
        const emptyFormData = {};

        keys.forEach((key) => {
            if (key === "id") {
                emptyFormData[key] = uuid.v4();
            } else {
                emptyFormData[key] = '';
            }
        });

        setFormData(emptyFormData);
    };


    const resetStateData = () => {
        const keys = Object.keys(stateData);
        const emptyFormData = {};

        keys.forEach((key) => {
            if (key === "id_state") {
                emptyFormData[key] = uuid.v4();
            } else if (key === "type_state") {
                emptyFormData[key] = 'pre-reserva';
            } else {
                emptyFormData[key] = '';
            }
        });
        setStateData(emptyFormData);
    };


    const validateErrors = () => {

        let hasErrors = false;

        if (formData.general_name === '') {
            hasErrors = true;
        }

        if (formData.event_type === '') {
            hasErrors = true;
        }

        if (formData.place === '') {
            hasErrors = true;
        }

        if (formData.date_start === '') {
            hasErrors = true;
        }

        if (formData.date_finishing === '') {
            hasErrors = true;
        }

        return hasErrors;
    }


    const handleForm = (e) => {
        e.preventDefault();
        setInfo();
        saveEvent();
    }


    const handleClose = () => {
        setClose(true);
        setShowModal(false);
        setUpdate(false);
        setIsFormSubmitted(false);
        resetFormData();
        resetStateData();
        getEvents();
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


    const saveEvent = async () => {
        try {
            if (update) {
                if (validateErrors()) {
                    setIsFormSubmitted(true);
                    return;
                } else {
                    await crudService.updateItem('event', formData.id, formData);
                    setUpdate(false);
                    toast.success('¡Evento Editado con Exito!');
                }
            } else {
                if (validateErrors()) {
                    setIsFormSubmitted(true);
                    return;
                } else {
                    const response = await crudService.createItem('event', formData);

                    if (response.request.status === 201) {
                        const response = await crudService.createItem('eventstate', stateData);

                        if (response.request.status === 201) {
                            crudService.createItem('historyevent', historyData);
                        }

                    }

                    toast.success('¡Evento Añadido con Exito!');
                }

            }
        } catch (error) {
            console.error('Error al guardar el evento:', error);
            toast.error('Error al guardar el evento');
        }
        setShowModal(false);
        handleClose();
    }



    const deleteEvents = async () => {
        await crudService.deleteItem('event', formData.id);
        toast.success('¡Evento Eliminado con Exito!');
        setUpdate(false);
        setShowModal(false);
        handleClose();
    }


    return (

        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className='calendar-container'>
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
                                                    <input type="text" name='general_name' onChange={handleInputChange} value={formData.general_name} placeholder='Nombre General' />
                                                    {isFormSubmitted && formData.general_name === '' && (
                                                        <div className="message-error">Este campo es obligatorio</div>
                                                    )}

                                                </div>
                                                <div className="form-box">
                                                    <label htmlFor="event_type">Modalidad Contractual</label>
                                                    <select name="event_type" onChange={handleInputChange} value={formData.event_type} >
                                                        <option value="" disabled>seleccionar</option>
                                                        <option value="propio">Propio</option>
                                                        <option value="copro">Co-Producción</option>
                                                        <option value="canje">Canje</option>
                                                        <option value="apoyo">Apoyo</option>
                                                        <option value="alquiler">Alquiler</option>
                                                    </select>
                                                    {isFormSubmitted && formData.event_type === '' && (
                                                        <div className="message-error">Este campo es obligatorio</div>
                                                    )}
                                                </div>
                                                <div><span className='form-subtitle'>Fecha y Hora</span></div>
                                                <div className="row two-colums">
                                                    <div className="form-box">
                                                        <label htmlFor="date_start">Inicio</label>
                                                        <input type="date" name='date_start' onChange={handleInputChange} value={formData.date_start} />
                                                        {isFormSubmitted && formData.date_start === '' && (
                                                            <div className="message-error">Este campo es obligatorio</div>
                                                        )}
                                                    </div>
                                                    <div className="form-box">
                                                        <label htmlFor="date_finishing">Finalización</label>
                                                        <input type="date" name='date_finishing' onChange={handleInputChange} value={formData.date_finishing} min={formData.date_start} />
                                                        {isFormSubmitted && formData.date_finishing === '' && (
                                                            <div className="message-error">Este campo es obligatorio</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`row  ${update ? '' : 'two-colums'}`}>
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
                                                        {isFormSubmitted && formData.place === '' && (
                                                            <div className="message-error">Este campo es obligatorio</div>
                                                        )}
                                                    </div>
                                                    {!update && (
                                                        <div className="form-box">
                                                            <label htmlFor="type_state">Estado</label>
                                                            <select name="type_state" onChange={handleInputChange} value={stateData.type_state}>
                                                                <option value="pre-reserva" selected>Pre-reserva</option>
                                                                <option value="confirmado">Confirmado</option>
                                                                <option value="ejecutar">Listo para Ejecutar</option>
                                                                <option value="cancelado">Cancelado</option>
                                                                <option value="ejecucion">En Ejecución</option>
                                                                <option value="terminado">Terminado</option>
                                                            </select>
                                                        </div>
                                                    )

                                                    }

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
                    <ToastContainer
                        position="top-left"
                        autoClose={800}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </div>
            )}
        </>

    )
}

export default Schedule