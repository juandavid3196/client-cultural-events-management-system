import React, { useState } from "react";
import "./CloseEventForm.scss";

const CloseEventForm = ({ eventId }) => {
  const [update, setUpdate] = useState(false);

  const [formData, setFormData] = useState({
    totalAttendees: "",
    initiatedOnTime: "",
    finalizedOnTime: "",
    filesAcomodadoresArqueo: [],
    filesBoleteriaLiquidacion: [],
    filesAccessCertificate: [],
    filesPalcosAndCourtesy: [],
    situationsWithOrganizer: "",
    situationsWithPublic: "",
    situationsWithAmbulance: "",
    situationsWithEntitiesControl: "",
    situationsWithLogistics: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePalcosFilesUpload = (event) => {
    const palcosAndCourtesy = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      filesPalcosAndCourtesy: palcosAndCourtesy
    }));
  };

  const handleAcomodadoresArqueoUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      filesAcomodadoresArqueo: uploadedFiles
    }));
  };

  const handleBoleteriaLiquidacionUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      filesBoleteriaLiquidacion: uploadedFiles
    }));
  };

  const handleAccessCertificateUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      filesAccessCertificate: uploadedFiles
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
        <span className="section-title font-bold">Cierre del evento</span>
        <div className="row">

          <div className="row two-colums">

            <div className="form-box">
              <label htmlFor="totalAttendees">Total de asistentes:</label>
              <input
                type="number"
                name="totalAttendees"
                id="totalAttendees"
                value={formData.totalAttendees}
                onChange={handleChange}
                required
                placeholder="Ingrese el número de asistentes"
              />
            </div>

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
              {formData.filesPalcosAndCourtesy && formData.filesPalcosAndCourtesy.length > 0 && (
                <ul>
                  {formData.filesPalcosAndCourtesy.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-box">
              <label htmlFor="acomodadoresArqueo">Arqueo de acomodadores:</label>
              <input
                type="file"
                name="acomodadoresArqueo"
                id="acomodadoresArqueo"
                multiple
                onChange={handleAcomodadoresArqueoUpload}
              />
              {formData.filesAcomodadoresArqueo && formData.filesAcomodadoresArqueo.length > 0 && (
                <ul>
                  {formData.filesAcomodadoresArqueo.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="row two-colums">
            <div className="form-box">
              <label htmlFor="boleteriaLiquidacion">Liquidación de boletería:</label>
              <input
                type="file"
                name="boleteriaLiquidacion"
                id="boleteriaLiquidacion"
                multiple
                onChange={handleBoleteriaLiquidacionUpload}
              />
              {formData.filesBoleteriaLiquidacion && formData.filesBoleteriaLiquidacion.length > 0 && (
                <ul>
                  {formData.filesBoleteriaLiquidacion.map((file, index) => (
                    <li key={index}>{file.name}</li>
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
              {formData.filesAccessCertificate && formData.filesAccessCertificate.length > 0 && (
                <ul>
                  {formData.filesAccessCertificate.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-box">
            <label htmlFor="situationsWithOrganizer">
              Situaciones con el organizador:
            </label>
            <textarea
              type="text"
              name="situationsWithOrganizer"
              cols="30" rows="4"
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
            <textarea
              type="text"
              name="situationsWithPublic"
              cols="30" rows="4"
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
            <textarea
              type="text"
              name="situationsWithAmbulance"
              cols="30" rows="4"
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
            <textarea
              type="text"
              name="situationsWithEntities"
              cols="30" rows="4"
              id="situationsWithEntities"
              value={formData.situationsWithEntitiesControl}
              onChange={handleChange}
              placeholder="Ingrese las situaciones con entidades"
            />
          </div>

          <div className="form-box">
            <label htmlFor="situationsWithLogistics">
              Situaciones con logísticas (Cambios a ultima hora):
            </label>
            <textarea
              type="text"
              name="situationsWithLogistics"
              cols="30" rows="4"
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
