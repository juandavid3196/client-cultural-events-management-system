import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileInput } from "../UserActions/FileInput";
import { Center } from "devextreme-react/cjs/map";

function TableSpecifyRespEvent({ eventId}) {
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
              <th className="capitalize text-gray-400">Fecha de creación</th>
              <th className="capitalize text-gray-400">Fecha de entrega</th>
              <th className="capitalize text-gray-400">Estado</th>
              <th className="capitalize text-gray-400">Subir entregable</th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((event) => (
              <tr key={event.id}>
                <td className="capitalize text-gray-400">
                  {event.specific_responsability_id
                    ? event.specific_responsability_name
                    : event.responsability_by_mode_name}
                </td>

                <td className="capitalize text-gray-400 text-center">
                  {new Date(
                    event.accomplishment_creation_date
                  ).toLocaleDateString()}
                </td>

                <td className="capitalize text-gray-400 text-center">
                  {event.accomplishment_compliment_date
                    ? new Date(
                        event.accomplishment_compliment_date
                      ).toLocaleDateString()
                    : ""}
                </td>

                <td
                  className="capitalize text-gray-400 text-center font-semibold"
                  style={{
                    backgroundColor: event.accomplishment_status
                      ? "#00ff00"
                      : "#ff0000",
                  }}
                >
                  {event.accomplishment_status ? "Entregado" : "Pendiente"}
                </td>

                <td className="flex flex-row justify-center">
                  <FileInput id={event.accomplishment_id} />
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
