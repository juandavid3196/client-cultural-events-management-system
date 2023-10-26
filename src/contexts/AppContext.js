import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

export function AppContextProvider({ children }) {

    const [subEvent, setSubEvent] = useState(false);
    const [id, setId] = useState('');

    return (
        <AppContext.Provider value={{ subEvent, setSubEvent, id, setId }}>
            {children}
        </AppContext.Provider>
    );
}
