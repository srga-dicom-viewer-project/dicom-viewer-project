import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import CornerstoneViewport from 'react-cornerstone-viewport';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import initCornerstone from './initCornerstone.js';

initCornerstone();
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const CornerstoneViewer = ({ files, select, setActiveFile }) => {
    const [state, setState] = useState({
        tools: [
            // Mouse
            {
                name: 'Wwwc',
                mode: 'active',
                modeOptions: { mouseButtonMask: 1 },
            },
            {
                name: 'Zoom',
                mode: 'active',
                modeOptions: { mouseButtonMask: 2 },
            },
            {
                name: 'Pan',
                mode: 'active',
                modeOptions: { mouseButtonMask: 4 },
            },
            'Length',
            'Angle',
            'Bidirectional',
            'FreehandRoi',
            'Eraser',
            // Scroll
            { name: 'StackScrollMouseWheel', mode: 'active' },
            // Touch
            { name: 'PanMultiTouch', mode: 'active' },
            { name: 'ZoomTouchPinch', mode: 'active' },
            { name: 'StackScrollMultiTouch', mode: 'active' },
        ],
        imageIds: Array.from(files.values()),
        // Form
        activeTool: 'Wwwc',
        imageIdIndex: 0,
    });

    select((text) => {
        setState(state => ({
            ...state,
            imageIdIndex: parseInt(state.imageIds.indexOf(text))
        }))
    });

    return (
        <CornerstoneViewport
            style={{ margin: 'auto', height: 'absolute' }}
            tools={state.tools}
            imageIds={state.imageIds}
            imageIdIndex={state.imageIdIndex}
            activeTool={state.activeTool}
            isStackPrefetchEnabled={true}
            onNewImage={(event) => setActiveFile(state.imageIds[event.currentImageIdIndex])}
        />
    );
};

export default CornerstoneViewer;