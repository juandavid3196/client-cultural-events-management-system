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

    const typeEventFilter = (event_type) => {
        switch (event_type) {
            case 'propio':
                return 'Propio';
            case 'copro':
                return 'Co-Producción';
            case 'canje':
                return 'Canje';
            case 'apoyo':
                return 'Apoyo';
            case 'alquiler':
                return 'Alquiler';
            default:
                return event_type;
        }
    }

    const typeStateFilter = (state_type) => {
        switch (state_type) {
            case 'pre-reserva':
                return 'Pre-Reserva';
            case 'confirmado':
                return 'Confirmado';
            case 'ejecutar':
                return 'Listo para Ejecutar';
            case 'cancelado':
                return 'Cancelado';
            case 'ejecucion':
                return 'En Ejecución';
            case 'terminado':
                return 'Terminado';
            default:
                return state_type;
        }
    }

    const typePlaceFilter = (place_type) => {
        switch (place_type) {
            case 'sala':
                return 'Sala';
            case 'cafe-teatro':
                return 'Cafe-Teatro';
            case 'plazoleta':
                return 'Plazoleta';
            case 'aula-taller':
                return 'Aula-Taller';
            case 'otros':
                return 'Otros';
            default:
                return place_type;
        }
    }

    const colorState = (state_type) => {
        switch (state_type) {
            case 'pre-reserva':
                return '#56caff';
            case 'confirmado':
                return '#4646ff';
            case 'ejecutar':
                return '#ffd167';
            case 'cancelado':
                return '#f66969';
            case 'ejecucion':
                return '#56ff56';
            case 'terminado':
                return '#cbcaca';
            default:
                return 'white';
        }
    }

    return (
        <AppContext.Provider value={{
            subEvent, setSubEvent,
            id, setId,
            typeEventFilter, typeStateFilter,
            typePlaceFilter, colorState,
            openState, setOpenState,
            updateState, setUpdateState

        }}>
            {children}
        </AppContext.Provider>
    );
}
