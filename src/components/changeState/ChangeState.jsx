import React, { useEffect, useState } from 'react'
import "../changeState/ChangeState.scss"
import { toast } from 'react-toastify';
import crudService from '../../services/crudService';
import { useAppContext } from '../../contexts/AppContext';

const ChangeState = ({ onCloseState, openState, subEvent, id }) => {


    const [close, setClose] = useState(false);
    const [stateData, setStateData] = useState({});
    const [historyStateData, setHistoryStateData] = useState([]);
    const [section, setSection] = useState('editar');
    const { setSubEvent } = useAppContext();
    const [formData, setFormData] = useState({
        id_state: '',
        type_state: 'pre-reserva',
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
        setSubEvent(false);
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

            const response = crudService.createItem('historysubevent', historyData);
            response.then((res) => {
                if (res) {
                    crudService.updateItem('subeventstate', formData.id_state, formData);
                    toast.success('¡Estado Editado con Exito!');
                }
            }).catch((error) => {
                console.error('Error en la solicitud', error);
                return;
            });
        } else {
            const response = crudService.createItem('historyevent', historyData);
            response.then((res) => {
                if (res) {
                    crudService.updateItem('eventstate', formData.id_state, formData);
                    toast.success('¡Estado Editado con Exito!');
                }
            }).catch((error) => {
                console.error('Error en la solicitud', error);
                return;
            });
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




    return (
        <div className={`change-big-container ${close ? 'close' : ''}`}>
            <div className={`change-container ${close ? 'close' : ''}`}>
                <div className='form-title'>
                    <span>{`Estados`}</span>
                    <i class="fa-regular fa-circle-xmark" onClick={handleClose}></i>
                </div>
                <main>
                    <div className='form-eyeslashes'>
                        <span className={`eyeslashes-box ${section === 'editar' ? 'selected' : ''}`} onClick={() => setSection('editar')}>Editar</span>
                        <span className={`eyeslashes-box ${section === 'historial' ? 'selected' : ''}`} onClick={() => setSection('historial')}>Historial</span>

                    </div>

                    <div className="event-section">
                        <div className="section-title">
                            <span>{section === 'editar' ? 'Editar Estado' : 'Historial de Estados'}</span>
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
                                            <input className='blocked' type="text" name='specific_name' disabled value={stateData.type_state} />
                                        </div>
                                        <div className="form-box">
                                            <label htmlFor="type_state">Estado Nuevo</label>
                                            <select name="type_state" onChange={handleInputChange} value={formData.type_state}>
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
                                            <label htmlFor="justification">Información de ingreso</label>
                                            <textarea name="justification" cols="30" rows="5" onChange={handleInputChange} value={formData.justification} placeholder='Justifique el cambio de estado' ></textarea>
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
                                                    <td>{elem.hour_state}</td>
                                                    <td>{elem.date_state}</td>
                                                    <td>{elem.justification}</td>
                                                    <td>{elem.type_state}</td>
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