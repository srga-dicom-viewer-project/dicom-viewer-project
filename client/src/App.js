import React, { Component } from 'react';
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, isLoggedIn } from './login/Login';
import Viewer from './viewer/Viewer';
import VTKViewer from './viewer/vtk/VTKViewer';
import VTKMPRPaintingExample from './viewer/vtk/VTKMPRPaintingExample';
import VTKLoadImageDataExample from './viewer/vtk/VTKLoadImageDataExample';
import VTKFusionExample from './viewer/vtk/VTKVolumeRenderingExample';
import VTKBasicExample from './viewer/vtk/VTKBasicExample';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    { /* If the user is logged in, the landing will redirect to viewer, otherwise it will prompt the login */}
                    <Route exact path='/' element={<Navigate to={(isLoggedIn() ? '/viewer' : '/login')} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/viewer" element={<Viewer />} />
                    <Route path="/vtk" element={<VTKViewer />} />
                    <Route path="/vtkexample" element={<VTKBasicExample />} />
                    <Route path="/vtkpaint" element={<VTKMPRPaintingExample />} />
                    <Route path="/vtkload" element={<VTKLoadImageDataExample />} />
                    <Route path="/vtkrender" element={<VTKFusionExample />} />
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App