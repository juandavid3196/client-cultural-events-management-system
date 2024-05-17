import React, { createContext, useContext, useState } from 'react';
import crudService from '../services/crudService';

const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

export function AppContextProvider({ children }) {

    const [subEvent, setSubEvent] = useState(false);
    const [id, setId] = useState('');
    const [openState, setOpenState] = useState(false);
    const [updateState, setUpdateState] = useState(false);
    const [modalities, setModalities] = useState('');
    const [spaces, setSpaces] = useState('');
    const [unicState, setUnicState] = useState('');


    const typeModalityFilter = async (event_type) => {
        const data = await crudService.fetchItems('contractual-modes')
        data.map((element) => {
            if (element.id === event_type) {
                setModalities(element.name);
            }
        })

        return modalities;
    }

    const typeStateFilter = async (state_type) => {
        const data = await crudService.fetchItems('states');
        data.map((element) => {
            if (element.id === state_type) {
                setUnicState(element.name);
            }
        })
    }

    const typePlaceFilter = async (place_type) => {
        const data = await crudService.fetchItems('spaces');
        data.map((element) => {
            if (element.id === place_type) {
                setSpaces(element.name);
            }
        })
        return spaces;
    }

    function checkPermission(userRoles, requiredPermission) {

        for (let role of userRoles) {

            if (role.permissions && role.permissions.includes(requiredPermission)) {
                return true;
            }
        }
        return false;
    }

    return (
        <AppContext.Provider value={{
            subEvent, setSubEvent,
            id, setId,
            typeStateFilter, typeModalityFilter, checkPermission,
            typePlaceFilter, modalities, spaces, unicState,
            openState, setOpenState,
            updateState, setUpdateState

        }}>
            {children}
        </AppContext.Provider>
    );
}
