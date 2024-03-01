import React from 'react';
import { EventTable } from '../components/Eventos/EventTable';

const EventosEnEspera = () => {
  const itemsPerPage = 5;

  return (
    <div className='text-2xl h-screen w-full flex justify-center bg-main'>
      <div className="text-center w-full max-w-screen-lg">
        <h1 className="text-4xl font-bold mb-2 py-2">Eventos</h1>
        <EventTable itemsPerPage={itemsPerPage} />
      </div>
    </div>
  );
};

export default EventosEnEspera;
