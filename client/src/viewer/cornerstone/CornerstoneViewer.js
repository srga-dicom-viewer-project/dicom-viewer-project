import React from 'react'
import CornerstoneViewport from 'react-cornerstone-viewport'
import * as cornerstone from "cornerstone-core"
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"
import "./CornerstoneViewer.css"
import initCornerstone from './initCornerstone.js';

initCornerstone();
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const CornerstoneViewer = ({ files, select }) => {
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
        imageIds: Array.from(files.values()),
        // Form
        imageIdIndex: 0,
        activeTool: 'Wwwc',
    };

    select((text) => {
        state.imageIdIndex = state.imageIds.indexOf(text)
    });

    return (
        <div className="cornerstone-viewer">
            <CornerstoneViewport
                className="viewer"
                tools={state.tools}
                imageIds={state.imageIds}
                imageIdIndex={state.imageIdIndex}
            />
        </div>
    );
};

export default CornerstoneViewer;