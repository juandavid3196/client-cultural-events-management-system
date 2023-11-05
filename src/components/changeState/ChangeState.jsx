import React, { useEffect, useState } from 'react'
import "../changeState/ChangeState.scss"

const ChangeState = ({ onCloseState, openState }) => {

    const uuid = require('uuid');
    const [close, setClose] = useState(false);
    const [formData, setFormData] = useState({
        id_state: uuid.v4(),
        type_state: '',
        date_state: '',
        hour_state: '',
        justification: '',
        user_state: 'default',
        event_id: ''
    })

    useEffect(() => {
        getDate();
    }, [openState])

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleClose = () => {
        setClose(true);
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
        let fullHour = `${hour}:${minutes}`;

        setFormData({
            ...formData,
            hour_state: fullHour,
            date_state: fullDate,
        });
    }


    return (
        <div className={`state-big-container ${close ? 'close' : ''}`}>
            <div className={`state-container ${close ? 'close' : ''}`}>
                <div className='form-title'>
                    <span>{`Editar estado para `}</span>
                    <i class="fa-regular fa-circle-xmark" onClick={handleClose}></i>
                </div>
                <div className='main'>
                    <form action="">
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
                                <input className='blocked' type="text" name='specific_name' disabled />
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
                </div >
            </div >
        </div>
    )
}

export default ChangeState