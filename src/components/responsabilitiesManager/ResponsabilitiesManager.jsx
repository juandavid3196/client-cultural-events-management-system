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
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [responsabilities, setResponsabilities] = useState([]);
    const [id, setId] = useState('');

    const filteredResponsabilities = responsabilities.filter(responsabilities => responsabilities.name.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        getResponsabilidades();
    }, [])

    const handleUpdate = (id) => {
        setClose(false);
        setOpenMenu(false);
        setUpdate(true);
        setOpenForm(true);
        getDataById(id);
    }

    const getDataById = async () => {
        const data = await crudService.fetchItemById('responsability', id);
        setName(data.name)
        setDescription(data.description)
    }

    const handleDelete = async (id) => {
        try {
            // Mostrar cuadro de diálogo de confirmación
            const confirmDelete = window.confirm('¿Estás seguro que desea eliminar esta responsabilidad?');

            if (confirmDelete) {
                const response = await fetch(`http://localhost:8007/api/responsability/${id}/desactive`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log('La responsabilidad fue eliminada exitosamente.');
                    toast.success('¡Responsabilidad Eliminada con Éxito!');
                } else {
                    console.error('Hubo un problema al desactivar el recurso:', response.statusText);
                }
            }

        } catch (error) {
            console.error('Hubo un error al realizar la solicitud:', error.message);
        }
        handleClose();
    }

    const handleMenu = (id) => {
        setId(id)
        setOpenMenu(!openMenu);
    }

    const handleClose = () => {
        setClose(true);
        setOpenForm(false);
        setUpdate(false);
        getResponsabilidades();
        setId('');
    }

    const handleInputChangeName = (e) => {

        const { name, value } = e.target;
        setName(value)
    }

    const handleInputChangeDescription = (e) => {

        const { description, value } = e.target;
        setDescription(value)
    }

    const handleFormWindow = () => {
        setClose(false);
        setName("")
        setDescription("")
        setOpenForm(!openForm);
        setOpenMenu(false);
    }

    const handleForm = (e) => {
        e.preventDefault();
        saveResponsability();
    }

    const saveResponsability = async () => {
        try {
            if (!update) {
                const response = await fetch('http://localhost:8007/api/responsability', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, description }),
                });

                if (response.ok) {
                    console.log('El recurso fue creado exitosamente.');
                    toast.success('¡Responsabilidad Añadida con Exito!');
                } else {
                    console.error('Hubo un problema al crear el recurso:', response.statusText);
                }
            } else {
                const response = await fetch(`http://localhost:8007/api/responsability/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name, description: description }),

                });

                if (response.ok) {
                    console.log('El recurso fue actualizado exitosamente.');
                    toast.success('¡Responsabilidad Actualizada con Éxito!');
                } else {
                    console.error('Hubo un problema al actualizar el recurso:', response.statusText);
                }
            }

        } catch (error) {
            console.error('Hubo un error al realizar la solicitud:', error.message);
        }
        setUpdate(false);
        handleClose();
    }

    //// CRUD OPERATIONS

    const getResponsabilidades = async () => {
        const data = await crudService.fetchItemsActive('responsability');
        setResponsabilities(data);
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
                            filteredResponsabilities.length > 0 && filteredResponsabilities.map((responsabilidad, index) => (
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
                                                <label htmlFor="responsability_name">Nombre de la responsabilidad</label>
                                                <input type="text" name='responsability_name' onChange={handleInputChangeName} value={name} placeholder='Nombre de la responsabilidad' />
                                            </div>
                                            <div className="form-box">
                                                <label htmlFor="responsability_descriptión">Descripción de la responsabilidad</label>
                                                <input type="text" name='responsability_descriptión' onChange={handleInputChangeDescription} value={description} placeholder='Nombre de la responsabilidad' />
                                            </div>
                                        </div>
                                        <div className={`row ${update ? "two-colums" : ""}`}>
                                            {update && (
                                                <div className="form-box form-box-btn">
                                                    <button type="button" className="btn-delete" onClick={() => handleDelete(id)} > Eliminar </button>
                                                </div>
                                            )}
                                            <div className="form-box form-box-btn">
                                                <button type="submit" className='btn-send-form'> {update ? "Editar" : "Guardar"} </button>
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