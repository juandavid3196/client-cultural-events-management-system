import React from 'react'
import Events from './components/events/Events'
import LeftAside from './components/leftaside/LeftAside';
import { AppContextProvider } from './contexts/AppContext';
import './App.css';

const App = () => {
	return (
		<AppContextProvider>
			<div className='super-container'>
				<LeftAside />
				<Events />
			</div>
		</AppContextProvider>
	)
}

export default App