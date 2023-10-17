import React, { useEffect, useState } from 'react'
import '../events/Events.scss';
import EventForm from '../EventForm/EventForm';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Events = () => {

	const [openForm, setOpenForm] = useState(false);
	const [openMenu, setOpenMenu] = useState(false);
	const [events, setEvents] = useState([])
	const [id, setId] = useState('');
	const [updateItem, setUpdateItem] = useState({});
	const [update, setUpdate] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		getEvents();
	});

	const filteredEvents = events.filter(event => event.generalName.toLowerCase().includes(searchTerm.toLowerCase()));

	const closeForm = () => {
		setOpenForm(false);
	}

	const handleAddEvent = () => {
		setOpenForm(!openForm);
		setOpenMenu(false);
	}

	const handleMenu = (id) => {
		setId(id);
		setOpenMenu(!openMenu);
	}

	const finishForm = () => {
		setOpenForm(false);
	}

	const getEvents = () => {
		axios.get('http://localhost:5000/programming')
			.then(response => {
				setEvents(response.data);
			})
			.catch(error => {
				console.error('Error al obtener datos:', error);
			});
	}

	const deleteEvent = (eventId) => {
		axios.delete(`http://localhost:5000/programming/${eventId}`)
			.then(response => {
				console.log('Elemento eliminado');
			})
			.catch(error => {
				console.error('Error al eliminar el elemento:', error);
			});
		toast.success('¡Evento Eliminado con Exito!');
	}

	const updateEvent = (id) => {
		getUnicItem(id);
		setUpdate(true);
		setOpenForm(true);
		setOpenMenu(false);

	}

	const getUnicItem = (id) => {
		axios.get(`http://localhost:5000/programming/${id}`)
			.then(response => {
				setUpdateItem(response.data);
			})
			.catch(error => {
				console.error('Error al obtener el elemento:', error);
			});
	}

	const UpdateState = () => {
		setUpdate(false);
	}


	return (
		<div className='container'>
			{openForm && <EventForm
				onCloseForm={closeForm}
				onFinishForm={finishForm}
				updateItem={updateItem}
				update={update}
				onUpdateState={UpdateState}
			/>}
			<div className='section-title'>
				<h3>Gestión de eventos</h3>
			</div>
			<div className="events-container">
				<div className='events-top'>
					<div className='input-box'>
						<div className="input-box-relative">
							<input type="text" placeholder='Buscar' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
							<i class="fa-solid fa-magnifying-glass"></i>
						</div>
					</div>
					<button className='btn-add-event' onClick={() => handleAddEvent()}>Añadir evento</button>
				</div>
				<div className='events-bottom'>
					{
						filteredEvents.map((element, index) => (
							<div key={index} className='event-box'>
								{id === element.id && openMenu && <div className='event-options'>
									<ul>
										<li>Crear Sub-evento</li>
										<li>Añadir Responsabilidad</li>
										<li>Crear Carpetas</li>
										<li onClick={() => updateEvent(element.id)}>Editar</li>
										<li onClick={() => deleteEvent(element.id)}>Eliminar</li>
									</ul>
								</div>}
								<div className="event-text">
									{element.generalName}
								</div>
								{element.subEventos > 0 && (
									<span className='sub-events-count'>{element.subEventos}</span>
								)}
								<div className="icon-container">
									<i className="fa-solid fa-ellipsis-vertical" onClick={() => handleMenu(element.id)}></i>
								</div>
							</div>
						))
					}
				</div>
			</div>
			<ToastContainer
				position="top-right"
				autoClose={2000}
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
	)
}

export default Events