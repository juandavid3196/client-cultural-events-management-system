import React, { useEffect, useState } from 'react';
import '../EventForm/EventForm.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EventForm = ({ onCloseForm, onFinishForm, updateItem, update, onUpdateState }) => {

	const uuid = require('uuid');
	const [section, setSection] = useState('evento');
	const [close, setClose] = useState(false);
	const [duration, setDuration] = useState('');
	const [formData, setFormData] = useState({

		id: uuid.v4(),
		eventType: 'defected',
		state: 'pre-reserva',
		dateState: '',
		generalName: '',
		specificName: '',
		dateStart: '',
		dateFinishing: '',
		hourStart: '',
		hourFinishing: '',
		place: 'defected',
		userName: '',
		phone: '',
		identificationType: 'CC',
		identificationValue: '',
		email: '',
		description: '',
		observation: '',
		duration: duration,
		mountingDate: '',
		mountingStartHour: '',
		mountingFinishingHour: '',
		technicContact: '',
		rider: null,
		minTomin: null,
		communicationContact: '',
		pulep: '',
		accessData: '',
		ticketCompany: '',
		ageRestriction: '',
		agreement: '',

	});

	useEffect(() => {
		getDate();
	}, []);


	useEffect(() => {
		calculateDuration();
		console.log(formData);
	}, [formData]);


	useEffect(() => {
		if (update) setFormData(updateItem);
	}, [update, updateItem])


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
	}

	const resetFormData = () => {
		const keys = Object.keys(formData);
		const emptyFormData = {};

		keys.forEach((key) => {
			emptyFormData[key] = '';
		});

		setFormData(emptyFormData);
	};


	const handleForm = (e) => {
		e.preventDefault();

		if (update) {
			updateData(formData.id, formData);
			toast.success('¡Evento Editado con Exito!');
			onUpdateState();
		} else {
			postData(formData);
			toast.success('¡Evento Añadido con Exito!');
		}
		resetFormData();
		onFinishForm();
	}

	const postData = (newItem) => {
		axios.post('http://localhost:5000/programming', newItem)
			.then(response => {
				console.log('Nuevo elemento creado:', response.data);
			})
			.catch(error => {
				console.error('Error al crear el elemento:', error);
			});
	}

	const updateData = (id, item) => {
		axios.put(`http://localhost:5000/programming/${id}`, item)
			.then(response => {
				console.log('Elemento actualizado');
			})
			.catch(error => {
				console.error('Error al actualizar el elemento:', error);
			});

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
		let hours = 0;
		let totalHours = 0;
		let minutes = 0;
		const StartHour = parseInt(`${formData.mountingStartHour[0]}${formData.mountingStartHour[1]}`);
		const StartMinutes = parseInt(`${formData.mountingStartHour[3]}${formData.mountingStartHour[4]}`);
		const finishingHour = parseInt(`${formData.mountingFinishingHour[0]}${formData.mountingFinishingHour[1]}`);
		const finishingMinutes = parseInt(`${formData.mountingFinishingHour[3]}${formData.mountingFinishingHour[4]}`);


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

	const getDate = () => {
		const date = new Date();

		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();

		let fullDate = `${day}/${month}/${year}`;

		setFormData({
			...formData,
			dateState: fullDate,
		});
	}

	return (
		<div className={`form-container ${close ? 'close' : ''}`}>
			<div className={`form-main-box ${close ? 'close' : ''}`}>
				<div className='form-title'>
					<span>{update ? 'Editar Evento' : 'Añadir Evento'}</span>
					<i class="fa-regular fa-circle-xmark" onClick={handleClose}></i>
				</div>
				<div className='main-form'>
					<div className='form-eyeslashes'>
						<span className={`eyeslashes-box ${section === 'evento' ? 'selected' : ''}`} onClick={() => setSection('evento')}>Evento</span>
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
											<label htmlFor="eventType">Tipo de Evento</label>
											<select name="eventType" onChange={handleInputChange} value={formData.eventType}>
												<option value="defected">seleccionar</option>
												<option value="propio">Propio</option>
												<option value="copro">Co-Producción</option>
												<option value="canje">Canje</option>
												<option value="apoyo">Apoyo</option>
												<option value="alquiler">Alquiler</option>
											</select>
										</div>
										<div className="form-box">
											<label htmlFor="state">Estado</label>
											<select name="state" onChange={handleInputChange} value={formData.state}>
												<option value="confirmado">Confirmado</option>
												<option value="pre-reserva">Pre-reserva</option>
												<option value="cancelado">Cancelado</option>
											</select>
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="generalName">Nombre General</label>
											<input type="text" name='generalName' onChange={handleInputChange} value={formData.generalName} placeholder='Nombre General' required />
										</div>
										<div className="form-box">
											<label htmlFor="specificName">Nombre Especifico</label>
											<input type="text" name='specificName' disabled onChange={handleInputChange} value={formData.specificName} placeholder='Nombre Especifico' />
										</div>
									</div>

									<div><span className='form-subtitle'>Fecha y Hora</span></div>
									<div className="row two-colums">
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="dateStart">Inicio</label>
												<input type="date" name='dateStart' onChange={handleInputChange} value={formData.dateStart} placeholder='dd/mm/yy' />
											</div>
											<div className="form-box">
												<label htmlFor="dateFinishing">Finalización</label>
												<input type="date" name='dateFinishing' onChange={handleInputChange} value={formData.dateFinishing} placeholder='dd/mm/yy' />
											</div>
										</div>
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="hourStart">Inicio</label>
												<input type="time" name='hourStart' onChange={handleInputChange} value={formData.hourStart} placeholder='00:00' />
											</div>
											<div className="form-box">
												<label htmlFor="hourFinishing">Finalización</label>
												<input type="time" name='hourFinishing' onChange={handleInputChange} value={formData.hourFinishing} placeholder='00:00' />
											</div>
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="place">Lugar</label>
											<select name="place" onChange={handleInputChange} value={formData.place}>
												<option value="defected" selected>Seleccionar</option>
												<option value="sala">sala</option>
												<option value="cafe-teatro">Cafe Teatro</option>
												<option value="plazoleta">Plazoleta</option>
												<option value="aula-taller">Aula Taller</option>
												<option value="otros">Otros</option>
											</select>
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
											<label htmlFor="userName">Nombre</label>
											<input type="text" name='userName' onChange={handleInputChange} value={formData.userName} placeholder='Nombre' />
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="phone">Celular</label>
											<input type="text" name='phone' onChange={handleInputChange} value={formData.phone} placeholder='320890675 / 3108900823' />
										</div>
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="identificationType">Tipo de Identificación</label>
												<select name="identificationType" onChange={handleInputChange} value={formData.identificationType}>
													<option value="CC">Cedula</option>
													<option value="RUT" >RUT</option>
													<option value="NIT" >NIT</option>
												</select>
											</div>
											<div className="form-box">
												<label htmlFor="identificationValue">Numero de Indentificación</label>
												<input type="text" name='identificationValue' onChange={handleInputChange} value={formData.identificationValue} placeholder={identificationValue(formData.identificationType)} />
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
									<span className='section-title'>Datos Tecnicos</span>
									<div><span className='form-subtitle'>Fecha y Hora Montaje</span></div>
									<div className="row two-colums">
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="duration">Duración</label>
												<input type="text" name='duration' disabled onChange={handleInputChange} value={duration} min={0} max={24} placeholder='0' />
											</div>
											<div className="form-box">
												<label htmlFor="mountingDate">Fecha Montaje</label>
												<input type="date" name='mountingDate' onChange={handleInputChange} value={formData.mountingDate} placeholder='dd/mm/yy' />
											</div>
										</div>
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="mountingStartHour">Hora Inicio </label>
												<input type="time" name='mountingStartHour' onChange={handleInputChange} value={formData.mountingStartHour} placeholder='00:00' />
											</div>
											<div className="form-box">
												<label htmlFor="mountingFinishigHour">Hora Finalización</label>
												<input type="time" name='mountingFinishingHour' onChange={handleInputChange} value={formData.mountingFinishingHour} placeholder='00:00' />
											</div>
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="technicContact">Contacto Montaje Tecnico</label>
											<textarea name="technicContact" onChange={handleInputChange} value={formData.technicContact} placeholder='Nombre / Celular' cols="30" rows="5"></textarea>
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="rider">Rider</label>
											<input type="file" name='rider' onChange={handleInputChange} />
										</div>
										<div className="form-box">
											<label htmlFor="minTomin">Minuto a Minuto</label>
											<input type="file" name='minTomin' onChange={handleInputChange} />
										</div>
									</div>
								</div>
							)
						}
						{
							section === 'comunicaciones' && (
								<div className="form-section">
									<span className='section-title'>Datos Comunicaciones</span>
									<div className="row">
										<div className="form-box">
											<label htmlFor="communicationContact">Contacto comunicaciones</label>
											<input type="text" name='communicationContact' onChange={handleInputChange} value={formData.communicationContact} placeholder='Artista, Manager, Comunicador' />
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="pulep">PULEP</label>
											<input type="text" name='pulep' onChange={handleInputChange} value={formData.pulep} />
										</div>
										<div className="form-box">
											<label htmlFor="accessData">Información de ingreso</label>
											<input type="text" name='accessData' onChange={handleInputChange} value={formData.accessData} placeholder='Modalidad, Costo, Cuenta Bancaria' />
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="ticketCompany">Empresa de boleteria</label>
											<input type="text" name='ticketCompany' onChange={handleInputChange} value={formData.ticketCompany} placeholder='Nombre Empresa' />
										</div>
										<div className="form-box">
											<label htmlFor="ageRestriction">Restriccion de edad</label>
											<input type="text" name="ageRestriction" onChange={handleInputChange} value={formData.ageRestriction} />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="agreement">Convenio / Alianzas</label>
											<input type="text" name="agreement" onChange={handleInputChange} value={formData.agreement} />
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