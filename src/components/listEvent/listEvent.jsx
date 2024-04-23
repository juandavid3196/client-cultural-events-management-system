import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableSpecifyRespEvent from '../tableSpecifyRespEvent/tableSpecifyRespEvent';
import Select from 'react-select';

const ListEvent = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8007/api/events/?skip=0&limit=0')
      .then(response => {
        setEventos(response.data.map(evento => ({
          value: evento.id,
          label: evento.general_name
        })));
      })
      .catch(error => {
        console.error('Error al obtener los eventos:', error);
      });
  }, []);

  const handleSelectChange = (selectedOption) => {
    setSelectedEvent(selectedOption);
  };

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      zIndex: 9999
    })
  };

  return (
    <div className='flex flex-row w-full justify-between px-8'>
      <div>
        <h2 className='font-semibold'>Lista de Eventos</h2>
        <Select
          options={eventos}
          value={selectedEvent}
          onChange={handleSelectChange}
          placeholder="Buscar evento..."
          isSearchable
          styles={customStyles}
        />
        {selectedEvent && <TableSpecifyRespEvent eventId={selectedEvent.value} />}
      </div>
    </div>
  );
};

export default ListEvent;
