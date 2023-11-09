import React, { useEffect, useState } from 'react';
import './EventForm.scss';
import { toast } from 'react-toastify';
import crudService from '../../services/crudService'
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../../contexts/AppContext';


const EventForm = ({ onCloseForm, onFinishForm, updateItem, update, onUpdateState, onGetFullEvents }) => {

	const uuid = require('uuid');
	const [section, setSection] = useState('evento');
	const [close, setClose] = useState(false);
	const [duration, setDuration] = useState('');
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [icon, setIcon] = useState(false);
	const { setSubEvent, subEvent, id } = useAppContext();

	const [formData, setFormData] = useState({
		id: uuid.v4(),
		event_type: "",
		event_id: null,
		general_name: "",
		specific_name: "",
		date_start: "",
		date_finishing: "",
		hour_start: "",
		hour_finishing: "",
		place: "",
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
		id_state: uuid.v4(),
		type_state: 'pre-reserva',
		date_state: '',
		hour_state: '',
		justification: '',
		user_state: 'default',
		...(subEvent ? { subevent_id: formData.id } : { event_id: formData.id })
	});

	const [historyData, setHistoryData] = useState({
		type_state: '',
		date_state: '',
		hour_state: '',
		justification: 'default',
		user_state: 'default',
		...(subEvent ? { subeventstate_id: '' } : { eventstate_id: '' })
	})


	useEffect(() => {
		getDate();
	}, []);


	useEffect(() => {
		calculateDuration();
	}, [formData]);


	useEffect(() => {
		if (update) setFormData(updateItem);
	}, [update, updateItem])

	useEffect(() => {

		if (subEvent && update) {
			setFormData(updateItem);

		} else if (subEvent) {
			const updatedFormData = {
				...formData,
				event_type: updateItem.event_type,
				general_name: updateItem.general_name,
				user_name: updateItem.user_name,
				phone: updateItem.phone,
				identification_type: updateItem.identification_type,
				identification_value: updateItem.identification_value,
				email: updateItem.email,
				place: updateItem.place,

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
		} else if (name === 'type_state') {
			setStateData({
				...stateData,
				['type_state']: value
			})
		} else {

			setFormData({
				...formData,
				[name]: value,
			});

		}

	};


	const handleClose = () => {
		setClose(true);
		setTimeout(() => {
			onCloseForm();
		}, 500)
		onUpdateState();
		setSubEvent(false);
	}

	const resetFormData = () => {
		const keys = Object.keys(formData);
		const emptyFormData = {};

		keys.forEach((key) => {
			emptyFormData[key] = '';
		});

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

		if (subEvent) {

			if (update) {
				if (validateErrors()) {
					setIsFormSubmitted(true);
					setIcon(true);
					return;
				} else {
					crudService.updateItem('subevent', formData.id, formData);
					toast.success('¡Sub-Evento Editado con Exito!');
					onUpdateState();
					onGetFullEvents();
					refresh();
				}
			} else {
				if (validateErrors()) {
					setIsFormSubmitted(true);
					setIcon(true);
					return;
				} else {
					formData.event_id = id;
					const response = crudService.createItem('subevent', formData);
					response.then((res) => {
						if (res) {
							const response = crudService.createItem('subeventstate', stateData);
							response.then((res) => {
								if (res) {
									setInfo();
									crudService.createItem('historysubevent', historyData);
								}
							}).catch((error) => {
								console.error('Error en la solicitud', error);
								return;
							});
						}
					}).catch((error) => {
						console.error('Error en la solicitud', error);
						return;
					});
					toast.success('¡Sub-Evento Añadido con Exito!');
					onGetFullEvents();
					resetStateData();
					refresh();
				}
			}
			setSubEvent(false);
		} else {
			if (update) {
				if (validateErrors()) {
					setIsFormSubmitted(true);
					setIcon(true);
					return;
				} else {
					crudService.updateItem('event', formData.id, formData);
					toast.success('¡Evento Editado con Exito!');
					onUpdateState();
					onGetFullEvents();
					refresh();
				}
			} else {
				if (validateErrors()) {
					setIsFormSubmitted(true);
					setIcon(true);
					return;
				} else {
					const response = crudService.createItem('event', formData);
					response.then((res) => {
						if (res) {
							const response = crudService.createItem('eventstate', stateData);
							response.then((res) => {
								if (res) {
									setInfo();
									crudService.createItem('historyevent', historyData);
								}
							}).catch((error) => {
								console.error('Error en la solicitud', error);
								return;
							});

						}
					}).catch((error) => {
						console.error('Error en la solicitud', error);
						return;
					});

					toast.success('¡Evento Añadido con Exito!');
					onGetFullEvents();
					resetStateData();
					refresh();
				}
			}
		}

		resetFormData();
		setSubEvent(false);
		onFinishForm();
	};


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

	const getDate = () => {
		const date = new Date();

		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();
		let hour = date.getHours();
		let minutes = date.getMinutes();


		let fullDate = `${day}/${month}/${year}`;
		let fullHour = `${hour}:${minutes < 10 ? '0' + minutes : minutes}`;


		setStateData({
			...stateData,
			hour_state: fullHour,
			date_state: fullDate
		})

		setHistoryData({
			...historyData,
			hour_state: fullHour,
			date_state: fullDate
		})
	}


	const validateErrors = () => {

		let hasErrors = false;

		if (formData.general_name === '') {
			hasErrors = true;
		}

		if (formData.event_type === '') {
			hasErrors = true;
		}

		if (formData.place === '') {
			hasErrors = true;
		}

		return hasErrors;
	}

	const refresh = () => {
		setIsFormSubmitted(false);
		setIcon(false);
		onGetFullEvents();
	}


	const setInfo = () => {
		if (subEvent) {
			historyData.subeventstate_id = stateData.id_state;
		} else {
			historyData.eventstate_id = stateData.id_state;
		}
		historyData.type_state = stateData.type_state;
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
											<label htmlFor="event_type">Tipo de Evento</label>
											<select name="event_type" onChange={handleInputChange} value={formData.event_type}>
												<option value="" disabled>seleccionar</option>
												<option value="propio">Propio</option>
												<option value="copro">Co-Producción</option>
												<option value="canje">Canje</option>
												<option value="apoyo">Apoyo</option>
												<option value="alquiler">Alquiler</option>
											</select>
											{isFormSubmitted && formData.event_type === '' && (
												<div className="message-error">Este campo es obligatorio</div>
											)}

										</div>
										<div className="form-box">
											<label htmlFor="type_state">Estado</label>
											<select name="type_state" onChange={handleInputChange} value={stateData.type_state} {...(update ? { disabled: 'disabled' } : {})}>
												<option value="pre-reserva">Pre-reserva</option>
												<option value="confirmado">Confirmado</option>
												<option value="ejecutar">Listo para Ejecutar</option>
												<option value="cancelado">Cancelado</option>
												<option value="ejecucion">En Ejecución</option>
												<option value="terminado">Terminado</option>
											</select>
										</div>
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
										</div>
									</div>

									<div><span className='form-subtitle'>Fecha y Hora</span></div>
									<div className="row two-colums">
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="date_start">Inicio</label>
												<input type="date" name='date_start' onChange={handleInputChange} value={formData.date_start} />
											</div>
											<div className="form-box">
												<label htmlFor="date_finishing">Finalización</label>
												<input type="date" name='date_finishing' onChange={handleInputChange} value={formData.date_finishing} />
											</div>
										</div>
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="hour_start">Inicio</label>
												<input type="time" name='hour_start' onChange={handleInputChange} value={formData.hour_start} />
											</div>
											<div className="form-box">
												<label htmlFor="hour_finishing">Finalización</label>
												<input type="time" name='hour_finishing' onChange={handleInputChange} value={formData.hour_finishing} />
											</div>
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="place">Lugar</label>
											<select name="place" onChange={handleInputChange} value={formData.place}>
												<option value="" disabled>Seleccionar</option>
												<option value="sala">sala</option>
												<option value="cafe-teatro">Cafe Teatro</option>
												<option value="plazoleta">Plazoleta</option>
												<option value="aula-taller">Aula Taller</option>
												<option value="otros">Otros</option>
											</select>
											{isFormSubmitted && formData.place === '' && (
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
												<label htmlFor="mounting_finishig_hour">Hora Finalización</label>
												<input type="time" name='mounting_finishig_hour' onChange={handleInputChange} value={formData.mounting_finishing_hour} />
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