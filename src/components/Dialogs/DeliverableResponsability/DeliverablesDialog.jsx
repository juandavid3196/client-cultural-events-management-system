import { AiFillCloseCircle } from 'react-icons/ai';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, TextareaAutosize } from "@mui/material"
import React, { useState } from 'react';

const DeliverablesDialog = ({ open, setDialogOpen, id }) => {
    const [observations, setObservations] = useState('');
    const [deliverables, setDeliverables] = useState([]);
    const [responsibilityCompleted, setResponsibilityCompleted] = useState(false);
    const [file, setFile] = useState(null);

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

            <div className='px-4 py-2'>
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

                <Button onClick={handleUpload}> Guardar</Button>
            </div>
        </Dialog>
    );
};

export { DeliverablesDialog };
