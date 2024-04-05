import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableSpecifyRespEvent from '../tableSpecifyRespEvent/tableSpecifyRespEvent';


const ListEvent = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [idEvent, setIdEvent] = useState();

  //Pasar esto al funcionamiento de services
  useEffect(() => {
    axios.get('http://localhost:8007/api/events/?skip=0&limit=0')
      .then(response => {
        setEventos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los eventos:', error);
      });
  }, []);


  const handleSelectChange = (event) => {
    setSelectedEvent(event.target.value);
    setIdEvent(event.target.value)
  };

  return (
    <div className='flex flex-row w-full justify-between px-8'>
      <div>
        <h2 className='font-semibold'>Lista de Eventos</h2>
        <select value={selectedEvent} onChange={handleSelectChange}>
          <option value="">Selecciona un evento</option>
          {eventos.map((evento, index) => (
            <option key={index} value={evento.id}>{evento.general_name}</option>
          ))}
        </select>
        {selectedEvent && <TableSpecifyRespEvent eventId={idEvent} />}      </div>
    </div>
  );
};

export default ListEvent;