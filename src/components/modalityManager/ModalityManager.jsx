import React, { useEffect } from 'react'
import './ModalityManager.scss';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import crudService from '../../services/crudService';

const ModalityManager = () => {

    const uuid = require('uuid');
    const [openForm, setOpenForm] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [update, setUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [close, setClose] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [modalities, setModalities] = useState([]);
    const [id, setId] = useState('');


    const [formData, setFormData] = useState({
        id: uuid.v4(),
        modality_name: "",
        creation_date: "",
        update_date: "",
    });

    const filteredEvents = modalities.filter(modality => modality.modality_name.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        getModalities();
        getDate();
    }, [])

    const handleUpdate = () => {
        setClose(false);
        setOpenMenu(false);
        setUpdate(true);
        getDataById();
        setOpenForm(true);
        getDate();
    }


    const getDate = () => {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let fullDate = `${year + "-" + `${month < 10 ? "0" + month : month}` + "-" + `${day < 10 ? "0" + day : day}`}`;

        setFormData({
            ...formData,
            ...(update ? { update_date: fullDate } : { creation_date: fullDate, update_date: fullDate })
        })
    }

    const handleMenu = (id) => {
        setId(id);
        setOpenMenu(!openMenu);
    }

    const handleClose = () => {
        setClose(true);
        setOpenForm(false);
        setUpdate(false);
        setIsFormSubmitted(false);
        resetFormData();
        getModalities();
        setId('');
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

    const validateErrors = () => {

        let hasErrors = false;

        if (formData.name_state === '') {
            hasErrors = true;
        }

        return hasErrors;
    }

    const handleInputChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleFormWindow = () => {
        setClose(false);
        setOpenForm(!openForm);
        setOpenMenu(false);
        getDate();
    }

    const handleForm = (e) => {
        e.preventDefault();
        saveModality();
    }

    //// CRUD OPERATIONS

    const getModalities = async () => {
        const data = await crudService.fetchItems('modality');
        setModalities(data);

    }

    const saveModality = async () => {
        try {
            if (update) {
                if (validateErrors()) {
                    setIsFormSubmitted(true);
                    return;
                } else {
                    await crudService.updateItem('modality', formData.id, formData);
                    setUpdate(false);
                    toast.success('¡Modalidad Editada con Exito!');
                }
            } else {
                if (validateErrors()) {
                    setIsFormSubmitted(true);
                    return;
                } else {
                    await crudService.createItem('modality', formData);
                    toast.success('¡Modalidad Añadida con Exito!');
                }

            }
        } catch (error) {
            console.error('Error al guardar la modalidad:', error);
            toast.error('Error al guardar la modalidad');
        }

        handleClose();
    }

    const getDataById = async () => {
        const data = await crudService.fetchItemById('modality', id);
        setFormData(data);
    }

    const handleDelete = async (id) => {
        await crudService.deleteItem('modality', id);
        toast.success('¡Modalidad Eliminada con Exito!');
        handleClose();
    }


    return (
        <>
            <div className='event-container'>
                <div className='section-title'>
                    <h3>Gestor de Modalidades Contractuales</h3>
                </div>
                <div className="events-container">
                    <div className='events-top'>
                        <div className='input-box'>
                            <div className="input-box-relative">
                                <input type="text" placeholder='Buscar' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </div>
                        </div>
                        <button className='btn-add-event' onClick={() => handleFormWindow()}>Añadir Modalidad</button>
                    </div>
                    <div className='events-bottom'>
                        {
                            filteredEvents.length > 0 && filteredEvents.map((element, index) => (
                                <div key={index} className='event-box'>
                                    <div className='event-data'>
                                        {id === element.id && openMenu && <div className='event-options'>
                                            <ul>
                                                <li onClick={() => handleUpdate(element.id)}>Editar</li>
                                                <li onClick={() => handleDelete(element.id)}>Eliminar</li>
                                            </ul>
                                        </div>}
                                        <div className="event-text">
                                            {element.modality_name}
                                        </div>
                                        <div className="icon-container">
                                            <i className="fa-solid fa-ellipsis-vertical" onClick={() => handleMenu(element.id)}></i>
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
                                <span> {update ? "Editar Estado" : "Crear Estado"} </span>
                                <i class="fa-regular fa-circle-xmark" onClick={() => handleClose()}></i>
                            </div>
                            <div className="main-form">
                                <form onSubmit={handleForm}>
                                    <div className='form-section event-section'>
                                        <span className='section-title'>Datos de la Modalidad Contractual</span>
                                        <div className="row">
                                            <div className="form-box">
                                                <label htmlFor="modality_name">Nombre de la Modalidad</label>
                                                <input type="text" name='modality_name' onChange={handleInputChange} value={formData.modality_name} placeholder='Nombre de la modalidad' />
                                                {isFormSubmitted && formData.modality_name === '' && (
                                                    <div className="message-error">Este campo es obligatorio</div>
                                                )}

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

export default ModalityManager