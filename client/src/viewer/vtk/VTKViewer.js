import React from 'react';
import { Card } from 'react-bootstrap';
import VTKMPRPaintingExample from './VTKMPRPaintingExample';
import '../cornerstone/CornerstoneViewer.css';

const VTKViewer = ({ files, select, setActiveFile }) => {
    return (
        <Card bg='dark' className='cornerstone-viewer'>
            <VTKMPRPaintingExample />
        </Card>
    );
}

export default VTKViewer;