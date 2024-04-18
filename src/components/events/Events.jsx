import React, { useEffect, useState } from 'react'
import './Events.scss';
import EventForm from '../eventForm/EventForm';
import crudService from '../../services/crudService';
import { ToastContainer, toast } from 'react-toastify';
import { useAppContext } from '../../contexts/AppContext';
import 'react-toastify/dist/ReactToastify.css'
import EventData from '../eventData/EventData';
import ChangeState from '../changeState/ChangeState';
import StateReport from '../stateReport/StateReport';

const Events = () => {

	const [openForm, setOpenForm] = useState(false);
	const [openMenu, setOpenMenu] = useState(false);
	const [openSubMenu, setOpenSubMenu] = useState(false);
	const [openData, setOpenData] = useState(false);
	const [openReport, setOpenReport] = useState(false);
	const [events, setEvents] = useState([])
	const [subEvents, setSubEvents] = useState([])
	const [updateItem, setUpdateItem] = useState({});
	const [update, setUpdate] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [deploy, setDeploy] = useState(false)
	const [subId, setSubId] = useState(false);
	const [fullData, setFullData] = useState({});


	const { setSubEvent, id, setId, subEvent, openState, setOpenState } = useAppContext();

	useEffect(() => {
		getFullEvents();
	}, []);

	const filteredEvents = events.filter(event => event.general_name.toLowerCase().includes(searchTerm.toLowerCase()));

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

	const updateEvent = (id, type) => {
		if (type === 'subevent') {
			setSubEvent(true);
		}
		getUnicItem(id);
		setId(id);
		setUpdate(true);
		setOpenForm(true);
		setOpenMenu(false);
		setOpenSubMenu(false);
	}

	const addSubEvent = (id) => {
		setSubEvent(true);
		setUpdate(false);
		setId(id);
		setOpenForm(true);
		getUnicItem(id);
		setOpenMenu(false);
	}


	const getUnicItem = async (id) => {
		let data = await crudService.fetchItemById('events', id);
		setUpdateItem(data);
	}

	const UpdateState = () => {
		setUpdate(false);
	}

	const handleDelete = async (id) => {
		try {
			await crudService.deleteItem('events', id);
			toast.success('¡Evento Eliminado con Exito!');
		} catch (error) {
			console.error('Error al eliminar el evento:', error);
			toast.error('Error al eliminar el evento');
		}

		getFullEvents();
		refresh();
	}

	const handleDeploy = (itemId) => {
		setId(itemId);
		setDeploy(!deploy);
	}

	const getFullEvents = async () => {

		try {
			const data = await crudService.fetchItems('events');
			const subEvents = [];
			const eventsWithoutParent = [];

			data.map((element) => {

				if (element.hasOwnProperty('parent_event_id') && element.parent_event_id > 0) {
					subEvents.push(element);
				} else {
					eventsWithoutParent.push(element);
				}
			});

			setSubEvents(subEvents);
			setEvents(eventsWithoutParent);
		} catch (error) {
			console.error('Error al cargar los eventos:', error);
		}

	};


	const refresh = () => {
		setOpenMenu(false);
		setOpenSubMenu(false);
		setId('');
	}

	const subEventsCount = (id) => {
		let count = 0;
		subEvents.map((element) => {
			if (element.parent_event_id === id) {
				count++;
			}
		})

		return count;
	}

	const handleData = (data, type_event) => {
		if (type_event === 'subevent') {
			setSubEvent(true);
		}
		setOpenForm(false);
		setOpenMenu(false);
		setOpenSubMenu(false);
		setOpenData(!openData);
		setFullData(data);

	}

	const closeData = () => {
		setOpenData(!openData);
		setOpenSubMenu(false);
		setOpenMenu(false);
	}

	const closeState = () => {
		setOpenState(!openState);
		setOpenSubMenu(false);
		setOpenMenu(false);
	}

	const closeReport = () => {
		setOpenReport(!openReport);
		setOpenSubMenu(false);
		setOpenMenu(false);
		setSubEvent(false);
	}


	const handleState = (data, id, type) => {
		if (type === 'subevent') setSubEvent(true);
		setOpenState(!openState);
		setId(id);
		setFullData(data);
	}
	const handleReport = (id, type) => {
		if (type === 'subevent') setSubEvent(true);
		setOpenReport(!openReport);
		setId(id);
	}

	return (
		<div className='event-container'>
			{openForm && <EventForm
				onCloseForm={closeForm}
				onFinishForm={finishForm}
				updateItem={updateItem}
				update={update}
				onUpdateState={UpdateState}
				onGetFullEvents={getFullEvents}
				setUpdate={setUpdate}
			/>}
			{openData && <EventData
				element={fullData}
				onCloseData={closeData}
				openData={openData}
			/>}
			{openState && <ChangeState
				onCloseState={closeState}
				openState={openState}
				subEvent={subEvent}
				id={id}
				element={fullData}
				update={update}
			/>}
			{
				openReport && <StateReport
					onCloseReport={closeReport}
					openReport={openReport}
				/>
			}
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
						filteredEvents.length > 0 && filteredEvents.map((element, index) => (
							<div key={index} className='event-box'>
								<div className='event-data'>
									{id === element.id && openMenu && <div className='event-options'>
										<ul>
											<li onClick={() => handleData(element, 'event')} >Visualizar Datos</li>
											<li onClick={() => addSubEvent(element.id)}>Añadir Sub-Evento</li>
											<li>Añadir Responsabilidad</li>
											<li onClick={() => handleState(element, element.id, 'event')}>Actualizar Estado</li>
											<li onClick={() => handleReport(element.id, 'event')}>Reporte de Estados</li>
											<li onClick={() => updateEvent(element.id, 'event')}>Editar</li>
											<li onClick={() => handleDelete(element.id, 'event')}>Eliminar</li>
										</ul>
									</div>}
									<div className="event-text" onClick={() => handleDeploy(element.id)}>
										{`(Evento) ${element.general_name}`}
									</div>
									{subEventsCount(element.id) > 0 && (
										<span className='sub-events-count'>{subEventsCount(element.id)}</span>
									)}
									<div className="icon-container">
										<i className="fa-solid fa-ellipsis-vertical" onClick={() => handleMenu(element.id, 'event')}></i>
									</div>
								</div>
								<div className={`event-box subevent-box ${id === element.id && deploy ? 'expanded' : ''}`}>
									{subEvents.length > 0 && subEvents.map((subElem, index) => {
										if (subElem.parent_event_id === element.id) {
											return (
												<div className='event-data subevent-data' key={index}>
													{subId === subElem.id && openSubMenu && <div className='event-options'>
														<ul>
															<li onClick={() => handleData(subElem, 'subevent')}>Visualizar Datos</li>
															<li>Añadir Responsabilidad</li>
															<li onClick={() => handleState(subElem, subElem.id, 'subevent')}>Actualizar Estado</li>
															<li onClick={() => handleReport(subElem.id, 'subevent')}>Reporte de Estados</li>
															<li onClick={() => updateEvent(subElem.id, 'subevent')}>Editar</li>
															<li onClick={() => handleDelete(subElem.id, 'subevent')}>Eliminar</li>
														</ul>
													</div>}
													<div className="event-text">
														{`(Sub-Evento - ${index + 1}) ${subElem.specific_name}`}
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