import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventTable = ({ itemsPerPage }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [selectedEventType, setSelectedEventType] = useState('');
    const [selectedSpace, setSelectedSpace] = useState('');
    const [selectedSpecificName, setSelectedSpecificName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const eventSpaces = [
        { id: 1, name: 'Sala' },
        { id: 2, name: 'Cafe Teatro' },
        { id: 3, name: 'Plazoleta' },
        { id: 4, name: 'Aula Taller' },
        { id: 5, name: 'Otros' },
    ];

    useEffect(() => {
        axios.get('http://localhost:8007/api/events/?skip=2&limit=40')
            .then(response => {
                if (response.status === 200) {
                    setEvents(response.data);
                    const uniqueModalities = Array.from(new Set(response.data.map(event => event.eventType)));
                    setModalities(uniqueModalities);
                }
            })
            .catch(error => {
                console.error('Error al obtener datos de eventos:', error);
            });
    }, []);


    useEffect(() => {
        const filtered = events.filter(event => {
            const eventTypeMatch = !selectedEventType || event.eventType.toLowerCase().includes(selectedEventType.toLowerCase());
            const spaceMatch = !selectedSpace || event.place.toString() === selectedSpace;
            const specificNameMatch = !selectedSpecificName || event.specificName.toLowerCase().includes(selectedSpecificName.toLowerCase());
            return eventTypeMatch && spaceMatch && specificNameMatch;
        });

        setFilteredEvents(filtered);
        setCurrentPage(1);
    }, [events, selectedEventType, selectedSpace, selectedSpecificName]);

    const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='bg-white flex flex-col gap-4 p-6 max-h-full overflow-y-auto'>
            {/* Selectores y tabla aquí */}
            {/* Resto del código */}
        </div>
    );
};

export { EventTable };
