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

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [close, setClose] = useState(false);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [modalities, setModalities] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [states, setStates] = useState([]);
    const [id, setId] = useState('');
    const [subEvent, setSubEvent] = useState(false);



    const [formData, setFormData] = useState({
        ...(subEvent ? { parent_event_id: "" } : {}),
        event_type_id: "",
        general_name: "",
        specific_name: "",
        date_start: "",
        date_finishing: "",
        hour_start: "",
        hour_finishing: "",
        place_id: "",
        user_name: "",
        phone: "",
        identification_type: "",
        identification_value: "",
        email: "user@example.com",
        description: "",
        observation: "",
        duration: "",
        mounting_date: "",
        mounting_start_hour: "",
        mounting_finishing_hour: "",
        technic_contact: "",
        rider: "",
        min_tomin: "",
        communication_contact: "",
        pulep: "",
        access_data: "",
        ticket_company: "",
        age_restriction: "",
        agreement: ""
    }
    );

    const [stateData, setStateData] = useState({
        event_id: '',
        state_id: '',
        create_at: '',
        justification: '',
    });

    const [historyData, setHistoryData] = useState({
        event_id: '',
        old_state_id: '',
        new_state_id: '',
        justification: 'default',
        create_at: '',
    })

    useEffect(() => {
        getEvents();
        getModalities();
        getSpaces();
        getStates();
        generateDate();
    }, []);

    const getEvents = async () => {
        setLoading(true);
        try {
            const data = await crudService.fetchItems('events');
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

        if (name === 'state_id') {
            setStateData({
                ...stateData,
                ['state_id']: value
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

        let fullDate = `${year + "-" + `${month < 10 ? "0" + month : month}` + "-" + `${day < 10 ? "0" + day : day}`}`;

        setStateData({
            ...stateData,
            create_at: currentDate,
        })

        setHistoryData({
            ...historyData,
            create_at: currentDate,
        })

        setFormData({
            ...formData, date_start: fullDate,
        })

    }

    const setInfo = (id) => {
        stateData.event_id = id;
        historyData.event_id = id;
        historyData.new_state_id = stateData.state_id;
        historyData.old_state_id = stateData.state_id;
    }

    const resetFormData = () => {
        const keys = Object.keys(formData);
        const emptyFormData = {};

        keys.forEach((key) => {
            emptyFormData[key] = '';
        });

        setFormData(emptyFormData);
    };


    const resetStateData = () => {
        const keys = Object.keys(stateData);
        const emptyFormData = {};

        keys.forEach((key) => {
            emptyFormData[key] = '';
        });
        setStateData(emptyFormData);
    };


    const validateErrors = () => {

        let hasErrors = false;

        if (formData.general_name === '') {
            hasErrors = true;
        }

        if (formData.event_type_id === '') {
            hasErrors = true;
        }

        if (formData.place_id === '') {
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
        setId('');
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
        setId(event.id);
    }


    ///CRUD operations

    const getModalities = async () => {
        const data = await crudService.fetchItems('contractual-modes');
        setModalities(data);
    }

    const getSpaces = async () => {
        const data = await crudService.fetchItems('spaces');
        setSpaces(data);
    }

    const getStates = async () => {
        const data = await crudService.fetchItems('states');
        setStates(data);
    }

    const getDataById = async (event) => {
        const data = await crudService.fetchItemById('events', event.id);
        setFormData(data);
    }


    const saveEvent = async () => {
        try {
            if (update) {
                if (validateErrors()) {
                    setIsFormSubmitted(true);
                    return;
                } else {
                    const response = await crudService.updateItem('events', id, formData);
                    setUpdate(false);
                    toast.success('¡Evento Editado con Exito!');
                }
            } else {
                if (validateErrors()) {
                    setIsFormSubmitted(true);
                    return;
                } else {
                    const response = await crudService.createItem('events', formData);

                    if (response.request.status === 204) {
                        setInfo();
                        const response = await crudService.createItem('eventstate', stateData);

                        if (response.request.status === 204) {
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



    const deleteEvents = async (id) => {
        await crudService.deleteItem('events', id);
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
                                                    <label htmlFor="event_type_id">Modalidad Contractual</label>
                                                    <select name="event_type_id" onChange={handleInputChange} value={formData.event_type_id} >
                                                        <option value="" disabled>seleccionar</option>
                                                        {
                                                            modalities.map((element, index) => (
                                                                <option key={index} value={`${element.id}`}>{`${element.name}`}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {isFormSubmitted && formData.event_type_id === '' && (
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
                                                        <label htmlFor="place_id">Lugar</label>
                                                        <select name="place_id" onChange={handleInputChange} value={formData.place_id} >
                                                            <option value="" disabled>Seleccionar</option>
                                                            {
                                                                spaces.map((element, index) => (
                                                                    <option key={index} value={`${element.id}`}>{`${element.name}`}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        {isFormSubmitted && formData.place_id === '' && (
                                                            <div className="message-error">Este campo es obligatorio</div>
                                                        )}
                                                    </div>
                                                    {!update && (
                                                        <div className="form-box">
                                                            <label htmlFor="state_id">Estado</label>
                                                            <select name="state_id" onChange={handleInputChange} value={stateData.state_id}>
                                                                {
                                                                    states.map((element, index) => (
                                                                        <option key={index} value={`${element.id}`}>{`${element.name}`}</option>
                                                                    ))
                                                                }
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
                                                        <button type="button" className="btn-delete" onClick={() => deleteEvents(id)} > Eliminar </button>
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