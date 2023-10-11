import React, { useState } from 'react';
import '../EventForm/EventForm.scss';


const EventForm = ({ onCloseForm }) => {

	const [section, setSection] = useState('administrativa');
	const [close, setClose] = useState(false);

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
						<span className='eyeslashes-box' onClick={() => setSection('administrativa')}>Administrativa</span>
						<span className='eyeslashes-box' onClick={() => setSection('produccion')}>Producción</span>
						<span className='eyeslashes-box' onClick={() => setSection('tecnica')}>Tecnica</span>
						<span className='eyeslashes-box' onClick={() => setSection('comunicaciones')}>Comunicaciones</span>
					</div>
					<form action="">

						{
							section === 'administrativa' && (
								<div className='form-section'>
									<span className='section-title'>Datos del Evento</span>
									<div className="row">
										<div className="form-box">
											<label htmlFor="name">Nombre</label>
											<input type="text" name='name' placeholder='Nombre' />
										</div>
									</div>

									<div><span className='form-subtitle'>Fecha y Hora</span></div>
									<div className="row two-colums">
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="date-start">Inicio</label>
												<input type="date" name='date-start' placeholder='dd/mm/yy' />
											</div>
											<div className="form-box">
												<label htmlFor="date-finishing">Finalización</label>
												<input type="date" name='date-finishing' placeholder='dd/mm/yy' />
											</div>
										</div>
										<div className="row two-colums-small">
											<div className="form-box">
												<label htmlFor="hour-start">Inicio</label>
												<input type="time" name='hour-start' placeholder='00:00' />
											</div>
											<div className="form-box">
												<label htmlFor="hour-finishing">Finalización</label>
												<input type="time" name='hour-finishing' placeholder='00:00' />
											</div>
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="place">Lugar</label>
											<select name="place">
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
							section === 'produccion' && (
								<div className="form-section">
									<span className='section-title'>Datos del Solicitante</span>
									<div className="row">
										<div className="form-box">
											<label htmlFor="user-name">Nombre</label>
											<input type="text" name='user-name' placeholder='Name' />
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="phone">Celular</label>
											<input type="text" name='phone' placeholder='Celular' />
										</div>
										<div className="form-box">
											<label htmlFor="identification">Identificación</label>
											<input type="text" name='identification' placeholder='C.C, RUT, NIT' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="email">Email</label>
											<input type="email" name='email' placeholder='Correo Electronico' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="description">Descripción</label>
											<input type="text" name='description' placeholder='Breve descripción del evento' />
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
											<input type="number" name='duration' placeholder='0 Horas' />
										</div>
										<div className="form-box">
											<label htmlFor="mounting-date">Fecha Montaje</label>
											<input type="date" name='mounting-date' placeholder='dd/mm/yy' />
										</div>
										<div className="form-box">
											<label htmlFor="mounting-hour">Hora Montaje</label>
											<input type="time" name='mounting-hour' placeholder='00:00' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="technic-contact">Contacto montaje tecnico</label>
											<input type="text" name='technic-contact' placeholder='Nombre' />
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
											<label htmlFor="communication-contact">Contacto comunicaciones</label>
											<input type="text" name='communication-contact' placeholder='Artista, Manager, Comunicador' />
										</div>
									</div>
									<div className="row two-colums">
										<div className="form-box">
											<label htmlFor="pulep">PULEP</label>
											<select name="pulep">
												<option value="True">Aplica</option>
												<option value="False">No Aplica</option>
											</select>
										</div>
										<div className="form-box">
											<label htmlFor="access-data">Información de ingreso</label>
											<input type="text" name='access-data' placeholder='Modalida, Costo, Cuenta bancaria' />
										</div>
									</div>
									<div className="row">
										<div className="form-box">
											<label htmlFor="ticket-company">Empresa de boleteria</label>
											<input type="text" name='ticket-company' placeholder='Nombre Empresa' />
										</div>
										<div className="form-box">
											<label htmlFor="age-restriction">Restriccion de edad</label>
											<select name="age-restriction">
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