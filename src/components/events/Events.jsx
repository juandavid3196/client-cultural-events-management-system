import React, { useState } from 'react'
import '../events/Events.scss';
import { events } from "../../data/events.js";
import EventForm from '../EventForm/EventForm';

const Events = () => {

	const [openForm, setOpenForm] = useState(false);
	const [openMenu, setOpenMenu] = useState(false);
	const [id, setId] = useState('');

	const closeForm = () => {
		setOpenForm(false);
	}

	const handleMenu = (id) => {
		setId(id);
		setOpenMenu(!openMenu);
	}

	const finishForm = () => {
		setOpenForm(false);
	}

	return (
		<div className='container'>
			{openForm && <EventForm onCloseForm={closeForm} onFinishForm={finishForm} />}
			<div className='section-title'>
				<h3>Gestión de eventos</h3>
			</div>
			<div className="events-container">
				<div className='events-top'>
					<div className='input-box'>
						<div className="input-box-relative">
							<input type="text" />
							<i class="fa-solid fa-magnifying-glass"></i>
						</div>
					</div>
					<button className='btn-add-event' onClick={() => setOpenForm(!openForm)}>Añadir evento</button>
				</div>
				<div className='events-bottom'>
					{
						events.map((element, index) => (
							<div key={index} className='event-box'>
								{id === element.id && openMenu && <div className='event-options'>
									<ul>
										<li>Crear Sub-evento</li>
										<li>Añadir Responsabilidad</li>
										<li>Crear Carpetas</li>
										<li>Editar</li>
										<li>Eliminar</li>
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
		</div>
	)
}

export default Events