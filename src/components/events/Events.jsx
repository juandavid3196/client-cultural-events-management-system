import React, { useEffect, useState } from 'react'
import './Events.scss';
import EventForm from '../eventForm/EventForm';
import crudService from '../../services/crudService';
import { ToastContainer, toast } from 'react-toastify';
import { useAppContext } from '../../contexts/AppContext';
import 'react-toastify/dist/ReactToastify.css'

const Events = () => {

	const [openForm, setOpenForm] = useState(false);
	const [openMenu, setOpenMenu] = useState(false);
	const [openSubMenu, setOpenSubMenu] = useState(false);
	const [events, setEvents] = useState([])
	const [updateItem, setUpdateItem] = useState({});
	const [update, setUpdate] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [subEvents, setSubEvents] = useState({})
	const [deploy, setDeploy] = useState(false)
	const [subId, setSubId] = useState(false);

	const { setSubEvent, id, setId, subEvent } = useAppContext();

	useEffect(() => {
		getEvents();
		getSubEvents();
	}, []);
	const filteredEvents = events.filter(event => event.generalName.toLowerCase().includes(searchTerm.toLowerCase()));

	const closeForm = () => {
		setOpenForm(false);
	}

	const handleAddEvent = () => {
		setOpenForm(!openForm);
		setOpenMenu(false);
	}

	const handleMenu = (id, type) => {
		if (type === 'event') {
			setId(id);
			setOpenMenu(!openMenu);
			setOpenSubMenu(false);
		} else {
			setSubId(id);
			setOpenSubMenu(!openSubMenu);
			setOpenMenu(false);
		}

	}

	const finishForm = () => {
		setOpenForm(false);
	}

	const getEvents = async () => {
		const data = await crudService.fetchItems('event');
		setEvents(data);
	}

	const updateEvent = (id, type) => {
		if (type === 'subevent') {
			setSubEvent(!subEvent);
		}
		getUnicItem(id, type);
		setUpdate(true);
		setOpenForm(true);
		setOpenMenu(false);


	}

	const getUnicItem = async (id, type) => {
		let data = null;
		if (type === 'subevent') {
			data = await crudService.fetchItemById('subevent', id);
		} else {
			data = await crudService.fetchItemById('event', id);
		}
		setUpdateItem(data);
	}

	const UpdateState = () => {
		setUpdate(false);
	}

	const handleDelete = (id, type) => {
		if (type === 'event') {
			crudService.deleteItem('event', id);

		} else {
			crudService.deleteItem('subevent', id);

		}

		toast.success('Elemento eliminado con Exito');

	}

	const addSubEvent = (id) => {
		setSubEvent(true)
		setId(id);
		setOpenForm(true);
	}

	const getSubEvents = async () => {
		const data = await crudService.fetchItems('subevent');
		setSubEvents(data);
	}

	const handleDeploy = (itemId) => {
		setId(itemId);
		setDeploy(!deploy);
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
								<div className='event-data'>
									{id === element.id && openMenu && <div className='event-options'>
										<ul>
											<li onClick={() => addSubEvent(element.id)}>Añadir Sub-Evento</li>
											<li>Añadir Responsabilidad</li>
											<li>Crear Carpetas</li>
											<li onClick={() => updateEvent(element.id, 'event')}>Editar</li>
											<li onClick={() => handleDelete(element.id, 'event')}>Eliminar</li>
										</ul>
									</div>}
									<div className="event-text" onClick={() => handleDeploy(element.id)}>
										{element.generalName}
									</div>
									{element.subEventos > 0 && (
										<span className='sub-events-count'>{element.subEventos}</span>
									)}
									<div className="icon-container">
										<i className="fa-solid fa-ellipsis-vertical" onClick={() => handleMenu(element.id, 'event')}></i>
									</div>
								</div>
								<div className={`event-box subevent-box ${id === element.id && deploy ? 'expanded' : ''}`}>
									{subEvents.length > 0 && subEvents.map((subElem, index) => {
										if (subElem.eventId === element.id) {
											return (
												<div className='event-data subevent-data' key={index}>
													{subId === subElem.id && openSubMenu && <div className='event-options'>
														<ul>
															<li>Añadir Responsabilidad</li>
															<li onClick={() => updateEvent(subElem.id, 'subevent')}>Editar</li>
															<li onClick={() => handleDelete(subElem.id, 'subevent')}>Eliminar</li>
														</ul>
													</div>}
													<div className="event-text">
														{subElem.generalName}
													</div>
													<div className="icon-container">
														<i className="fa-solid fa-ellipsis-vertical" onClick={() => handleMenu(subElem.id, 'subevent')}></i>
													</div>
												</div>);
										}
										return null;
									})}
								</div>
							</div>
						))
					}
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
	)
}

export default Events