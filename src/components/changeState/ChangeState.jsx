import React, { useEffect, useState } from 'react'
import "../changeState/ChangeState.scss"
import { toast } from 'react-toastify';
import crudService from '../../services/crudService';
import { useAppContext } from '../../contexts/AppContext';

const ChangeState = ({ onCloseState, subEvent, id, element, update }) => {


    const [close, setClose] = useState(false);
    const [stateData, setStateData] = useState({});
    const [historyStateData, setHistoryStateData] = useState([]);
    const [section, setSection] = useState('editar');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [icon, setIcon] = useState(false);
    const { setSubEvent, typeStateFilter, colorState, openState, setUpdateState } = useAppContext();

    const [formData, setFormData] = useState({
        id_state: '',
        type_state: '',
        date_state: '',
        hour_state: '',
        justification: '',
        user_state: 'default',
        ...(subEvent ? { subevent_id: id } : { event_id: id })
    })

    const [historyData, setHistoryData] = useState({
        type_state: '',
        date_state: '',
        hour_state: '',
        justification: '',
        user_state: 'default',
        ...(subEvent ? { subeventstate_id: '' } : { eventstate_id: '' })
    })


    useEffect(() => {
        getStateById();
        getDate();
    }, [openState])

    useEffect(() => {
        getHistoryById();
    }, [section]);


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

    const getDate = () => {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minutes = date.getMinutes();


        let fullDate = `${day}/${month}/${year}`;
        let fullHour = `${hour}:${minutes < 10 ? '0' + minutes : minutes}`;

        setFormData({
            ...formData,
            hour_state: fullHour,
            date_state: fullDate,
        })

        setHistoryData({
            ...historyData,
            hour_state: fullHour,
            date_state: fullDate,
        })
    }

    const getStateById = async () => {
        let data = null;
        if (subEvent) {
            data = await crudService.fetchItemById('subeventstate', id);
        } else {
            data = await crudService.fetchItemById('eventstate', id);
        }
        setStateData(data);
    }

    const getHistoryById = async () => {
        let data = null;
        if (stateData.id_state) {
            if (subEvent) {
                data = await crudService.fetchItemById('historysubevent', stateData.id_state);
            } else {
                data = await crudService.fetchItemById('historyevent', stateData.id_state);
            }
            setHistoryStateData(data);
        }
    }

    const setInfo = () => {
        formData.id_state = stateData.id_state;
        historyData.justification = formData.justification;
        historyData.type_state = formData.type_state;
        if (subEvent) {
            historyData.subeventstate_id = stateData.id_state;
        } else {
            historyData.eventstate_id = stateData.id_state;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setInfo();

        if (subEvent) {
            if (validateErrors()) {
                setIsFormSubmitted(true);
                setIcon(true);
                return;
            } else {
                const response = crudService.createItem('historysubevent', historyData);
                response.then((res) => {
                    if (res) {
                        crudService.updateItem('subeventstate', formData.id_state, formData);
                        toast.success('¡Estado Editado con Exito!');
                        if (update) setSubEvent(true);
                        setUpdateState(true);
                        refresh();
                    }
                }).catch((error) => {
                    console.error('Error en la solicitud', error);
                    return;
                });
            }
        } else {
            if (validateErrors()) {
                setIsFormSubmitted(true);
                setIcon(true);
                return;
            } else {
                const response = crudService.createItem('historyevent', historyData);
                response.then((res) => {
                    if (res) {
                        crudService.updateItem('eventstate', formData.id_state, formData);
                        toast.success('¡Estado Editado con Exito!');
                        setUpdateState(true);
                        refresh();
                    }
                }).catch((error) => {
                    console.error('Error en la solicitud', error);
                    return;
                });
            }
        }
        resetFormData();
        handleClose();
        setSubEvent(false);

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

        if (formData.type_state === '') {
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
                                            <input className='blocked' type="text" name='date_state' value={formData.date_state} disabled />
                                        </div>
                                        <div className="form-box">
                                            <label htmlFor="hour_state">Hora</label>
                                            <input className='blocked' type="text" name='hour_state' value={formData.hour_state} disabled />
                                        </div>
                                    </div>
                                    <div className="row two-colums">
                                        <div className="form-box">
                                            <label htmlFor="specific_name">Estado Actual</label>
                                            <input className='blocked' type="text" name='specific_name' disabled value={typeStateFilter(stateData.type_state)} />
                                        </div>
                                        <div className="form-box">
                                            <label htmlFor="type_state">Estado Nuevo</label>
                                            <select name="type_state" onChange={handleInputChange} value={formData.type_state}>
                                                <option value="" disabled>seleccionar</option>
                                                <option value="pre-reserva">Pre-reserva</option>
                                                <option value="confirmado">Confirmado</option>
                                                <option value="ejecutar">Listo para Ejecutar</option>
                                                <option value="cancelado">Cancelado</option>
                                                <option value="ejecucion">En Ejecución</option>
                                                <option value="terminado">Terminado</option>
                                            </select>
                                            {isFormSubmitted && formData.type_state === '' && (
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
                                            <td>Justificaión</td>
                                            <td>Estado</td>
                                            <td>Usuario</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            historyStateData.length > 0 && historyStateData.map((elem, index) => (
                                                <tr key={index}>
                                                    <td>{elem.date_state}</td>
                                                    <td>{elem.hour_state}</td>
                                                    <td>{elem.justification}</td>
                                                    <td className='state-cell'>{typeStateFilter(elem.type_state)}
                                                        <span className='state-circle' style={{ backgroundColor: colorState(elem.type_state) }}></span>
                                                    </td>
                                                    <td>{elem.user_state}</td>
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