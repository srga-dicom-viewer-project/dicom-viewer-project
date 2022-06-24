import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Dropdown, Nav, Navbar, } from "react-bootstrap";
import { isLoggedIn, setLoggedIn } from '../login/Login';
import CornerstoneViewer from './cornerstone/CornerstoneViewer';
import FileUpload from './upload/FileUpload';
import "./Viewer.css";

class Viewer extends Component {
    constructor() {
        super();

        this.state = {
            files: new Map()
        };
    }

    setFiles = (uploadFiles) => {
        this.setState({
            files: uploadFiles
        });
    }

    getFiles = () => {
        return this.state.files
    }

    areFiles = () => {
        return this.getFiles().size > 0
    }

    signOut = () => {
        setLoggedIn(false)
        this.setFiles(new Map())
    }

    getFileElements = () => {
        return [...this.getFiles()].map(([fileName, fileURL], index) => {
            return (<Dropdown.Item key={index} onClick={() => this.select(fileURL)}>{fileName}</Dropdown.Item>)
        })
    }

    render() {
        return (
            <div className="d-flex wrapper">
                <div className="bg-dark text-white border-right sidebar-wrapper">
                    <div className="sidebar-heading">DICOM Viewer</div>
                    {this.areFiles() && (<>
                        <Dropdown show>
                            <Dropdown.Menu className="sidebar-dropdown" variant="dark" show>
                                {this.getFileElements()}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button className="sidebar-upload-button d-grid gap-1" variant="secondary" onClick={() => location.reload()}>Upload</Button>
                    </>)}
                </div>
                <div className="page-wrapper">
                    <Navbar variant="dark" bg="dark" expand="lg" className="justify-content-end">
                        <Nav className="ml-auto mt-2 mt-lg-0">
                            <Nav.Item className="active navbar-text">
                                <Nav.Link onClick={() => this.signOut()}>Sign out</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar>
                    <main>
                        {(this.areFiles() ? <CornerstoneViewer select={(selectRef) => { this.select = selectRef }} files={this.getFiles()} /> : <FileUpload setFiles={this.setFiles} />)}
                        {!isLoggedIn() && (<Navigate to="/login" />)}
                    </main>
                </div>
            </div>
        )
    }
}

export default Viewer