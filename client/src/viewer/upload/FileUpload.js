import React, { useState } from 'react';
import { Alert, Button, Form } from "react-bootstrap"
import axios from 'axios';
import UploadProgress from './UploadProgress';

const FileUpload = ({ setFiles }) => {
  const [localFiles, setLocalFiles] = useState([]);              // The local files to be uploaded
  const [uploadFiles, setUploadFiles] = useState(new Map());     // The upload files map with the keys being the file name and the value being the upload progress
  const [uploadedFiles, setUploadedFiles] = useState(new Map()); // The uploaded files map with the keys being the file name and the value being the URL
  const [alert, setAlert] = useState({});                        // An alert to be displayed
  const onChange = event => {
    if (event.target.files) {
      setLocalFiles(event.target.files);
    }
  };

  const onSubmit = async event => {
    event.preventDefault();

    setUploadFiles(new Map(Array.from(localFiles).map(file => { return [file.name, 0]; })));

    for (let file of localFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(`${process.env.REACT_APP_API_CONNECTION_STRING}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: progressEvent => {
            setUploadFiles(prev => new Map([...prev, [file.name, parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))]]));
          }
        }).catch((error) => {
          setAlert({
            variant: 'danger',
            message: error.message
          });
        })

        setUploadFiles(prev => new Map([...prev, [res.data.fileName, 100]]));
        uploadedFiles.set(res.data.fileName, `wadouri:${res.data.fileURL}`);

      } catch (error) {
        console.error(error)

        setAlert({
          variant: 'error',
          message: ((error.response.status === 500) ? 'There was a problem with the server' : error.response.data.msg)
        });
      }
    }

    setFiles(uploadedFiles);
  };

  return (
    <>
      {/* This basically checks if the keys of alert is empty */}
      {/* If it is empty, that means that the alert has not been set yet and no alert will show */}
      {Object.keys(alert).length > 0 && (<Alert variant={alert.variant}>{alert.message}</Alert>)}

      {!uploadFiles.size ? (
        <Form onSubmit={onSubmit}>
          <Form.Control type="file" className='custom-file mb-4 ' id='files' accept='application/dicom, .dcm' onChange={onChange} required multiple />
          <Button className="btn-block" variant="primary" type="submit">Upload</Button>
        </Form>
      ) : (
        <UploadProgress uploadFiles={uploadFiles} />
      )}
    </>
  );
};

export default FileUpload;