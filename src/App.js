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
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from './components/spinner/Spinner';


const App = () => {
	// Ejemplo de estado de autenticación
	return (
		<AppContextProvider>
			<Router>
				<AppContent />
			</Router>
		</AppContextProvider>
	);
}

const AppContent = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isLoginPage = location.pathname === '/login';

	const { isAuthenticated, isLoading } = useAuth0();


	useEffect(() => {
		verifyAuthentication();
	}, [isAuthenticated]);


	const verifyAuthentication = () => {
		if (isLoading) {
			return <Spinner />;
		}

		if (!isAuthenticated && !isLoginPage) {
			navigate('/login', { replace: true });
			return null;
		}

		return <Routes>
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
			<Route path="/responsabilities" element={<ResponsabilitiesManager />} />
		</Routes>;
	}

	return (
		<div className='super-container'>
			{!isLoginPage && <LeftAside />}
			{verifyAuthentication()}
		</div>
	);
}

export default App;
