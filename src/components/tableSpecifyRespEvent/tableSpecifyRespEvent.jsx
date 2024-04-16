import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileInput } from '../UserActions/FileInput';

function TableSpecifyRespEvent({ eventId }) {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
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
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Responsabilidad</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha de creación</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha de entrega</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Estado</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subir entregable</th>
            </tr>
          </thead>
          <tbody style={{ border: '1px solid #ddd' }}>
            {eventData.map(event => (
              <tr key={event.id} style={{ border: '1px solid #ddd' }}>

                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {event.specific_responsability_id ? event.specific_responsability_name : event.responsability_by_mode_name}
                </td>

                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  {new Date(event.accomplishment_creation_date).toLocaleDateString()}
                </td>

                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  {event.accomplishment_compliment_date ? new Date(event.accomplishment_compliment_date).toLocaleDateString() : ""}
                </td>

                <td style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  backgroundColor: event.accomplishment_status ? '#00ff00' : '#ff0000'
                }}>
                  {event.accomplishment_status ? 'Entregado' : 'Pendiente'}
                </td>

                <td className='flex flex-row justify-center'>
                  <FileInput id={event.accomplishment_id} />
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