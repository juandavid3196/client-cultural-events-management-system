import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileInput } from '../UserActions/FileInput';

function TableSpecifyRespEvent({ eventId }) {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    // Función para obtener los datos del evento
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:8007/api/event-has-responsability/?event_id=${eventId}`);
        setEventData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del evento:', error);
      }
    };
    fetchEventData(); 
  }, [eventId]); 

  return (
    <div>
      {eventData ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Responsabilidad por Modo ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Accomplishment ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subir entregable</th>
            </tr>
          </thead>
          <tbody style={{ border: '1px solid #ddd' }}>
            {eventData.map(event => (
              <tr key={event.id} style={{ border: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.responsability_by_mode_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.accomplishment_id}</td>
                <td className='flex flex-row justify-center'>
                  <FileInput />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando datos del evento...</p>
      )}
    </div>
  );
}

export default TableSpecifyRespEvent;