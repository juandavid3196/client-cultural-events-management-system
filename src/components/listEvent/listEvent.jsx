import React, { useState, useEffect } from "react";
import axios from "axios";
import TableSpecifyRespEvent from "../tableSpecifyRespEvent/tableSpecifyRespEvent";
import Select from "react-select";
import "./listEvent.scss";

const ListEvent = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [contractualMode, setContractualMode] = useState("");
  const [eventSpace, setEventSpace] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8007/api/events/?skip=0&limit=0")
      .then((response) => {
        setEventos(
          response.data.map((evento) => ({
            value: evento.id,
            label: evento.general_name,
            contractualModeId: evento.event_type_id,
            eventSpaceId: evento.place_id,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener los eventos:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      axios
        .get(
          `http://localhost:8007/api/contractual-modes/${selectedEvent.contractualModeId}`
        )
        .then((response) => {
          setContractualMode(response.data.name);
        })
        .catch((error) => {
          console.error("Error al obtener la modalidad contractual:", error);
        });

      axios
        .get(`http://localhost:8007/api/spaces/${selectedEvent.eventSpaceId}`)
        .then((response) => {
          setEventSpace(response.data.name);
        })
        .catch((error) => {
          console.error("Error al obtener el espacio del evento:", error);
        });
    }
  }, [selectedEvent]);

  const handleSelectChange = (selectedOption) => {
    setSelectedEvent(selectedOption);
  };

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className="listEvent-container">
      <div className="section-title">
        <h3>Cumplimiento de responsabilidades</h3>
      </div>
      <div className="listEvents-container">
        <div className="list-top">
          <h4><strong>Lista de Eventos</strong></h4>
          <div className="input-box">
            <div className="input-box-relative">
              <Select
                options={eventos}
                value={selectedEvent}
                onChange={handleSelectChange}
                placeholder="Buscar evento"
                isSearchable
                styles={customStyles}
              />
            </div>
          </div>
        </div>
        <div className="table-style px-5" style={{ overflowY: "auto" }}>
          <div className="list-top-info">
            <h4><strong>Modalidad contractual:</strong> {contractualMode}</h4>
          </div>
          <div className="list-top-info">
            <h4><strong>Espacio del evento:</strong> {eventSpace}</h4>
          </div>

          {selectedEvent && (
            <TableSpecifyRespEvent eventId={selectedEvent.value} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListEvent;
