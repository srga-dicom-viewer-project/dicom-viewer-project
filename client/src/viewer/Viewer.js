import React, { Component } from 'react';
import { Button, Card, ListGroup, Nav, Navbar } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, setLoggedIn } from '../login/Login';
import CornerstoneViewer from './cornerstone/CornerstoneViewer';
import LeadtoolsViewer from './leadtools/LeadtoolsViewer';
import FileUpload from './upload/FileUpload';
import './Viewer.css';

class Viewer extends Component {
    constructor() {
        super();

        this.state = {
            files: new Map(),
            activeFile: '',
            viewport: ''
        };
    }

    setViewport = (viewport) => {
        this.setState({
            viewport: viewport
        });
    }

    getViewport = () => {
        return this.state.viewport
    }

    setFiles = (uploadFiles) => {
        this.setState({
            files: uploadFiles
        })
    }

    getFiles = () => {
        return this.state.files
    }

    areFiles = () => {
        return this.getFiles().size > 0
    }

    setActiveFile = (activeFile) => {
        this.setState({
            activeFile: activeFile
        })
    }

    getActiveFile = () => {
        return this.state.activeFile
    }

    signOut = () => {
        setLoggedIn(false)
        this.setFiles(new Map())
    }

    getFileElements = () => {
        if (this.getViewport() == 'cornerstone') {
            return [...this.getFiles()].map(([fileName, fileURL], index) => {
                return <ListGroup.Item
                    className={'text-white sidebar-list-item' + ((fileURL.includes(this.getActiveFile())) ? ' sidebar-list-item-active' : '')}
                    bsPrefix='sidebar-list-item'
                    key={index}
                    action
                    onClick={() => this.select(fileURL)}>
                    {fileName}
                </ListGroup.Item>
            })
        } else {
            return [...this.getFiles()].map(([fileName, fileData], index) => {
                return <ListGroup.Item
                    className={'text-white sidebar-list-item' + ((this.getFiles().size > 1) && (fileData.url.includes(this.getActiveFile())) ? ' sidebar-list-item-active' : '')}
                    bsPrefix='sidebar-list-item'
                    key={index}
                    action
                    onClick={() => this.select(index)}>
                    {fileName}
                </ListGroup.Item>
            })
        }
    }

    render() {
        return (
            <div className='d-flex wrapper'>
                <div className='bg-dark text-white border-right sidebar-wrapper'>
                    <div className='sidebar-heading'>DICOM Viewer</div>
                    {this.areFiles() && (
                        <div className='sidebar-selector'>
                            <ListGroup className='sidebar-list'>
                                {this.getFileElements()}
                            </ListGroup>
                            <Button className='sidebar-upload-button' variant='secondary' onClick={() => location.reload()}>Go to Upload</Button>
                        </div>
                    )}
                </div>
                <div className='page-wrapper'>
                    <Navbar variant='dark' bg='dark' expand='lg' className='justify-content-end'>
                        <Nav className='ml-auto mt-2 mt-lg-0'>
                            <Nav.Item className='active navbar-text'>
                                <Nav.Link onClick={() => this.signOut()}>Sign out</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar>
                    <main>
                        {this.areFiles() ?
                            <Card bg='dark' className='viewer'>
                                {this.getViewport() == 'cornerstone' ?
                                    <CornerstoneViewer files={this.getFiles()} select={(selectRef) => this.select = selectRef} setActiveFile={this.setActiveFile} />
                                    :
                                    <LeadtoolsViewer files={this.getFiles()} select={(selectRef) => this.select = selectRef} setActiveFile={this.setActiveFile} />
                                }
                            </Card>
                            :
                            <FileUpload setFiles={this.setFiles} viewport={this.getViewport()} setViewport={this.setViewport} />
                        }
                    </main>
                </div>
                {!isLoggedIn() && (<Navigate to='/login' />)}
            </div>
        );
    }
}

export default Viewer