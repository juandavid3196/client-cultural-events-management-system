import React, { useState, useEffect } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Checkbox, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, TextareaAutosize } from "@mui/material"
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { PropertiesPanel } from 'devextreme-react/cjs/diagram';


const DeliverablesDialog = ({ open, setDialogOpen, id, edit, incrementTablaKey}) => {
    const [observations, setObservations] = useState('');
    const [deliverables, setDeliverables] = useState([]);
    const [responsibilityCompleted, setResponsibilityCompleted] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (edit) {
            
            fetch(`http://localhost:8007/api/accomplishments/${id}`)
                .then(response => response.json())
                .then(data => {
                    // Actualizar el estado de observations con el valor obtenido
                    setObservations(data.text);
                })
                .catch(error => console.error('Error fetching data:', error));
        }

    }, [edit, id]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        /* if (!file) {
            console.error('No file selected');
            return;
        } */
       
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`http://localhost:8007/api/accomplishments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: observations
                })
            });
    
            if (response.ok) {
                console.log('Accomplishment updated successfully!');
                toast.success('¡Entregable Editado con Exito!');
                incrementTablaKey()
                setDialogOpen(false);
            } else {
                console.error('Failed to update accomplishment');
            }
        } catch (error) {
            console.error('Error updating accomplishment:', error);
        }
    
        /* try {
            const response = await fetch('http://localhost:8007/api/backend/upload-file/?event_id=1', {
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
        } */
    };
    return (
        <Dialog open={open}>

            <div className='px-4'>
                <DialogTitle className='font-bold'>
                    Observaciones
                    <AiFillCloseCircle style={{ float: 'right', cursor: 'pointer' }} onClick={() => setDialogOpen(false)} />
                </DialogTitle>
                <div className='flex flex-row justify-center'>
                    <TextareaAutosize
                        aria-label="Introducir observaciones"
                        minRows={8}
                        maxRows={15}
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        className='w-full p-2 bg-gray-100 border-2 border-gray-400'
                    />
                </div>
                <DialogTitle className='font-bold'>Subir entregables</DialogTitle>
                <DialogContent>
                    <input type="file" onChange={handleFileChange} />
                    <List>
                        {deliverables.map((file, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={file.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>

                <div className='flex flex-row justify-center'>
                    <DialogTitle className='font-bold'>Marcar responsabilidad como terminada</DialogTitle>
                    <Checkbox
                        checked={responsibilityCompleted}
                        onChange={() => setResponsibilityCompleted(!responsibilityCompleted)}
                    />
                </div>

                <button className='bg-blue-500 text-white border-2 rounded-md py-1 px-3' onClick={handleUpload}> Guardar</button>
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
        </Dialog>
    );
};

export { DeliverablesDialog };
