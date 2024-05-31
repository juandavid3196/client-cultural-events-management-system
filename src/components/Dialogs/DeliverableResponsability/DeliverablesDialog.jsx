import React, { useState, useEffect } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Checkbox, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, TextareaAutosize } from "@mui/material"
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { PropertiesPanel } from 'devextreme-react/cjs/diagram';


const DeliverablesDialog = ({ setDialogOpen, idEspecifyResponsability, edit, incrementTablaKey, respName }) => {
    const [update, setUpdate] = useState(false);
    const [observations, setObservations] = useState('');
    const [deliverables, setDeliverables] = useState([]);
    const [responsibilityCompleted, setResponsibilityCompleted] = useState(false);
    const [file, setFile] = useState(null);

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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSelectChange = (event) => {
        const value = event.target.value;
        const completed = value === "SI" ? true : false;
        setResponsibilityCompleted(completed);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleUpload()
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-section event-section">
                <span className="section-title font-bold">Entrega de responsabilidad {respName}</span>
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
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            placeholder="Ingrese las observaciones"
                        />

                        <div className="form-box">
                            <label htmlFor="initiatedOnTime">Desea terminar la responsabilidad sin un archivo?</label>
                            <select
                                name="notFile"
                                id="notFile"
                                value={responsibilityCompleted ? "SI" : "NO"}
                                onChange={handleSelectChange }
                            >
                                <option value="" disabled>
                                    Seleccionar
                                </option>
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>

                        <label htmlFor="suportedDocument">Documento soporte del entregable:</label>
                        <input
                            type="file"
                            name="suportedDocument"
                            id="suportedDocument"
                            onChange={handleFileChange}
                            placeholder="Suba el documento soporte"
                        />
                        <List>
                            {deliverables.map((file, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={file.name} />
                                </ListItem>
                            ))}
                        </List>

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
