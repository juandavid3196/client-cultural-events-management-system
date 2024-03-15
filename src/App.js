import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
	return (
		<AppContextProvider>
			<Router>
				<div className='super-container'>
					<LeftAside />
					<Routes>
						<Route path="/" element={<Events />} />
						<Route path="/reports" element={<ReportPage />} />
						<Route path="/tablapermisos" element={<Home />} />
						<Route path="/eventosEspera" element={<EventosEnEspera />} />
						<Route path="/responsabilidades" element={<Responsibility />} />
						<Route path="/calendar" element={<Schedule />} />
						<Route path="*" element={<NotFoundPage />} />

					</Routes>
				</div>
			</Router>
		</AppContextProvider>
	);
}

export default App;
