import React, { useEffect, useState } from 'react';
import './EventForm.scss';
import { toast } from 'react-toastify';
import crudService from '../../services/crudService'
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../../contexts/AppContext';


const EventForm = ({ onCloseForm, onFinishForm, updateItem, update, onUpdateState, onGetFullEvents, setUpdate }) => {

	const [section, setSection] = useState('evento');
	const [close, setClose] = useState(false);
	const [duration, setDuration] = useState('');
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [icon, setIcon] = useState(false);
	const [modalities, setModalities] = useState([]);
	const [spaces, setSpaces] = useState([]);
	const [states, setStates] = useState([]);
	const { setSubEvent, subEvent, id, setOpenState, openState, unicState, typeStateFilter, updateState, setUpdateState } = useAppContext();

	const [formData, setFormData] = useState({
		parent_event_id: null,
		event_type_id: "",
		general_name: "",
		specific_name: "",
		date_start: "",
		date_finishing: "",
		hour_start: "",
		hour_finishing: "",
		place_id: "",
		user_name: "",
		phone: "",
		identification_type: "CC",
		identification_value: "",
		email: "",
		description: "",
		observation: "",
		duration: duration,
		mounting_date: "",
		mounting_start_hour: "",
		mounting_finishing_hour: "",
		technic_contact: "",
		rider: null,
		min_tomin: null,
		communication_contact: "",
		pulep: "",
		access_data: "",
		ticket_company: "",
		age_restriction: "",
		agreement: ""
	}
	);


	const [stateData, setStateData] = useState({
		event_id: '',
		state_id: '',
		justification: '',
	});

	const [historyData, setHistoryData] = useState({
		event_id: '',
		old_state_id: '',
		new_state_id: '',
		justification: 'default',
	})


	useEffect(() => {
		getModalities();
		getSpaces();
		getStates();
	}, []);

	useEffect(() => {
		if (update) getStateById();
	}, [update, updateState]);

	useEffect(() => {
		calculateDuration();
	}, [formData]);


	useEffect(() => {
		if (update) setFormData(updateItem);
	}, [update, updateItem]);

	useEffect(() => {

		if (subEvent && update) {
			setFormData(updateItem);

		} else if (subEvent) {
			const updatedFormData = {
				...formData,
				parent_event_id: id,
				event_type_id: updateItem.event_type_id,
				general_name: updateItem.general_name,
				date_start: updateItem.date_start,
				date_finishing: updateItem.date_finishing,
				user_name: updateItem.user_name,
				phone: updateItem.phone,
				identification_type: updateItem.identification_type,
				identification_value: updateItem.identification_value,
				email: updateItem.email,
				place_id: updateItem.place_id,

			};

			setFormData(updatedFormData);
		}
	}, [subEvent, updateItem]);


	const handleInputChange = (e) => {

		const { name, value, type } = e.target;

		if (type === 'file') {
			const { files } = e.target;
			const f = new FormData();
			f.append('file', files[0]);
			setFormData({
				...formData,
				[name]: f,
			});
		} else if (name === 'state_id') {
			setStateData({
				...stateData,
				['state_id']: parseInt(value),
			})
		} else {

			setFormData({
				...formData,
				[name]: value,
			});

		}

	};


	const resetFormData = () => {
		const keys = Object.keys(formData);
		const emptyFormData = {};

		keys.forEach((key) => {
			emptyFormData[key] = '';
		});
		emptyFormData.parent_event_id = null;
		setFormData(emptyFormData);
	};

	const resetStateData = () => {
		const keys = Object.keys(stateData);
		const emptyFormData = {};

		keys.forEach((key) => {
			emptyFormData[key] = '';
		});

		setStateData(emptyFormData);
	};




	const handleForm = (e) => {
		e.preventDefault();
		saveEvent();
	};

	const handleClose = () => {
		setClose(true);
		setTimeout(() => {
			onCloseForm();
		}, 500)
		onUpdateState();
		setUpdateState(false);
		setUpdate(false);
		setSubEvent(false);
	}


	const identificationValue = (type) => {
		if (type === 'CC') {
			return '39180589';
		} else if (type === 'RUT') {
			return ' 123456789';
		} else if (type === 'NIT') {
			return '800.123.456-7';
		}
	}

	const calculateDuration = () => {


		if (formData.mounting_start_hour && formData.mounting_finishing_hour) {

			let hours = 0;
			let totalHours = 0;
			let minutes = 0;
			const StartHour = parseInt(`${formData.mounting_start_hour[0]}${formData.mounting_start_hour[1]}`);
			const StartMinutes = parseInt(`${formData.mounting_start_hour[3]}${formData.mounting_start_hour[4]}`);
			const finishingHour = parseInt(`${formData.mounting_finishing_hour[0]}${formData.mounting_finishing_hour[1]}`);
			const finishingMinutes = parseInt(`${formData.mounting_finishing_hour[3]}${formData.mounting_finishing_hour[4]}`);



			if (StartHour < finishingHour) {
				hours = finishingHour - StartHour;

				if (StartMinutes <= finishingMinutes) {
					minutes = finishingMinutes - StartMinutes;
				} else {
					hours--;
					minutes = (60 - StartMinutes) + finishingMinutes;
				}
				if (minutes > 60) {
					totalHours = Math.floor(minutes / 60);
					hours = hours + totalHours;
					minutes = minutes % 60;
				}
			} else if (StartHour === finishingHour) {
				hours = 0;
				if (finishingMinutes > StartMinutes) {
					minutes = finishingMinutes - StartMinutes;
				}

			} else {
				hours = (23 - StartHour) + finishingHour;
				minutes = (60 - StartMinutes) + finishingMinutes;

				if (minutes >= 60) {
					totalHours = Math.floor(minutes / 60);
					hours = hours + totalHours;
					minutes = minutes % 60;
				}
			}

			let time = `${hours === 1 ? `${hours} Hora` : hours > 1 ? `${hours} Horas` : ''}${minutes === 1 ? ` ${minutes} Minuto` : minutes > 1 ? ` ${minutes} Minutos` : ''}`;

			setDuration(time);

		}
	}

	const validateErrors = () => {

		let hasErrors = false;

		if (formData.general_name === '') {
			hasErrors = true;
		}

		if (formData.event_type_id === '') {
			hasErrors = true;
		}

		if (formData.place_id === '') {
			hasErrors = true;
		}

		if (formData.date_start === '') {
			hasErrors = true;
		}

		if (formData.date_finishing === '') {
			hasErrors = true;
		}

		if (formData.specific_name === '' && subEvent) {
			hasErrors = true;
		}

		if (stateData.state_id === '' && !update) {
			hasErrors = true;
		}

		return hasErrors;
	}

	const refresh = () => {
		setIsFormSubmitted(false);
		setIcon(false);
		setSubEvent(false);
	}


	const setInfo = (id) => {
		stateData.event_id = id;
		historyData.event_id = id;
		historyData.new_state_id = stateData.state_id;
		historyData.old_state_id = stateData.state_id;
	}

	const openStateWindow = () => {
		setOpenState(true);
	}


	// CRUD Operations

	const saveEvent = async () => {
		try {
			if (update) {
				if (validateErrors()) {
					setIsFormSubmitted(true);
					setIcon(true);
					return;
				} else {
					await crudService.updateItem('events', id, formData);
					toast.success('¡Evento Editado con Exito!');
					setUpdate(false);
				}
			} else {
				if (validateErrors()) {
					setIsFormSubmitted(true);
					setIcon(true);
					return;
				} else {
					const response = await crudService.createItem('events', formData);
					setInfo(response.data.id);
					if (response.request.status === 201) {
						await crudService.createItem('eventstate', stateData);
					}
				}
				toast.success('¡Evento Añadido con Exito!');
			}
		} catch (error) {
			console.error('Error al guardar el evento:', error);
			toast.error('Error al guardar el evento');
		}

		onUpdateState();
		resetFormData();
		resetStateData();
		onFinishForm();
		refresh();
		onGetFullEvents();
	}


	const getModalities = async () => {
		const data = await crudService.fetchItems('contractual-modes');
		setModalities(data);
	}

	const getSpaces = async () => {
		const data = await crudService.fetchItems('spaces');
		setSpaces(data);
	}

	const getStates = async () => {
		const data = await crudService.fetchItems('states');
		setStates(data);
	}

	const getStateById = async () => {
		let data = await crudService.fetchItems('eventstate');

		data.map((element) => {
			if (element.event_id == id) {
				typeStateFilter(element.state_id);
			}
		})

	}

	return (
		<div className={`form-container ${close ? 'close' : ''}`}>
			<div className={`form-main-box ${close ? 'close' : ''}`}>
				<div className='form-title'>
					<span>{subEvent && update ? 'Editar Sub-Evento' : update ? 'Editar Evento' : subEvent ? 'Añadir Sub-Evento' : 'Añadir Evento'}</span>
					<i class="fa-regular fa-circle-xmark" onClick={handleClose}></i>
				</div>
				<div className='main-form'>
					<div className='form-eyeslashes'>
						<span className={`eyeslashes-box ${section === 'evento' ? 'selected' : ''}`} onClick={() => setSection('evento')}>
							Evento&nbsp;&nbsp;{icon && validateErrors() ? (<i class="fa-solid fa-triangle-exclamation"></i>) : ''}
						</span>
						<span className={`eyeslashes-box ${section === 'cliente' ? 'selected' : ''}`} onClick={() => setSection('cliente')}>Cliente</span>
						<span className={`eyeslashes-box ${section === 'tecnica' ? 'selected' : ''}`} onClick={() => setSection('tecnica')}>Info Técnica</span>
						<span className={`eyeslashes-box ${section === 'comunicaciones' ? 'selected' : ''}`} onClick={() => setSection('comunicaciones')}>Info Comunicaciones</span>
					</div>
					<form onSubmit={handleForm}>

						{
							section === 'evento' && (
								<div className='form-section event-section'>
									<span className='section-title'>Datos del Evento</span>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="event_type_id">Tipo de Evento</label>
											<select name="event_type_id" onChange={handleInputChange} value={formData.event_type_id}>
												<option value="" disabled>seleccionar</option>
												{
													modalities.map((element, index) => (
														<option key={index} value={`${element.id}`}>{`${element.name}`}</option>
													))
												}
											</select>
											{isFormSubmitted && formData.event_type_id === '' && (
												<div className="message-error">Este campo es obligatorio</div>
											)}

										</div>


										{
											!update ? (
												<>
													<div className="form-box">
														<label htmlFor="state_id">Estado</label>
														<select name="state_id" onChange={handleInputChange} value={stateData.state_id} {...(update ? { disabled: 'disabled' } : {})}>
															<option value="" disabled>seleccionar</option>
															{
																states.map((element, index) => (
																	<option key={index} value={`${element.id}`}>{`${element.name}`}</option>
																))
															}
														</select>
														{isFormSubmitted && stateData.state_id === '' && (
															<div className="message-error">Este campo es obligatorio</div>
														)}

													</div>
												</>

											) : (

												<>
													<div className="row two-colums-small">
														<div className="form-box">
															<label htmlFor="stade_id">Estado Actual</label>
															<input type="text" name='state_id' disabled value={unicState} />
														</div>
														<div className="form-box">
															<input type='button' className='btn-send-form' onClick={openStateWindow} value={'Actualizar Estado'} />
														</div>
													</div>
												</>
											)
										}
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="general_name">Nombre General</label>
											<input type="text" name='general_name' {...(subEvent ? { disabled: 'disabled' } : {})} onChange={handleInputChange} value={formData.general_name} placeholder='Nombre General' required />
											{isFormSubmitted && formData.general_name === '' && (
												<div className="message-error">Este campo es obligatorio</div>
											)}

										</div>
										<div className="form-box">
											<label htmlFor="specific_name">Nombre Especifico</label>
											<input type="text" name='specific_name' {...(subEvent ? {} : { disabled: 'disabled' })} onChange={handleInputChange} value={formData.specific_name} placeholder='Nombre Especifico' />
											{isFormSubmitted && formData.specific_name === '' && subEvent && (
												<div className="message-error">Este campo es obligatorio</div>
											)}
										</div>
									</div>

									<div><span className='form-subtitle'>Fecha y Hora</span></div>
									<div className="row two-colums">
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="date_start">Fecha de Inicio</label>
												<input type="date" name='date_start' onChange={handleInputChange} value={formData.date_start} />
												{isFormSubmitted && formData.date_start === '' && (
													<div className="message-error">Este campo es obligatorio</div>
												)}
											</div>
											<div className="form-box">
												<label htmlFor="date_finishing">Fecha de Finalización</label>
												<input type="date" name='date_finishing' onChange={handleInputChange} value={formData.date_finishing} min={formData.date_start} />
												{isFormSubmitted && formData.date_finishing === '' && (
													<div className="message-error">Este campo es obligatorio</div>
												)}
											</div>
										</div>
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="hour_start">Hora de Inicio</label>
												<input type="time" name='hour_start' onChange={handleInputChange} value={formData.hour_start} />
											</div>
											<div className="form-box">
												<label htmlFor="hour_finishing">Hora de Finalización</label>
												<input type="time" name='hour_finishing' onChange={handleInputChange} value={formData.hour_finishing} min={(formData.date_start === formData.date_finishing) ? formData.hour_start : ''} />
											</div>
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="place_id">Lugar</label>
											<select name="place_id" onChange={handleInputChange} value={formData.place_id}>
												<option value="" disabled>Seleccionar</option>
												{
													spaces.map((element, index) => (
														<option key={index} value={`${element.id}`}>{`${element.name}`}</option>
													))
												}
											</select>
											{isFormSubmitted && formData.place_id === '' && (
												<div className="message-error">Este campo es obligatorio</div>
											)}
										</div>
										<div className="form-box">
											<label htmlFor="description">Descripción</label>
											<input type="text" name='description' onChange={handleInputChange} value={formData.description} placeholder='Breve descripción del evento: Concierto, Obra Teatral, Exposición ' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="Observation">Observaciones</label>
											<textarea name="observation" cols="30" rows="6" onChange={handleInputChange} value={formData.observation} placeholder='Observacion, Comentario, Indicación'></textarea>
										</div>
									</div>
								</div>
							)
						}
						{
							section === 'cliente' && (
								<div className="form-section">
									<span className='section-title'>Datos del Solicitante</span>
									<div className="row">
										<div className="form-box">
											<label htmlFor="user_name">Nombre</label>
											<input type="text" name='user_name' onChange={handleInputChange} value={formData.user_name} placeholder='Nombre' />
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="phone">Celular</label>
											<input type="text" name='phone' onChange={handleInputChange} value={formData.phone} placeholder='320890675 / 3108900823' />
										</div>
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="identification_type">Tipo de Identificación</label>
												<select name="identification_type" onChange={handleInputChange} value={formData.identification_type}>
													<option value="CC">Cédula</option>
													<option value="RUT" >RUT</option>
													<option value="NIT" >NIT</option>
												</select>
											</div>
											<div className="form-box">
												<label htmlFor="identification_value">Numero de Identificación</label>
												<input type="text" name='identification_value' onChange={handleInputChange} value={formData.identification_value} placeholder={identificationValue(formData.identification_type)} />
											</div>
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="email">Email</label>
											<input type="email" name='email' onChange={handleInputChange} value={formData.email} placeholder='Correo Electronico' />
										</div>
									</div>
								</div>
							)
						}
						{
							section === 'tecnica' && (
								<div className="form-section">
									<span className='section-title'>Datos Técnicos</span>
									<div><span className='form-subtitle'>Fecha y Hora Montaje</span></div>
									<div className="row two-colums">
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="mounting_date">Fecha Montaje</label>
												<input type="date" name='mounting_date' onChange={handleInputChange} value={formData.mounting_date} />
											</div>
											<div className="form-box">
												<label htmlFor="mounting_start_hour">Hora Inicio </label>
												<input type="time" name='mounting_start_hour' onChange={handleInputChange} value={formData.mounting_start_hour} />
											</div>

										</div>
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="mounting_finishing_hour">Hora Finalización</label>
												<input type="time" name='mounting_finishing_hour' onChange={handleInputChange} value={formData.mounting_finishing_hour} />
											</div>
											<div className="form-box">
												<label htmlFor="duration">Duración</label>
												<input type="text" name='duration' disabled onChange={handleInputChange} value={duration} placeholder='0' />
											</div>
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="technic_contact">Contacto Montaje Tecnico</label>
											<textarea name="technic_contact" onChange={handleInputChange} value={formData.technic_contact} placeholder='Nombre / Celular' cols="30" rows="5"></textarea>
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="rider">Rider</label>
											<input type="file" name='rider' onChange={handleInputChange} />
										</div>
										<div className="form-box">
											<label htmlFor="min_tomin">Minuto a Minuto</label>
											<input type="file" name='minTomin' onChange={handleInputChange} />
										</div>
									</div>
								</div>
							)
						}
						{
							section === 'comunicaciones' && (
								<div className="form-section event-section">
									<span className='section-title'>Datos Comunicaciones</span>
									<div className="row">
										<div className="form-box">
											<label htmlFor="communication_contact">Contacto comunicaciones</label>
											<textarea name="communication_contact" cols="30" rows="5" onChange={handleInputChange} value={formData.communication_contact} placeholder='Artista, Manager, Comunicador'></textarea>
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="agreement">Convenio / Alianzas</label>
											<textarea name="agreement" cols="30" rows="5" onChange={handleInputChange} value={formData.agreement} placeholder='Covenio / Alianzas' ></textarea>
										</div>

										<div className="form-box">
											<label htmlFor="access_data">Información de ingreso</label>
											<textarea name="access_data" cols="30" rows="5" onChange={handleInputChange} value={formData.access_data} placeholder='Modalidad, Costo, Cuenta Bancaria' ></textarea>
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="ticket_company">Empresa de boleteria</label>
											<input type="text" name='ticket_company' onChange={handleInputChange} value={formData.ticket_company} placeholder='Nombre Empresa' />
										</div>
										<div className="form-box">
											<label htmlFor="age_restriction">Restricción de edad</label>
											<input type="text" name="age_restriction" onChange={handleInputChange} value={formData.age_restriction} />
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="pulep">PULEP</label>
											<input type="text" name='pulep' onChange={handleInputChange} value={formData.pulep} />
										</div>
									</div>
									<div className="row">
										<div className="form-box form-box-btn">
											<button className='btn-send-form' type='submit'>{update ? 'Editar' : 'Guardar'}</button>
										</div>
									</div>
								</div>
							)
						}
					</form>
				</div>
			</div>
		</div>
	)
}

export default EventForm