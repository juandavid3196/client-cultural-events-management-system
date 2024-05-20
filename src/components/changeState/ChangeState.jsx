import React, { useEffect, useState } from 'react'
import "../changeState/ChangeState.scss"
import { toast } from 'react-toastify';
import crudService from '../../services/crudService';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth0 } from "@auth0/auth0-react";

const ChangeState = ({ onCloseState, id, element, update }) => {


    const [close, setClose] = useState(false);
    const [historyStateData, setHistoryStateData] = useState([]);
    const [section, setSection] = useState('editar');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [icon, setIcon] = useState(false);
    const [hour, setHour] = useState('');
    const [date, setDate] = useState('');
    const [states, setStates] = useState([]);
    const [stateId, setStateId] = useState('');
    const { user, isAuthenticated } = useAuth0();
    const { setSubEvent, unicState, typeStateFilter, openState, subEvent } = useAppContext();

    const [formData, setFormData] = useState({
        state_id: '',
        justification: '',
    })

    const [historyData, setHistoryData] = useState({
        event_name: '',
        state_id: '',
        state_name: '',
        justification: '',
        event_id: '',
        user_email: isAuthenticated ? user.email : '',
    })


    useEffect(() => {
        getStateById(id);
        getStates();
        getDate();
        getAllHistory();
    }, [openState]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleClose = () => {
        setClose(true);
        if (!update) setSubEvent(false);
        setTimeout(() => {
            onCloseState();
        }, 500)
    }

    const filterHourDate = (value, type) => {
        const date = new Date(value);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');

        if (type === 'date') {
            return `${year}-${month}-${day}`;
        } else {
            return `${hour}:${minute}`
        }
    }


    const getDate = () => {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minutes = date.getMinutes();


        let fullDate = `${year + "-" + `${month < 10 ? "0" + month : month}` + "-" + `${day < 10 ? "0" + day : day}`}`;
        let fullHour = `${hour}:${minutes < 10 ? '0' + minutes : minutes}`;
        setDate(fullDate);
        setHour(fullHour);

    }


    const stateFilter = (id) => {
        const foundState = states.find((element) => element.id == id);
        return foundState.name;
    }

    const setHistoryInfo = () => {

        historyData.event_name = element.general_name;
        historyData.state_id = formData.state_id;
        historyData.state_name = stateFilter(formData.state_id);
        historyData.justification = formData.justification;
        historyData.event_id = id;

    }

    const resetFormData = () => {
        const keys = Object.keys(formData);
        const keys2 = Object.keys(historyData);

        const emptyFormData = {};
        const emptyFormData2 = {};

        keys.forEach((key) => {
            emptyFormData[key] = '';
        });

        keys2.forEach((key) => {
            emptyFormData2[key] = '';
        });

        setFormData(emptyFormData);
        setHistoryData(emptyFormData2);
    };


    const validateErrors = () => {

        let hasErrors = false;

        if (formData.state_id === '') {
            hasErrors = true;
        }

        if (formData.justification === '') {
            hasErrors = true;
        }

        return hasErrors;
    }

    const refresh = () => {
        setIsFormSubmitted(false);
        setIcon(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        saveState();
    }


    ///CRUD Operatios 

    const getStateById = async (id) => {
        let data = await crudService.fetchItems('eventstate');

        data.map((element) => {
            if (element.event_id == id) {
                setStateId(element.id);
                typeStateFilter(element.state_id);
            }
        })

    }

    const getAllHistory = async () => {
        let data = await crudService.fetchItems('historyeventstate');
        let historyArray = [];
        if (data) {
            data.map((elem) => {
                if (elem.event_id === id) {
                    historyArray.push(elem);
                }
            })
        }
        setHistoryStateData(historyArray);
    }

    const saveState = async () => {
        try {
            if (validateErrors()) {
                setIsFormSubmitted(true);
                setIcon(true);
                return;
            } else {
                setHistoryInfo();
                const response = await crudService.createItem('historyeventstate', historyData);
                if (response.request.status === 204) {
                    await crudService.updateItem('eventstate', stateId, formData);
                }

                toast.success('¡Estado Editado con Exito!');
            }

        } catch (error) {
            console.error('Error al guardar el evento:', error);
            toast.error('Error al guardar el evento');
        }
        resetFormData();
        handleClose();
        setSubEvent(false);
        refresh();
    }

    const getStates = async () => {
        const data = await crudService.fetchItems('states');
        setStates(data);
    }

    return (
        <div className={`change-big-container ${close ? 'close' : ''}`}>
            <div className={`change-container ${close ? 'close' : ''}`}>
                <div className='form-title'>
                    <span>{`Actualizar Estado`}</span>
                    <i class="fa-regular fa-circle-xmark" onClick={handleClose}></i>
                </div>
                <main>
                    <div className='form-eyeslashes'>
                        <span className={`eyeslashes-box ${section === 'editar' ? 'selected' : ''}`} onClick={() => setSection('editar')}>Editar&nbsp;&nbsp;{icon && validateErrors() ? (<i class="fa-solid fa-triangle-exclamation"></i>) : ''} </span>
                        <span className={`eyeslashes-box ${section === 'historial' ? 'selected' : ''}`} onClick={() => setSection('historial')}>Historial</span>

                    </div>

                    <div className="event-section">
                        <div className="section-title">
                            <span>{section === 'editar' ? `Editar estado para ${subEvent ? element.specific_name : element.general_name}` : `Historial para ${subEvent ? element.specific_name : element.general_name}`}</span>
                        </div>
                        {
                            section === 'editar' && (
                                <form onSubmit={handleSubmit}>
                                    <div className="row two-colums">
                                        <div className="form-box">
                                            <label htmlFor="date_state">Fecha</label>
                                            <input className='blocked' type="text" name='date_state' value={date} disabled />
                                        </div>
                                        <div className="form-box">
                                            <label htmlFor="hour_state">Hora</label>
                                            <input className='blocked' type="text" name='hour_state' value={hour} disabled />
                                        </div>
                                    </div>
                                    <div className="row two-colums">
                                        <div className="form-box">
                                            <label htmlFor="specific_name">Estado Actual</label>
                                            <input className='blocked' type="text" name='specific_name' disabled value={unicState} />
                                        </div>
                                        <div className="form-box">
                                            <label htmlFor="state_id">Estado Nuevo</label>
                                            <select name="state_id" onChange={handleInputChange} value={formData.state_id}>
                                                <option value="" disabled>seleccionar</option>
                                                {
                                                    states.map((element, index) => (
                                                        <option key={index} value={`${element.id}`}>{`${element.name}`}</option>
                                                    ))
                                                }
                                            </select>
                                            {isFormSubmitted && formData.state_id === '' && (
                                                <div className="message-error">Este campo es obligatorio</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-box">
                                            <label htmlFor="justification">Justificación</label>
                                            <textarea name="justification" cols="30" rows="5" onChange={handleInputChange} value={formData.justification} placeholder='Justifique el cambio de estado' ></textarea>
                                            {isFormSubmitted && formData.justification === '' && (
                                                <div className="message-error">Este campo es obligatorio</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-box form-box-btn">
                                            <button className='btn-send-form' type='submit'>Actualizar Estado</button>
                                        </div>
                                    </div>
                                </form>
                            )
                        }
                        {
                            section === 'historial' && (
                                <table>
                                    <thead>
                                        <tr>
                                            <td>Fecha</td>
                                            <td>Hora</td>
                                            <td>Justificación</td>
                                            <td>Estado</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            historyStateData.length > 0 && historyStateData.map((elem, index) => (
                                                <tr key={index}>
                                                    <td>{filterHourDate(elem.created_date, 'date')}</td>
                                                    <td>{filterHourDate(elem.created_date, 'hour')}</td>
                                                    <td>{elem.justification}</td>
                                                    <td>{elem.state_name}</td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                            )
                        }

                    </div>
                </main>
            </div >
        </div >
    )
}

export default ChangeState