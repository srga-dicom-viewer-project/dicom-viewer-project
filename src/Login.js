import React, { Component } from 'react'
import { Alert, Card, Form, Button } from "react-bootstrap"
import { Navigate } from 'react-router-dom'
import { setLoggedIn, isLoggedIn } from './App'
import "./App.css"
import "./Login.css"

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            invalid: false
        };
    }

    handleEmailChanged = (event) => {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChanged = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // TODO: Move these credentials into an environment
        // For now we'll just use hardcoded credentials
        // Email: doctor@hospital.com
        // Password: 123
        if (this.state.email === "doctor@hospital.com" && this.state.password === "123") {
            setLoggedIn(true)

            // May seem unnecessary, but react won't re-render without this
            this.setState({
                invalid: false
            });
        } else {
            this.setState({
                invalid: true
            });
        }
    }

    render() {
        return (
            <>
                <main>
                    <Card className="text-center">
                        <Card.Header className="h2">LOG IN</Card.Header>
                        <Card.Body className="form-login">
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Floating>
                                    <Form.Control
                                        type="email"
                                        className="form-control"
                                        id="floatingInput"
                                        placeholder="Enter email"
                                        value={this.state.email}
                                        onChange={this.handleEmailChanged}
                                        autoFocus
                                        required />
                                    <Form.Label>Email</Form.Label>
                                </Form.Floating>

                                <Form.Floating>
                                    <Form.Control
                                        type="password"
                                        autoComplete="on"
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="Enter password"
                                        value={this.state.password}
                                        onChange={this.handlePasswordChanged}
                                        required />
                                    <Form.Label>Password</Form.Label>
                                </Form.Floating>

                                {this.state.invalid && (
                                    <Alert variant="danger">Invalid email or password.</Alert>
                                )}

                                <Button className="btn-lg" variant="primary" type="submit">Log in</Button>
                            </Form>
                        </Card.Body>
                    </Card>


                    {isLoggedIn() && (
                        <Navigate to='/viewer' />
                    )}
                </main>

            </>
        )
    }
}

export default Login