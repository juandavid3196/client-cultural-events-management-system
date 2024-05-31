import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdUpload, MdModeEditOutline, MdDownload, MdCancel, MdEditDocument } from 'react-icons/md';
import { DeliverablesDialog } from '../Dialogs/DeliverableResponsability/DeliverablesDialog';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

const FileInput = ({ idEspecifyResponsability, eventId, incrementTablaKey, idByMode }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [statusAcomplishments, setStatusAcomplishments] = useState(false);
  const [nameFile, setNameFile] = useState("");
  const [idResp, setIdResp] = useState("");
  const [nameResp, setNameResp] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openObservationForm, setOpenObservationForm] = useState(false);
  const [close, setClose] = useState(false);


  const [formData, setFormData] = useState({
    user_email: "test@test.com",
    general_name: "",
    specific_name: "",
    date_start: "10/20/2024",
    date_finishing: "10/20/2024",
    hour_start: "",
    hour_finishing: "",
    user_name: "",
    phone: "",
    identification_type: "",
    identification_value: "",
    email: "user@example.com",
    description: "",
    observation: "",
    duration: "",
    mounting_date: "",
    mounting_start_hour: "",
    mounting_finishing_hour: "",
    technic_contact: "",
    rider: "",
    min_to_min: "",
    communication_contact: "",
    pulep: "",
    access_data: "",
    ticket_company: "",
    age_restriction: "",
    agreement: ""
  }
  );
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8007/api/accomplishments/${idEspecifyResponsability}`
        );


        if (response.data.check) {
          setStatusAcomplishments(true)
          setNameFile(response.data.file_url)
        }
      } catch (error) {
        console.error("Error al obtener los datos de la responsabilidad:", error);
      }
    };
    fetchEventData();
  }, [idEspecifyResponsability]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8007/api/events/${eventId}`
        );


        if (response) {
          const eventData = response.data;

          setFormData(prevState => ({
            ...prevState,
            general_name: eventData.general_name || "",
            specific_name: eventData.specific_name || "",
            date_start: eventData.date_start || "",
            date_finishing: eventData.date_finishing || "",
            hour_start: eventData.hour_start || "",
            hour_finishing: eventData.hour_finishing || "",
            user_name: eventData.user_name || "",
            phone: eventData.phone || "",
            identification_type: eventData.identification_type || "CC",
            identification_value: eventData.identification_value || "",
            email: eventData.email || "",
            description: eventData.description || "",
            observation: eventData.observation || "",
            duration: eventData.duration || "",
            mounting_date: eventData.mounting_date || "",
            mounting_start_hour: eventData.mounting_start_hour || "",
            mounting_finishing_hour: eventData.mounting_finishing_hour || "",
            technic_contact: eventData.technic_contact || "",
            rider: eventData.rider || null,
            min_tomin: eventData.min_tomin || null,
            communication_contact: eventData.communication_contact || "",
            pulep: eventData.pulep || "",
            access_data: eventData.access_data || "",
            ticket_company: eventData.ticket_company || "",
            age_restriction: eventData.age_restriction || "",
            agreement: eventData.agreement || ""
          }));
        }
      } catch (error) {
        console.error("Error al obtener los datos del evento:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchIdResp = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8007/api/responsability-by-mode/${idByMode}`
        );

        if (response.data.responsability_id) {
          setIdResp(response.data.responsability_id);

          try {
            const responseName = await axios.get(
              `http://localhost:8007/api/responsability/${idResp}`
            );
            setNameResp(responseName.data.name);

          } catch (error) {
            console.error("Error al obtener el nombre de la responsabilidad:", error);
          }
        }
      } catch (error) {
        console.error("Error al obtener el id de la responsabilidad:", error);
      }
    };
    fetchIdResp();
  }, [idByMode]);

  const handleClose = () => {
    setClose(true);
    setOpenObservationForm(false);
    setOpenForm(false);
  };

  const handleProgileDialogClick = () => {
    setOpenObservationForm(true);
    setOpenMenu(false);
    setClose(false);
  };

  const handleEditClick = () => {
    setEdit(true)
    setOpenObservationForm(true);
    setOpenMenu(false);
    setClose(false);
  }

  const cancelToAcomplishments = async () => {
    try {
      const confirmar = window.confirm("¿Estás seguro de cancelar esta entrega?");
      if (confirmar) {
        await axios.delete(
          `http://localhost:8007/api/bucket/delete-file/${nameFile}`
        );

        await axios.patch(
          `http://localhost:8007/api/accomplishments/${idEspecifyResponsability}/cancel`
        );

        incrementTablaKey();
      }
    } catch (error) {
      console.error("Error al borrar el archivo o cancelar el logro:", error);
    }
  };

  const downloadDocumentDeliverable = async () => {
    try {
      const documentDownload = await axios.get(
        `http://localhost:8007/api/bucket/download-file/${nameFile}`, {
        responseType: 'blob',
      }
      );

      const fileURL = window.URL.createObjectURL(new Blob([documentDownload.data]))
      const fileLink = document.createElement('a')
      fileLink.href = fileURL
      const urlParts = nameFile.split("/");
      const ultimoSegmento = urlParts[urlParts.length - 1];
      fileLink.setAttribute('download', ultimoSegmento)
      document.body.appendChild(fileLink)
      fileLink.click()

    } catch (error) {
      console.error("Error al obtener el archivo", error);
    }
  }

  const generateDocumentTemplate = async () => {

    try {
      // Obtener la URL del archivo de la responsabilidad
      const responseUrl = await axios.get(`http://localhost:8007/api/responsability/${idResp}`);
      if (responseUrl.status !== 200) {
        throw new Error('Error al obtener la URL:', responseUrl.statusText);
      }
      const responseData = responseUrl.data;
      if (!responseData.template_url) {
        toast.error("Esta responsabilidad no tiene ninguna plantilla asignada actualmente")
        return
      }

      // Almacenar la URL del archivo
      setFileUrl(responseData.template_url);

      //Nombre para el template descargado
      

      // Cargar la plantilla del documento desde la URL
      const templateResponse = await axios.get(`http://localhost:8007/api/bucket/download-file/${responseData.template_url}`, {
        responseType: 'blob',
      });
      const templateData = await templateResponse.data.arrayBuffer();

      // Crear el documento con la plantilla cargada
      const zip = new PizZip(templateData);
      const doc = new Docxtemplater(zip);

      // Datos para llenar el documento
      const data = {
        user_email: formData.user_email || "",
        general_name: formData.general_name || "",
        specific_name: formData.specific_name || "",
        date_start: formData.date_start || "10/20/2024",
        date_finishing: formData.date_finishing || "10/20/2024",
        hour_start: formData.hour_start || "",
        hour_finishing: formData.hour_finishing || "",
        user_name: formData.user_name || "",
        phone: formData.phone || "",
        identification_type: formData.identification_type || "",
        identification_value: formData.identification_value || "",
        email: formData.email || "user@example.com",
        description: formData.description || "",
        observation: formData.observation || "",
        duration: formData.duration || "",
        mounting_date: formData.mounting_date || "",
        mounting_start_hour: formData.mounting_start_hour || "",
        mounting_finishing_hour: formData.mounting_finishing_hour || "",
        technic_contact: formData.technic_contact || "",
        rider: formData.rider || "",
        min_to_min: formData.min_to_min || "",
        communication_contact: formData.communication_contact || "",
        pulep: formData.pulep || "",
        access_data: formData.access_data || "",
        ticket_company: formData.ticket_company || "",
        age_restriction: formData.age_restriction || "",
        agreement: formData.agreement || ""
      };

      // Llenar la plantilla con los datos
      doc.setData(data);
      doc.render();

      // Generar el documento final
      const generatedDoc = doc.getZip().generate({ type: 'blob' });

      // Descargar el documento
      saveAs(generatedDoc, `Plantilla llena de ${formData.general_name}.docx`);
    } catch (error) {
      console.error('Error generando el documento:', error);
    }
  };

  return (
    <>
    <div className="text-3xl flex gap-2">

      {!statusAcomplishments ?
        <Tooltip title="Realizar la entrega de una responsabilidad para su cumplimiento.">
          <div>
            <MdUpload
              className="text-gray-900 hover:text-green-600 hover:cursor-pointer"
              onClick={handleProgileDialogClick}
            />
          </div>
        </Tooltip>
        :
        <Tooltip title="Deshacer la entrega de una responsabilidad, esto implica borrar el documento entregado y sus observaciones.">
          <div>
            <MdCancel className="text-gray-900 hover:text-red-600 hover:cursor-pointer" onClick={cancelToAcomplishments} />
          </div>
        </Tooltip>
      }

      {statusAcomplishments && nameFile ?

        <Tooltip title="Descargar el archivo previamente entregado para cumplir con una responsabilidad.">
          <div>
            <MdDownload className="text-gray-900 hover:text-blue-500 hover:cursor-pointer" onClick={downloadDocumentDeliverable} />
          </div>
        </Tooltip>
        :
        ""
      }

      {statusAcomplishments ?

        <Tooltip title="Editar una entrega previa de una responsabilidad, sea su observación o su documento.">
          <div>
            <MdModeEditOutline className="text-gray-900 hover:text-yellow-500 hover:cursor-pointer" onClick={handleEditClick} />
          </div>
        </Tooltip>
        : ""
      }

      <Tooltip title="Descargar una plantilla previamente cargada y llena con alguna información del evento actualmente en revisión.">
        <div>
          <MdEditDocument className="text-gray-900 hover:text-gray-500 hover:cursor-pointer" onClick={generateDocumentTemplate} />
        </div>
      </Tooltip>

    </div>

    {openObservationForm && (
        <div className={`form-container ${close ? "close" : ""}`}>
          <div className={`form-main-box ${close ? "close" : ""}`}>
            <div className="form-title">
              <span>{nameResp}</span>
              <i
                className="fa-regular fa-circle-xmark"
                onClick={() => handleClose()}
              ></i>
            </div>
            <div className="main-form">
            <DeliverablesDialog eventId={eventId} idEspecifyResponsability={idEspecifyResponsability} edit={edit} incrementTablaKey={incrementTablaKey} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { FileInput };
