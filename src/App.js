import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Events from './components/events/Events';
import LeftAside from './components/leftaside/LeftAside';
import { AppContextProvider } from './contexts/AppContext';
import './App.css';
import ReportPage from './pages/ReportPage';
import NotFoundPage from './pages/NotFoundPage';
import EventosEnEspera from './pages/eventosEnEspera';
import Responsibility from './pages/responsabily_compliance';
import Home from './pages/TablaPermisos'
import Schedule from './components/schedule/Schedule';
import StatesManager from './components/statesManager/StatesManager';
import PlacesManager from './components/placesManager/PlacesManager';
import ModalityManager from './components/modalityManager/ModalityManager';
import LoginPage from './pages/LoginPage';
import ResponsabilitiesManager from './components/responsabilitiesManager/ResponsabilitiesManager';


const App = () => {
	// Ejemplo de estado de autenticación
	return (
		<AppContextProvider>
			<Router>
				<AppContent />
				<div className='super-container'>
					<LeftAside />
					<Routes>
						<Route path="/" element={<Events />} />
						<Route path="/reports" element={<ReportPage />} />
						<Route path="/tablapermisos" element={<Home />} />
						<Route path="/eventosEspera" element={<EventosEnEspera />} />
						<Route path="/responsabilidades" element={<Responsibility />} />
						<Route path="/calendar" element={<Schedule />} />
						<Route path="/states" element={<StatesManager />} />
						<Route path="/places" element={<PlacesManager />} />
						<Route path="/modalities" element={<ModalityManager />} />
						<Route path="/responsabilities" element={<ResponsabilitiesManager />} />
						<Route path="*" element={<NotFoundPage />} />

					</Routes>
				</div>
			</Router>
		</AppContextProvider>
	);
}

const AppContent = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const isLoginPage = location.pathname === '/login';

	useEffect(() => {
		verifyAuthentication();
	}, [])

	const verifyAuthentication = () => {
		if (!isAuthenticated && !isLoginPage) {
			navigate('/login', { replace: true });
			return null;
		}
	}

	return (
		<div className='super-container'>
			{!isLoginPage && <LeftAside />}

			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<Events />} />
				<Route path="/reports" element={<ReportPage />} />
				<Route path="/tablapermisos" element={<Home />} />
				<Route path="/eventosEspera" element={<EventosEnEspera />} />
				<Route path="/responsabilidades" element={<Responsibility />} />
				<Route path="/calendar" element={<Schedule />} />
				<Route path="/states" element={<StatesManager />} />
				<Route path="/places" element={<PlacesManager />} />
				<Route path="/modalities" element={<ModalityManager />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</div>
	);
}

export default App;
