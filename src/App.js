import React from 'react'
import Events from './components/events/Events'
import { AppContextProvider } from './contexts/AppContext';

const App = () => {
	return (
		<AppContextProvider>
			<div>
				<Events />
			</div>
		</AppContextProvider>
	)
}

export default App