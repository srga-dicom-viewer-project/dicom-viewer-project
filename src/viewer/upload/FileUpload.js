import React, { useState } from 'react';
import { Alert, Button, Form, ProgressBar } from "react-bootstrap"
import axios from 'axios';

function UploadAlert(message) {
  var msg = message.message
  if (msg === "File Uploaded") {
    return (
      <Alert variant="success">
        {msg}
      </Alert>
    );
  } else {
    return (
      <Alert variant="danger">
        {msg}
      </Alert>
    );
  }
}

const FileUpload = () => {
  const [file, setFile] = useState('');                        // The file that is selected to be uploaded
  const [uploadedFile, setUploadedFile] = useState({});        // The file that has been uploaded
  const [message, setMessage] = useState("");                  // The message to return to the user
  const [uploadPercentage, setUploadPercentage] = useState(0); // The percentage of the upload
  const [uploading, setUploading] = useState(false)            // Whether a file is uploading

  const onChange = event => {
    setFile(event.target.files[0]);
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
      });

      setTimeout(() => setUploadPercentage(0), 10000);

      const { fileName, filePath } = res.data;

      // Puts the keys "fileName" and "filePath" into uploadedFile
      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (error) {
      if (error.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(error.response.data.msg);
      }
      setUploadPercentage(0)
    }
    setUploading(false)
  };

  return (
    <>
      {message ? <UploadAlert message={message} /> : null}

      {/* This basically checks if the keys of uploadedFile is empty */}
      {/* If it is empty, that means that the file has not been uploaded yet */}
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