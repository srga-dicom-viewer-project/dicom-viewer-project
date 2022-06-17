import React, { Component } from 'react'
import { Nav, Navbar, Container } from "react-bootstrap"
import { setLoggedIn } from '../Login'
import FileUpload from './upload/FileUpload'
import CornerstoneViewer from './CornerstoneViewer'
import "./Viewer.css"

class Viewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: {}
        };
    }

    setFile = (providedFile) => {
        this.setState({
            file: providedFile
        });
    }

    getFile = () => {
        return this.state.file
    }

    isFile = () => {
        return Object.keys(this.getFile()).length > 0
    }

    render() {
        return (
            <>
                <header>
                    <Navbar bg="dark" variant="dark" sticky="top" className="flex-md-nowrap p-0 shadow">
                        <Container>
                            <Navbar.Brand className="px-3 fs-6" href="#">DICOM Viewer</Navbar.Brand>
                            <Navbar.Toggle className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon" />
                            </Navbar.Toggle>
                            <Nav>
                                <Nav.Link className="text-nowrap px-3 justify-content-end" href="/login" onClick={() => setLoggedIn(false)}>Sign out</Nav.Link>
                            </Nav>
                        </Container>
                    </Navbar>
                </header>

                <main>
                    {(this.isFile() ? <CornerstoneViewer getFile={this.getFile} /> : <FileUpload setFile={this.setFile} />)}
                </main>
            </>
        )
    }
}

export default Viewer