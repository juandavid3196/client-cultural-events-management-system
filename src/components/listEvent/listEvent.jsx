import React, { useState, useEffect } from "react";
import axios from "axios";
import TableSpecifyRespEvent from "../tableSpecifyRespEvent/tableSpecifyRespEvent";
import Select from "react-select";
import { toast, ToastContainer } from 'react-toastify';
import { DeliverablesDialog } from '../Dialogs/DeliverableResponsability/DeliverablesDialog';
import "./listEvent.scss";
import CloseEventForm from "../Dialogs/CloseEventForm/CloseEventForm";

const ListEvent = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [contractualMode, setContractualMode] = useState("");
  const [eventSpace, setEventSpace] = useState("");
  const [close, setClose] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [update, setUpdate] = useState(false);
  const [id, setId] = useState("");
  const [tablaKey, setTablaKey] = useState(0); // Nuevo estado para la clave de la tabla
  const [isClosedForm, setIsClosedForm] = useState(true);
  const [openCloseEventForm, setOpenCloseEventForm] = useState(false); // Nuevo estado para controlar la visibilidad del formulario de cierre de evento


  const incrementTablaKey = () => {
    setTablaKey(prevKey => prevKey + 1);
  };

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

  const saveResponsability = async () => {
    try {
      const response = await fetch(
        `http://localhost:8007/api/event-has-responsability/event/${selectedEvent.value}/specific-responsability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description }),
        }
      );

      if (response.ok) {
        console.log('El recurso fue creado exitosamente.');
        toast.success('¡Responsabilidad Añadida con Exito!');
        incrementTablaKey()
      } else {
        console.error(
          "Hubo un problema al crear el recurso:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Hubo un error al realizar la solicitud:", error.message);
    }
    setUpdate(false);
    handleClose();
  };

  const handleFormWindow = () => {
    setClose(false);
    setName("");
    setDescription("");
    setOpenForm(!openForm);
    setOpenMenu(false);
  };

  const handleClose = () => {
    setClose(true);
    setOpenCloseEventForm(false);
    setOpenForm(false);
    setUpdate(false);
    setId("");
    handleSelectChange(selectedEvent);
  };

  const handleForm = (e) => {
    e.preventDefault();
    saveResponsability();
  };

  const handleInputChangeName = (e) => {
    const { name, value } = e.target;
    setName(value);
  };

  const handleInputChangeDescription = (e) => {
    const { description, value } = e.target;
    setDescription(value);
  };

  const handleOpenCloseEventForm = () => {
    setOpenCloseEventForm(true);
    setOpenMenu(false);
    setClose(false);
  };

  return (
    <>
      <div className="listEvent-container">
        <div className="section-title">
          <h3>Cumplimiento de responsabilidades</h3>
        </div>
        <div className="listEvents-container">
          <div className="list-top ">
            <h4>
              <strong>Lista de Eventos</strong>
            </h4>
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
            <div className="list-top-info">
              <h4>
                <strong>Modalidad contractual:</strong> {contractualMode}
              </h4>
              <h4>
                <strong>Espacio del evento:</strong> {eventSpace}
              </h4>
            </div>
            <button
              className="btn-add-event"
              onClick={() => handleFormWindow()}
            >
              Añadir Responsabilidad Especifica
            </button>
            <button
              className="btn-add-event"
              onClick={() => handleOpenCloseEventForm()}
            >
              Cerrar Evento
            </button>
          </div>
          <div className="table-style px-5" style={{ overflowY: "auto" }}>
            {selectedEvent && (
              <TableSpecifyRespEvent key={tablaKey} eventId={selectedEvent.value} incrementTablaKey={incrementTablaKey}/>
            )}
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>

      {openCloseEventForm && (
        <div className={`form-container ${close ? "close" : ""}`}>
          <div className={`form-main-box ${close ? "close" : ""}`}>
            <div className="form-title">
              <span>Cierre de Evento</span>
              <i
                className="fa-regular fa-circle-xmark"
                onClick={() => handleClose()}
              ></i>
            </div>
            <div className="main-form">
              <CloseEventForm />
            </div>
          </div>
        </div>
      )}

      {openForm && (
        <div className={`form-container ${close ? "close" : ""}`}>
          <div className={`form-main-box ${close ? "close" : ""}`}>
            <div className="form-title">
              <span>
                {" "}
                {update
                  ? "Editar Responsabilidad"
                  : "Crear Responsabilidad"}{" "}
              </span>
              <i
                className="fa-regular fa-circle-xmark"
                onClick={() => handleClose()}
              ></i>
            </div>
            <div className="main-form">
              <form onSubmit={handleForm}>
                <div className="form-section event-section">
                  <span className="section-title">
                    Datos de la Responsabilidad Especifica
                  </span>
                  <div className="row">
                    <div className="form-box">
                      <label htmlFor="responsability_name">
                        Nombre de la responsabilidad Especifica
                      </label>
                      <input
                        type="text"
                        name="responsability_name"
                        onChange={handleInputChangeName}
                        value={name}
                        placeholder="Nombre de la responsabilidad"
                      />
                    </div>
                    <div className="form-box">
                      <label htmlFor="responsability_descriptión">
                        Descripción de la responsabilidad Especifica
                      </label>
                      <input
                        type="text"
                        name="responsability_descriptión"
                        onChange={handleInputChangeDescription}
                        value={description}
                        placeholder="Nombre de la responsabilidad"
                      />
                    </div>
                  </div>
                  <div className={`row ${update ? "two-colums" : ""}`}>
                    <div className="form-box form-box-btn">
                      <button type="submit" className="btn-send-form">
                        {" "}
                        {update ? "Editar" : "Guardar"}{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListEvent;
