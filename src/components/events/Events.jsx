import React, { useState } from 'react'
import '../events/Events.scss';
import { events } from "../../data/events.js";
import EventForm from '../EventForm/EventForm';

const Events = () => {

	const [openForm, setOpenForm] = useState(false);

	const closeForm = () => {
		setOpenForm(false);
	}

	return (
		<div className='container'>
			{openForm && <EventForm onCloseForm={closeForm} />}
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
								<div className="event-text">
									{element.text}
								</div>
								{element.subEvents > 0 && (
									<span className='sub-events-count'>{element.subEvents}</span>
								)}
								<div className="icon-container">
									<i className="fa-solid fa-ellipsis-vertical"></i>
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