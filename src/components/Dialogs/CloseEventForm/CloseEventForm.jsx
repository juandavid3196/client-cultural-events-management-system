import React, { useState } from "react";
import "./CloseEventForm.scss";

const CloseEventForm = () => {
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    totalAttendees: "",
    uploadDocuments: [],
    considerAddingDocuments: false,
    initiatedOnTime: "",
    finalizedOnTime: "",
    palcosAndCourtesy: [],
    uploadedFiles: [],
    cashLiquidation: "",
    accessCertificate: "",
    situationsWithOrganizer: "",
    situationsWithPublic: "",
    situationsWithAmbulance: "",
    situationsWithEntities: "",
    situationsWithLogistics: "",
    acomodadoresArqueo: [],
    boleteriaLiquidacion: [],
    accessCertificate: [],
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      uploadedFiles: uploadedFiles.map((file) => file.name),
    }));
  };
  const handlePalcosFilesUpload = (event) => {
    const palcosAndCourtesy = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      palcosAndCourtesy: palcosAndCourtesy.map((file) => file.name),
    }));
  };

  const handleAcomodadoresArqueoUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      acomodadoresArqueo: uploadedFiles.map((file) => file.name),
    }));
  };

  const handleBoleteriaLiquidacionUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      boleteriaLiquidacion: uploadedFiles.map((file) => file.name),
    }));
  };

  const handleAccessCertificateUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      accessCertificate: uploadedFiles.map((file) => file.name),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data submitted:", formData);
    // Submit data to server or perform any other actions here
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section event-section">
        <span className="section-title">Cierre de Evento</span>
        <div className="row">
          <div className="form-box">
            <label htmlFor="eventName">Nombre del Evento:</label>
            <input
              type="text"
              name="eventName"
              id="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Ingrese el nombre del evento"
            />
          </div>

          <div className="form-box">
            <label htmlFor="totalAttendees">Total de asistentes:</label>
            <input
              type="number"
              name="totalAttendees"
              id="totalAttendees"
              value={formData.totalAttendees}
              onChange={handleChange}
              placeholder="Ingrese el número total de asistentes"
            />
          </div>

          <div className="row two-colums">
            <div className="form-box">
              <label htmlFor="initiatedOnTime">Inició a tiempo:</label>
              <select
                name="initiatedOnTime"
                id="initiatedOnTime"
                value={formData.initiatedOnTime}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>

            <div className="form-box">
              <label htmlFor="finalizedOnTime">Finalizó a tiempo:</label>
              <select
                name="finalizedOnTime"
                id="finalizedOnTime"
                value={formData.finalizedOnTime}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>

          <div className="row two-colums">
            <div className="form-box">
              <label htmlFor="palcosAndCourtesy">Palcos y cortesías:</label>
              <input
                type="file"
                name="palcosAndCourtesy"
                id="palcosAndCourtesy"
                multiple
                onChange={handlePalcosFilesUpload}
                placeholder="Ingrese la información de palcos y cortesías"
              />
              {formData.palcosAndCourtesy.length > 0 && (
                <ul>
                  {formData.palcosAndCourtesy.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-box">
              <label htmlFor="acomodadoresArqueo">
                Arqueo de acomodadores:
              </label>
              <input
                type="file"
                name="acomodadoresArqueo"
                id="acomodadoresArqueo"
                multiple
                onChange={handleAcomodadoresArqueoUpload}
              />
              {formData.acomodadoresArqueo.length > 0 && (
                <ul>
                  {formData.acomodadoresArqueo.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="row two-colums">
            <div className="form-box">
              <label htmlFor="boleteriaLiquidacion">
                Liquidación de boletería:
              </label>
              <input
                type="file"
                name="boleteriaLiquidacion"
                id="boleteriaLiquidacion"
                multiple
                onChange={handleBoleteriaLiquidacionUpload}
              />
              {formData.boleteriaLiquidacion.length > 0 && (
                <ul>
                  {formData.boleteriaLiquidacion.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-box">
              <label htmlFor="accessCertificate">Certificado de accesos:</label>
              <input
                type="file"
                name="accessCertificate"
                id="accessCertificate"
                multiple
                onChange={handleAccessCertificateUpload}
              />
              {formData.accessCertificate.length > 0 && (
                <ul>
                  {formData.accessCertificate.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-box">
            <label htmlFor="situationsWithOrganizer">
              Situaciones con el organizador:
            </label>
            <input
              type="text"
              name="situationsWithOrganizer"
              id="situationsWithOrganizer"
              value={formData.situationsWithOrganizer}
              onChange={handleChange}
              placeholder="Ingrese las situaciones con el organizador"
            />
          </div>

          <div className="form-box">
            <label htmlFor="situationsWithPublic">
              Situaciones con el público:
            </label>
            <input
              type="text"
              name="situationsWithPublic"
              id="situationsWithPublic"
              value={formData.situationsWithPublic}
              onChange={handleChange}
              placeholder="Ingrese las situaciones con el público"
            />
          </div>

          <div className="form-box">
            <label htmlFor="situationsWithAmbulance">
              Situaciones con la ambulancia / APH:
            </label>
            <input
              type="text"
              name="situationsWithAmbulance"
              id="situationsWithAmbulance"
              value={formData.situationsWithAmbulance}
              onChange={handleChange}
              placeholder="Ingrese las situaciones con la ambulancia"
            />
          </div>

          <div className="form-box">
            <label htmlFor="situationsWithEntities">
              Situaciones con entidades de control (Inspecciones) :
            </label>
            <input
              type="text"
              name="situationsWithEntities"
              id="situationsWithEntities"
              value={formData.situationsWithEntities}
              onChange={handleChange}
              placeholder="Ingrese las situaciones con entidades"
            />
          </div>

          <div className="form-box">
            <label htmlFor="situationsWithLogistics">
              Situaciones con logísticas (Cambios a ultima hora):
            </label>
            <input
              type="text"
              name="situationsWithLogistics"
              id="situationsWithLogistics"
              value={formData.situationsWithLogistics}
              onChange={handleChange}
              placeholder="Ingrese las situaciones con logística"
            />
          </div>
          <div className="row">
            <div className="form-box form-box-btn">
              <button type="submit" className="btn-send-form" >
                {" "}
                {update ? "Editar" : "Guardar"}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CloseEventForm;
