import "bootstrap/dist/css/bootstrap.min.css"
import React, { Component } from 'react'
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './Login'
import Viewer from './viewer/Viewer'

// Sets loggedIn to true on the user's broswer
export const setLoggedIn = function (loggedIn) {
  sessionStorage.setItem('loggedIn', loggedIn);
}

// Checks to see if user has loggedIn set to true
export const isLoggedIn = function () {
  return sessionStorage.getItem('loggedIn') === 'true'
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          { /* If the user is logged in, the landing will redirect to viewer, otherwise it will prompt the login */ }
          <Route path='/' element={<Navigate to={ '/' + (isLoggedIn() ? 'viewer' : 'login') } />} />
          <Route path="/login" element={<Login />} />
          <Route path="/viewer" element={<Viewer />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App