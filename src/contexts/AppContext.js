import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

export function AppContextProvider({ children }) {

    const [subEvent, setSubEvent] = useState(false);
    const [id, setId] = useState('');
    const [openState, setOpenState] = useState(false);
    const [updateState, setUpdateState] = useState(false);

    const typeModalityFilter = (event_type) => {
        switch (event_type) {
            case 1:
                return 'Alquiler';
            case 2:
                return 'Propio';
            case 3:
                return 'Poryecto';
            case 4:
                return 'Coproducción';
            case 5:
                return 'Apoyo';
            case 6:
                return 'Canje';
            default:
                return event_type;
        }
    }

    const typeStateFilter = (state_type) => {
        switch (state_type) {
            case 1:
                return 'Pre-Reserva';
            case 2:
                return 'Confirmado';
            case 3:
                return 'Listo para Ejecutar';
            case 4:
                return 'Cancelado';
            case 5:
                return 'En Ejecución';
            case 6:
                return 'Terminado';
            default:
                return state_type;
        }
    }

    const typePlaceFilter = (place_type) => {
        switch (place_type) {
            case 1:
                return 'Sala';
            case 2:
                return 'Cafe-Teatro';
            case 3:
                return 'Plazoleta';
            case 4:
                return 'Aula-Taller';
            case 5:
                return 'Otros';
            default:
                return place_type;
        }
    }

    const colorState = (state_type) => {
        switch (state_type) {
            case 1:
                return '#56caff';
            case 2:
                return '#4646ff';
            case 3:
                return '#ffd167';
            case 4:
                return '#f66969';
            case 5:
                return '#56ff56';
            case 6:
                return '#cbcaca';
            default:
                return 'white';
        }
    }

    return (
        <AppContext.Provider value={{
            subEvent, setSubEvent,
            id, setId,
            typeStateFilter, typeModalityFilter,
            typePlaceFilter, colorState,
            openState, setOpenState,
            updateState, setUpdateState

        }}>
            {children}
        </AppContext.Provider>
    );
}
