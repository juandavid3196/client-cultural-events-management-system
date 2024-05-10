import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdUpload, MdModeEditOutline, MdDownload } from 'react-icons/md';
import { DeliverablesDialog } from '../Dialogs/DeliverableResponsability/DeliverablesDialog';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

const FileInput = ({ idEspecifyResponsability, eventId, incrementTablaKey }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [statusAcomplishments, setStatusAcomplishments] = useState(false);
  const [nameFile, setNameFile] = useState("");
  const [statusFile, setStatusFile] = useState();


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
        console.error("Error al obtener los datos del evento:", error);
      }
    };
    fetchEventData();
  }, [idEspecifyResponsability]);

  const handleProgileDialogClick = () => {
    setEdit(false)
    setDialogOpen(true);
  };

  const handleEditClick = () => {
    setEdit(true)
    setDialogOpen(true);
  }


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
      fileLink.setAttribute('download', nameFile)
      document.body.appendChild(fileLink)
      fileLink.click()

    } catch (error) {
      console.error("Error al obtener el archivo", error);
    }
  }

  const generateDocumentTemplate = async () => {
    try {
      // Load the document template from a URL
      const response = await fetch('espacioPublico.docx');
      if (!response.ok) {
        throw new Error('Failed to load the document template.');
      }
      const templateData = await response.arrayBuffer();

      const zip = new PizZip(templateData);
      const doc = new Docxtemplater(zip);

      // Data to fill the document
      const data = {
        fecha: 'Medellin, 1 de agosto de 2024',
        contenido: 'Official show of Clown PLIM PLIM on August 27, 2023 from 4:00 pm',
        asunto: 'Event of August 27, 2023',
        id: idEspecifyResponsability // Aquí se pasa el ID como parte de los datos
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
      <MdUpload className="text-gray-900 hover:text-yellow-600 hover:cursor-pointer" onClick={handleProgileDialogClick} />
      <MdModeEditOutline className="text-gray-900 hover:text-red-600 hover:cursor-pointer" onClick={handleEditClick} />

      {statusAcomplishments && nameFile
        ?
        <MdDownload className="text-gray-900 hover:text-green-600 hover:cursor-pointer" onClick={downloadDocumentDeliverable}/> : "" }

      <DeliverablesDialog open={dialogOpen} setDialogOpen={setDialogOpen} eventId={eventId} idEspecifyResponsability={idEspecifyResponsability} edit={edit} incrementTablaKey={incrementTablaKey} />
    </div>
  );
};

export { FileInput };
