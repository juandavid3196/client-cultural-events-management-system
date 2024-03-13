import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileUploadPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();
  const [buttonLabel, setButtonLabel] = useState('Guardar');

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles([...uploadedFiles, ...fileArray]);
    }
  };

  const handleButtonAction = () => {
    if (buttonLabel === 'Guardar') {
      // Perform save actions here
      setButtonLabel('Cumplido');
      // Redirect after saving
      navigate('/');
    } else if (buttonLabel === 'Cumplido') {
      // Perform completion actions here
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Subir archivos</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleButtonAction}>{buttonLabel}</button>
    </div>
  );
};

export default FileUploadPage;
