import React, { useState } from 'react';
import '../EventForm/EventForm.scss';


const EventForm = ({ onCloseForm }) => {

	const [section, setSection] = useState('evento');
	const [close, setClose] = useState(false);

	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		eventType: '',
		state: '',
		generalName: '',
		specificName: '',
		dateStart: '',
		dateFinishing: '',
		hourStart: '',
		hourFinishing: '',
		place: '',
		userName: '',
		phone: '',
		identification: '',
		email: '',
		description: '',
		duration: '',
		mountingDate: '',
		mountingHour: '',
		technicContact: '',
		communicationContact: '',
		pulep: '',
		accessData: '',
		ticketCompany: '',
		ageRestriction: '',

	});

	const validateForm = () => {
		const newErrors = {};
		const regex = /^[0-9]+$/;
		if (regex.test(formData.phone)) {
			newErrors.phone = true;
		}
		if (parseInt(formData.duration) < 0) {
			newErrors.duration = true
		}
		return newErrors;
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		const newErrors = validateForm();
		setErrors(newErrors);

	};


	const handleClose = () => {
		setClose(true);
		setTimeout(() => {
			onCloseForm();
		}, 500)
	}

	return (
		<div className={`form-container ${close ? 'close' : ''}`}>
			<div className={`form-main-box ${close ? 'close' : ''}`}>
				<div className='form-title'>
					<span>Añadir Evento</span>
					<i class="fa-regular fa-circle-xmark" onClick={handleClose}></i>
				</div>
				<div className='main-form'>
					<div className='form-eyeslashes'>
						<span className={`eyeslashes-box ${section === 'evento' ? 'selected' : ''}`} onClick={() => setSection('evento')}>Evento</span>
						<span className={`eyeslashes-box ${section === 'cliente' ? 'selected' : ''}`} onClick={() => setSection('cliente')}>Cliente</span>
						<span className={`eyeslashes-box ${section === 'tecnica' ? 'selected' : ''}`} onClick={() => setSection('tecnica')}>Tecnica</span>
						<span className={`eyeslashes-box ${section === 'comunicaciones' ? 'selected' : ''}`} onClick={() => setSection('comunicaciones')}>Comunicaciones</span>
					</div>
					<form action="">

						{
							section === 'evento' && (
								<div className='form-section'>
									<span className='section-title'>Datos del Evento</span>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="eventType">Tipo de Evento</label>
											<select name="eventType" onChange={handleInputChange} value={formData.eventType}>
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
											<input type="text" name='generalName' onChange={handleInputChange} value={formData.generalName} placeholder='Nombre General' />
										</div>
										<div className="form-box">
											<label htmlFor="specificName">Nombre Especifico</label>
											<input type="text" name='specificName' onChange={handleInputChange} value={formData.specificName} placeholder='Nombre Especifico' />
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
									<div className="row">
										<div className="form-box">
											<label htmlFor="place">Lugar</label>
											<select name="place" onChange={handleInputChange} value={formData.place}>
												<option value="sala">sala</option>
												<option value="cafe-teatro">Cafe Teatro</option>
												<option value="plazoleta">Plazoleta</option>
												<option value="aula-taller">Aula Taller</option>
												<option value="otros">Otros</option>
											</select>
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
											<input type="text" name='userName' onChange={handleInputChange} value={formData.userName} placeholder='Name' />
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="phone">Celular</label>
											<input type="text" name='phone' onChange={handleInputChange} value={formData.phone} placeholder='Celular' />
											{!errors.phone && formData.phone != '' && (<span className='error-message'>Este campo solo permite numeros <i class="fa-solid fa-circle-xmark"></i></span>)}
										</div>
										<div className="form-box">
											<label htmlFor="identification">Identificación</label>
											<input type="text" name='identification' onChange={handleInputChange} value={formData.identification} placeholder='C.C, RUT, NIT' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="email">Email</label>
											<input type="email" name='email' onChange={handleInputChange} value={formData.email} placeholder='Correo Electronico' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="description">Descripción</label>
											<input type="text" name='description' onChange={handleInputChange} value={formData.description} placeholder='Breve descripción del evento' />
										</div>
									</div>
								</div>
							)
						}
						{
							section === 'tecnica' && (
								<div className="form-section">
									<span className='section-title'>Datos Tecnicos</span>
									<div className="row three-colums">
										<div className="form-box">
											<label htmlFor="duration">Duracion</label>
											<input type="number" name='duration' onChange={handleInputChange} value={formData.duration} placeholder='0 Horas' />
											{errors.duration && formData.duration != '' && (<span className='error-message'>El valor debe ser mayor a 0<i class="fa-solid fa-circle-xmark"></i></span>)}
										</div>
										<div className="form-box">
											<label htmlFor="mountingDate">Fecha Montaje</label>
											<input type="date" name='mountingDate' onChange={handleInputChange} value={formData.mountingDate} placeholder='dd/mm/yy' />
										</div>
										<div className="form-box">
											<label htmlFor="mountingHour">Hora Montaje</label>
											<input type="time" name='mountingHour' onChange={handleInputChange} value={formData.mountingHour} placeholder='00:00' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="technicContact">Contacto montaje tecnico</label>
											<input type="text" name='technicContact' onChange={handleInputChange} value={formData.technicContact} placeholder='Nombre' />
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
											<select name="pulep" onChange={handleInputChange} value={formData.pulep}>
												<option value="True">Aplica</option>
												<option value="False">No Aplica</option>
											</select>
										</div>
										<div className="form-box">
											<label htmlFor="accessData">Información de ingreso</label>
											<input type="text" name='accessData' onChange={handleInputChange} value={formData.accessData} placeholder='Modalida, Costo, Cuenta bancaria' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="ticketCompany">Empresa de boleteria</label>
											<input type="text" name='ticketCompany' onChange={handleInputChange} value={formData.ticketCompany} placeholder='Nombre Empresa' />
										</div>
										<div className="form-box">
											<label htmlFor="ageRestriction">Restriccion de edad</label>
											<select name="ageRestriction" onChange={handleInputChange} value={formData.ageRestriction}>
												<option value="NA" selected>No Aplica</option>
												<option value="10" >10</option>
												<option value="11" >11</option>
												<option value="12" >12</option>
												<option value="13" >13</option>
												<option value="14" >14</option>
												<option value="15" >15</option>
												<option value="16" >16</option>
												<option value="17" >17</option>
												<option value="18" >18</option>
											</select>
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