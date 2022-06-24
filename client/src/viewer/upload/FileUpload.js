import React, { createRef, useState } from 'react';
import { Alert, Button, Card, Form, ProgressBar } from "react-bootstrap";
import { BoxArrowUp } from 'react-bootstrap-icons';
import Dropzone from "react-dropzone";
import axios from 'axios';
import "./FileUpload.css";

const FileUpload = ({ setFiles }) => {
  const [localFiles, setLocalFiles] = useState([]);              // The local files to be uploaded
  const [uploadFiles, setUploadFiles] = useState(new Map());     // The upload files map with the keys being the file name and the value being the upload progress
  const [uploadedFiles, setUploadedFiles] = useState(new Map()); // The uploaded files map with the keys being the file name and the value being the URL
  const [alert, setAlert] = useState({});                        // An alert to be displayed
  const [hover, setHover] = useState(false);
  const [format, setFormat] = useState(true);

  const dropzoneRef = createRef();

  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open()
    }
  };

  const hasSelectedFiles = () => {
    return localFiles.length;
  }

  const isUploadingFiles = () => {
    return uploadFiles.size;
  }

  const onChange = event => {
    if (event.target.files) {
      setLocalFiles(event.target.files);
      console.log(event.target.files)
    }
  };

  const getFileSelectRows = () => {
    return [...localFiles].map((file, index) => {
      return (
        <tr key={index} style={{ paddingBottom: '10px' }}>
          <td>
            {file.name}
          </td>
        </tr>
      )
    })
  }

  const getFileUploadRows = () => {
    return [...uploadFiles.entries()].map(([name, progress], index) => {
      return (
        <tr key={index} style={{ paddingBottom: '10px' }}>
          <td>
            {name}
            <ProgressBar variant={progress >= 100 ? "success" : "primary"} now={progress} label={`${progress}%`} />
          </td>
        </tr>
      )
    })
  }

  const getFileList = () => {
    let list
    if (isUploadingFiles()) {
      list = getFileUploadRows()
    } else if (hasSelectedFiles()) {
      list = getFileSelectRows()
    }

    return <table align="center"><tbody>{list}</tbody></table>
  }

  const onSubmit = async event => {
    event.preventDefault();

    // This just adds all the files to the upload files map and adds a progress of 0
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
        setAlert({
          variant: 'error',
          message: ((error.response.status === 500) ? 'There was a problem with the server!' : error.response.data.msg)
        });
      }
    }

    setFiles(uploadedFiles);
  };

  return (
    <>
      {/* This basically checks if the keys of alert is empty */}
      {/* If it is empty, that means that the alert has not been set yet and no alert will show */}
      {Object.keys(alert).length > 0 && (<Alert className="upload-alert" variant={alert.variant}>{alert.message}</Alert>)}

      <Form onSubmit={onSubmit}>
        <Card bg='dark' text='white' className="mb-2 upload-card">
          <Card.Header className="h2">Upload DICOMs</Card.Header>
          <Card.Body className="upload-card-body">
            {!hasSelectedFiles() ? (
              <Dropzone
                accept={{
                  '*/dicom': ['.dcm'],
                  'image/dcm': [],
                  '*/dcm': ['.dicom']
                }}
                ref={dropzoneRef}
                className="upload-card-body-dropzone"
                multiple={true}
                onDrop={acceptedFiles => { setLocalFiles(acceptedFiles); setHover(false) }}
                onDropRejected={() => { setFormat(false); setHover(false) }}
                onDragEnter={(event) => { setHover(true) }}
                onDragLeave={(event) => { setHover(false) }}>
                {({ getRootProps, getInputProps }) => (
                  <div className={"upload-card-body-dropzone" + (hover ? " hover" : "")} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <span className="upload-card-body-dropzone-icon">
                      <BoxArrowUp size='5em' />
                    </span>
                    <Card.Subtitle className="mb-2 text-muted">Drag and drop DICOM files to upload</Card.Subtitle>
                    {!format && <Card.Subtitle className="text-danger">Invalid file format, you must use DICOM files.</Card.Subtitle>}
                  </div>
                )}
              </Dropzone>
            ) : getFileList()}
          </Card.Body>
          <Card.Footer>
            {!hasSelectedFiles() ? (
              <Button variant="secondary" onClick={openDialog} autoFocus>Select Files</Button>
            ) : (
              <Button className="btn-block" variant="primary" type="submit" autoFocus>Upload</Button>
            )}
          </Card.Footer>
        </Card>
      </Form>
    </>
  );
};

export default FileUpload;