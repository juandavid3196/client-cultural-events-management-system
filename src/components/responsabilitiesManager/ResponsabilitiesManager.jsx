import React, { useEffect } from 'react'
import './ResponsabilitiesManager.scss';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import crudService from '../../services/crudService';

const ResponsabilitiesManager = () => {

    const [openForm, setOpenForm] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [update, setUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [close, setClose] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [responsabilidades, setResponsabilidades] = useState([]);
    const [id, setId] = useState('');

    useEffect(() => {
        getResponsabilidades();
    }, [])

    const handleUpdate = () => {
        console.log("Tiene que actualizar la responsabilidad")
        setClose(false);
        setOpenMenu(false);
        setUpdate(true);
        setOpenForm(true);
    }

    const handleDelete = () => {
        console.log("Tiene que borrar la responsabilidad")
    }

    const handleMenu = (id) => {
        setId(id)
        console.log(id)
        setOpenMenu(!openMenu);
    }

    const handleClose = () => {
        setClose(true);
        setOpenForm(false);
        setUpdate(false);
        setIsFormSubmitted(false);
        getResponsabilidades();
        setId('');
    }

    const handleInputChange = (e) => {

        console.log("algo cambió")
    }

    const handleFormWindow = () => {
        setClose(false);
        setOpenForm(!openForm);
        setOpenMenu(false);
    }

    const handleForm = (e) => {
        e.preventDefault();
    }

    //// CRUD OPERATIONS

    const getResponsabilidades = async () => {
        const data = await crudService.fetchItems('responsability');
        setResponsabilidades(data);
        console.log("Aca abajo debería salir")
        console.log(data)

    }


    return (
        <>
            <div className='event-container'>
                <div className='section-title'>
                    <h3>Gestor de Responsablidades</h3>
                </div>
                <div className="events-container">
                    <div className='events-top'>
                        <div className='input-box'>
                            <div className="input-box-relative">
                                <input type="text" placeholder='Buscar' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </div>
                        </div>
                        <button className='btn-add-event' onClick={() => handleFormWindow()}>Añadir Responsabilidad</button>
                    </div>
                    <div className='events-bottom'>
                        {
                            responsabilidades.map((responsabilidad, index) => (
                                <div key={index} className='event-box'>
                                    <div className='event-data'>
                                        {id === responsabilidad.id && openMenu && <div className='event-options'>
                                            <ul>
                                                <li onClick={() => handleUpdate(responsabilidad.id)}>Editar</li>
                                                <li onClick={() => handleDelete(responsabilidad.id)}>Eliminar</li>
                                            </ul>
                                        </div>}
                                        <div className="event-text">
                                            {responsabilidad.name}
                                        </div>
                                        <div className="icon-container">
                                            <i className="fa-solid fa-ellipsis-vertical" onClick={() => handleMenu(responsabilidad.id)}></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <ToastContainer
                    position="top-right"
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

            {
                openForm && (
                    <div className={`form-container ${close ? 'close' : ''}`}>
                        <div className={`form-main-box ${close ? 'close' : ''}`}>

                            <div className='form-title'>
                                <span> {update ? "Editar Responsabilidad" : "Crear Responsabilidad"} </span>
                                <i class="fa-regular fa-circle-xmark" onClick={() => handleClose()}></i>
                            </div>
                            <div className="main-form">
                                <form onSubmit={handleForm}>
                                    <div className='form-section event-section'>
                                        <span className='section-title'>Datos de la Responsabilidad</span>
                                        <div className="row">
                                            <div className="form-box">
                                                <label htmlFor="place_name">Nombre de la responsabilidad</label>
                                                <input type="text" name='place_name' onChange={handleInputChange} placeholder='Nombre de la responsabilidad' />
                                            </div>
                                        </div>
                                        <div className={`row ${update ? "two-colums" : ""}`}>
                                            {update && (
                                                <div className="form-box form-box-btn">
                                                    <button type="button" className="btn-delete" onClick={() => handleDelete(id)} > Eliminar </button>
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
        </>
    )
}

export default ResponsabilitiesManager