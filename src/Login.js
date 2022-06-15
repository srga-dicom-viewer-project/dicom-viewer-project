import React, { Component } from 'react'
import { Alert, Card, Form, Button } from "react-bootstrap"
import { Navigate } from 'react-router-dom'
import { setLoggedIn, isLoggedIn } from './App'
import "./App.css"
import "./Login.css"


function CredentialsAlert(state) {
    if (state.props.state.alert === "loggingIn") {
        return (
            <Alert variant="success">
                Logging in!
            </Alert>
        );
    } else if (state.props.state.alert === "invalid") {
        return (
            <Alert variant="danger">
                Invalid email or password.
            </Alert>
        );
    }
}

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            alert: ""
        };

        this.setState = this.setState.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleEmailChanged(event) {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChanged(event) {
        this.setState({
            password: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        // For now we'll just use hardcoded credentials
        // Email: doctor@hospital.com
        // Password: 123
        if (this.state.email === "doctor@hospital.com" && this.state.password === "123") {
            this.setState({
                alert: "loggingIn"
            });
            setLoggedIn(true)
        } else {
            this.setState({
                alert: "invalid"
            });
        }
    }

    render() {
        return (
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
                                    onChange={this.handleEmailChanged.bind(this)}
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
                                    onChange={this.handlePasswordChanged.bind(this)}
                                    required />
                                <Form.Label>Password</Form.Label>
                            </Form.Floating>

                            <CredentialsAlert props={this} />

                            <Button className="btn-lg" variant="primary" type="submit">Log in</Button>
                        </Form>
                    </Card.Body>
                </Card>
                {isLoggedIn() && <Navigate to='/viewer' />}
            </main>
        )
    }
}

export default Login