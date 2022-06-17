import React from 'react'
import CornerstoneViewport from 'react-cornerstone-viewport'
import * as cornerstone from "cornerstone-core"
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const CornerstoneViewer = ({ getFile }) => {
    const state = {
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
        imageIds: [
            // TODO: Implement null check here
            `wadouri:${process.env.REACT_APP_API_CONNECTION_STRING}/use/${getFile().fileName}`,
        ],
    };

    return (
        <CornerstoneViewport
            tools={state.tools}
            imageIds={state.imageIds}
            style={{ minWidth: '100%', height: '512px', flex: '1' }}
        />
    );
};

export default CornerstoneViewer;