import React, { Component } from 'react'
import { Alert, Button, Card, Container, Form, Navbar } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import '../App.css'
import './Login.css'

// Sets loggedIn to true on the user's broswer
export const setLoggedIn = function (loggedIn) {
    sessionStorage.setItem('loggedIn', loggedIn)
}

// Checks to see if user has loggedIn set to true
export const isLoggedIn = function () {
    return sessionStorage.getItem('loggedIn') === 'true'
}

export class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            invalid: false
        };
    }

    handleEmailChanged = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handlePasswordChanged = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()

        if (this.state.email === process.env.REACT_APP_VALID_EMAIL && this.state.password === process.env.REACT_APP_VALID_PASSWORD) {
            setLoggedIn(true)

            // May seem unnecessary, but react won't re-render without this
            this.setState({
                invalid: false
            })
        } else {
            this.setState({
                invalid: true
            })
        }
    }

    render() {
        return (
            <>
                <Navbar variant='dark' bg='dark' expand='lg' className='justify-content-end'>
                    <Container fluid>
                        <Navbar.Brand href="#">DICOM Viewer</Navbar.Brand>
                    </Container>
                </Navbar>
                <main>
                    <Card bg='dark' className='text-center text-white'>
                        <Card.Header className='h2'>LOG IN</Card.Header>
                        <Card.Body className='form-login'>
                            <Form onSubmit={this.handleSubmit} className='text-dark'>
                                <Form.Floating>
                                    <Form.Control
                                        type='email'
                                        className='form-control'
                                        id='floatingInput'
                                        placeholder="Enter email"
                                        value={this.state.email}
                                        onChange={this.handleEmailChanged}
                                        autoFocus
                                        required />
                                    <Form.Label>Email</Form.Label>
                                </Form.Floating>

                                <Form.Floating>
                                    <Form.Control
                                        type='password'
                                        autoComplete='on'
                                        className='form-control'
                                        id='floatingPassword'
                                        placeholder="Enter password"
                                        value={this.state.password}
                                        onChange={this.handlePasswordChanged}
                                        required />
                                    <Form.Label>Password</Form.Label>
                                </Form.Floating>

                                {this.state.invalid && (<Alert variant='danger'>Invalid email or password.</Alert>)}

                                <Button variant='primary' type='submit'>Log in</Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {isLoggedIn() && (<Navigate to='/viewer' />)}
                </main>
            </>
        )
    }
}