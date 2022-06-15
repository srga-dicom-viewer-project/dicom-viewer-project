import React, { useState } from 'react';
import { Alert, Button, Form, ProgressBar } from "react-bootstrap"
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');                        // The file that is selected to be uploaded
  const [uploadedFile, setUploadedFile] = useState({});        // The file that has been uploaded
  const [alert, setAlert] = useState({});                  // The message to return to the user
  const [uploadPercentage, setUploadPercentage] = useState(0); // The percentage of the upload
  const [uploading, setUploading] = useState(false)            // Whether a file is uploading

  const onChange = event => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const onSubmit = async event => {
    event.preventDefault();

    setUploading(true)

    const formData = new FormData();
    formData.append('file', file);

    try {
      // This might not work all the time
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
        }
      }).catch((error) => {
        setAlert({
          variant: 'danger',
          message: error.message
        });
      })

      setTimeout(() => setUploadPercentage(0), 10000);

      const { fileName, filePath } = res.data;

      // Puts the keys "fileName" and "filePath" into uploadedFile
      setUploadedFile({ fileName, filePath });

      setAlert({
        variant: 'success',
        message: 'File Uploaded'
      });

    } catch (error) {
      setAlert({
        variant: 'error',
        message: ((error.response.status === 500) ? 'There was a problem with the server' : error.response.data.msg)
      });
      console.error(error)

      setUploadPercentage(0)
    }
    setUploading(false)
  };

  return (
    <>
      {/* This basically checks if the keys of alert is empty */}
      {/* If it is empty, that means that the alert has not been set yet and no alert will show */}
      {Object.keys(alert).length > 0 && (<Alert variant={alert.variant}>{alert.message}</Alert>)}

      {!Object.keys(uploadedFile).length ? (
        <Form onSubmit={onSubmit}>
          <Form.Control type="file" className='custom-file mb-4 ' id='customFile' onChange={onChange} required />
          {uploading ?
            <ProgressBar now={uploadPercentage} label={`${uploadPercentage}%`} /> :
            <Button className="btn-block" variant="primary" type="submit">Upload</Button>
          }
        </Form>
      ) : (
        <h3 className='text-center'>{uploadedFile.fileName}</h3>
      )}
    </>
  );
};

export default FileUpload;