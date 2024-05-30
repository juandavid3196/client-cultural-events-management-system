import React, { useState, useEffect } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Checkbox, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, TextareaAutosize } from "@mui/material"
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { PropertiesPanel } from 'devextreme-react/cjs/diagram';


const DeliverablesDialog = ({ open, setDialogOpen, idEspecifyResponsability, edit, eventId, incrementTablaKey }) => {
    const [update, setUpdate] = useState(false);
    const [observations, setObservations] = useState('');
    const [deliverables, setDeliverables] = useState([]);
    const [responsibilityCompleted, setResponsibilityCompleted] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        observations: "",
        filesObservations: []
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
        if (edit) {

            fetch(`http://localhost:8007/api/accomplishments/${idEspecifyResponsability}`)
                .then(response => response.json())
                .then(data => {
                    setObservations(data.text);
                })
                .catch(error => console.error('Error fetching data:', error));
        }

    }, [edit, idEspecifyResponsability]);

    const handleObservationsFilesUpload = (event) => {
        const palcosAndCourtesy = Array.from(event.target.files);
        setFormData((prevData) => ({
            ...prevData,
            filesPalcosAndCourtesy: palcosAndCourtesy
        }));
    };

    const handleUpload = async () => {
        if (!file && responsibilityCompleted === false) {
            console.error('No file selected');
            toast.error('No ha seleccionado ningún archivo, por favor seleccione uno o marque la casilla de responsabilidad como terminada')
            return;
        }

        if (!file && responsibilityCompleted === true) {
            try {
                const response = await fetch(`http://localhost:8007/api/accomplishments/${idEspecifyResponsability}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: observations
                    })
                });

                if (response.ok) {
                    toast.success('¡Entregable Editado con Exito!');
                    incrementTablaKey()
                    setDialogOpen(false);
                } else {
                    console.error('Failed to update accomplishment');
                }
            } catch (error) {
                console.error('Error updating accomplishment:', error);
            }
        }

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await fetch(`http://localhost:8007/api/accomplishments/${idEspecifyResponsability}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: observations,
                        file_url: `accomplishment/${idEspecifyResponsability}/${file.name}`
                    })
                });

                if (response.ok) {
                    toast.success('¡Entregable Editado con Exito!');
                    incrementTablaKey()
                    setDialogOpen(false);
                } else {
                    console.error('Failed to update accomplishment');
                }
            } catch (error) {
                console.error('Error updating accomplishment:', error);
            }

            try {
                const response = await fetch(`http://localhost:8007/api/accomplishments${idEspecifyResponsability}/updload-file`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('File uploaded successfully!');
                } else {
                    console.error('Failed to upload file');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Form data submitted:", formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-section event-section">
                <span className="section-title font-bold">Entrega de responsabilidad</span>
                <div className="row">

                    <div className="form-box">
                        <label htmlFor="observation">
                            Observaciones:
                        </label>
                        <textarea
                            type="text"
                            name="observation"
                            cols="30" rows="4"
                            id="observation"
                            value={formData.situationsWithOrganizer}
                            onChange={handleChange}
                            placeholder="Ingrese las observaciones"
                        />

                        <label htmlFor="suportedDocument">Documento soporte del entregable:</label>
                        <input
                            type="file"
                            name="suportedDocument"
                            id="suportedDocument"
                            multiple
                            onChange={handleObservationsFilesUpload}
                            placeholder="Suba el documento soporte"
                        />
                        {formData.filesObservations && formData.filesObservations.length > 0 && (
                            <ul>
                                {formData.filesObservations.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        )}
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

export { DeliverablesDialog };
