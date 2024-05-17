import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdUpload, MdModeEditOutline, MdDownload, MdCancel, MdEditDocument } from 'react-icons/md';
import { DeliverablesDialog } from '../Dialogs/DeliverableResponsability/DeliverablesDialog';
import Tooltip from '@mui/material/Tooltip';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

const FileInput = ({ idEspecifyResponsability, eventId, incrementTablaKey, idByMode }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [statusAcomplishments, setStatusAcomplishments] = useState(false);
  const [nameFile, setNameFile] = useState("");
  const [idResp, setIdResp] = useState("");

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
    const fetchIdResp = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8007/api/responsability-by-mode/${idByMode}`
        );


        if (response.data.responsability_id) {
          setIdResp(response.data.responsability_id)
        }
      } catch (error) {
        console.error("Error al obtener el id de la responsabilidad:", error);
      }
    };
    fetchIdResp();
  }, [idByMode]);



  const handleProgileDialogClick = () => {
    setEdit(false)
    setDialogOpen(true);
  };

  const handleEditClick = () => {
    setEdit(true)
    setDialogOpen(true);
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
      // Load the document template from a URL
      const template= await axios.get(
        `http://localhost:8007/api/bucket/download-file/template/1/espacioPublico.docx`, {
        responseType: 'blob',
      }
      );
      const templateData = await template.data.arrayBuffer();

      const zip = new PizZip(templateData);
      const doc = new Docxtemplater(zip);

      // Data to fill the document
      const data = {
        contenido: 'Official show of Clown PLIM PLIM on August 27, 2023 from 4:00 pm',
        asunto: 'Event of August 27, 2023',
        estado: 'Official show of Clown PLIM PLIM on August 27, 2023 from 4:00 pm',
        finalizacion: 'Event of August 27, 2023',
        iniciacion: 'Official show of Clown PLIM PLIM on August 27, 2023 from 4:00 pm',
        terminacion: 'Event of August 27, 2023',
      };

      // Fill the template with data
      doc.setData(data);
      doc.render();

      // Generate the final document
      const generatedDoc = doc.getZip().generate({ type: 'blob' });

      // Download the document
      saveAs(generatedDoc, 'documento_generado.docx');
    } catch (error) {
      console.error('Error generating the document:', error);
    }
  };

  return (


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

      <DeliverablesDialog open={dialogOpen} setDialogOpen={setDialogOpen} eventId={eventId} idEspecifyResponsability={idEspecifyResponsability} edit={edit} incrementTablaKey={incrementTablaKey} />
    </div>
  );
};

export { FileInput };
