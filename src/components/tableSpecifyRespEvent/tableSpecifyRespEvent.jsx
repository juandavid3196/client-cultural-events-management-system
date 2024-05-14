import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileInput } from "../UserActions/FileInput";
import Tooltip from '@mui/material/Tooltip';

function TableSpecifyRespEvent({ eventId, incrementTablaKey }) {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8007/api/event-has-responsability/?event_id=${eventId}`
        );
        setEventData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del evento:", error);
      }
    };
    fetchEventData();
  }, [eventId]);

  return (
    <div className="custom-table bg-white">
      {eventData ? (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ position: "sticky", top: "0", backgroundColor: "white" }}>
            <tr>
              <th className="text-black">Responsabilidad</th>
              <th className="text-black capitalize">Fecha de creación</th>
              <th className="capitalize text-black">Fecha de entrega</th>
              <th className="capitalize text-black">Estado</th>
              <th className="capitalize text-black">Acciones de cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((event) => (
              <tr key={event.id}>
                <td className="capitalize text-gray-500" style={{ overflow: 'visible' }}>
                  {event.specific_responsability_id ? (
                    <Tooltip title={event.specific_responsability_name} arrow>
                      <div>
                        {event.specific_responsability_name}
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip title={event.responsability_by_mode_name} arrow>
                      <div>
                      {event.responsability_by_mode_name}
                      </div>
                      
                    </Tooltip>
                  )}
                </td>

                <td className="capitalize text-gray-500 text-center">
                  {new Date(
                    event.accomplishment_creation_date
                  ).toLocaleDateString()}
                </td>

                <td className="capitalize text-gray-500 text-center">
                  {event.accomplishment_compliment_date
                    ? new Date(
                      event.accomplishment_compliment_date
                    ).toLocaleDateString()
                    : ""}
                </td>

                <td
                  className="capitalize text-white text-center font-semibold"
                  style={{
                    backgroundColor: event.accomplishment_status
                      ? "#00ff00"
                      : "#ff0000",
                  }}
                >
                  {event.accomplishment_status ? "Entregado" : "Pendiente"}
                </td>

                <td className="flex flex-row justify-center">
                  <FileInput idEspecifyResponsability={event.accomplishment_id} eventId={eventId} incrementTablaKey={incrementTablaKey} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="capitalize text-gray-400">Cargando datos del evento...</p>
      )}
    </div>
  );
}

export default TableSpecifyRespEvent;
