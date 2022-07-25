import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';

const LeadtoolsViewer = ({ files, select }) => {
    useEffect(() => {
        // Must set license otherwise this will not work
        lt.RasterSupport.setLicenseText(process.env.REACT_APP_LEADTOOLS_LICENSE, process.env.REACT_APP_LEADTOOLS_DEVELOPER_KEY);

        // Get the parent DIV
        var imageViewerDiv = document.getElementById('MedicalViewerParentDiv')

        // Return if the parent DIV is already created
        if (imageViewerDiv.outerHTML.includes("MedicalViewerParentDiv_MedicalViewer")) {
            return;
        }

        // Create the medical viewer control
        var viewer = new lt.Controls.Medical.MedicalViewer(imageViewerDiv, 1, 1);

        // Create a cell. It will contain an image or a series of images, based on how many Frames are added (see below for more details).
        var cell = new lt.Controls.Medical.Cell(viewer, viewer.get_divId(), 1, 1);

        // Set the show border to "true", to show a border around the cell.
        cell.set_showFrameBorder(true);

        // Add the cell to the viewer.
        viewer.layout.get_items().add(cell);

        cell.set_selected(true);

        Array.from(files.values()).forEach(file => {
            const width = file.data.elements.Columns;
            const height = file.data.elements.Rows;

            var cellFrame = new lt.Controls.Medical.Frame(cell);
            cell.get_frames().add(cellFrame);

            var mrtiInfo = new lt.Controls.Medical.MRTIImage();

            // The image dpi.
            mrtiInfo.fullDpi = lt.LeadSizeD.create(width, height);

            // the tile size, recommended value is 256
            mrtiInfo.tileSize = lt.LeadSizeD.create(256, 256);
            mrtiInfo.frameIndex = 0;

            // does this image support window level.
            mrtiInfo.supportWindowLevel = true;

            // different resolution for the image.
            var resolutions = [
                { width: 2460, height: 2970 },
                { width: 1230, height: 1485 },
                { width: 615, height: 742 },
                { width: 307, height: 371 },
                { width: 153, height: 185 },
                { width: 76, height: 92 },
            ];
            mrtiInfo.resolutions = [];
            for (var i = 0; i < resolutions.length; i++) {
                mrtiInfo.resolutions[i] = lt.LeadSizeD.create(resolutions[i].width, resolutions[i].height);
            }

            // the image width and height.
            cellFrame.set_width(width);
            cellFrame.set_height(height);

            // the image full size.
            mrtiInfo.fullSize = lt.LeadSizeD.create(
                cellFrame.get_width(),
                cellFrame.get_height()
            );

            // now we need the image URL,
            // sets the image url to the uploaded image
            mrtiInfo.imageUri = file.url;

            // set this info to the cell frame.
            cellFrame.mrtiInfo = mrtiInfo;

            // now we need to set the information for the image so we can do window level.
            var imageInfo = new lt.Controls.Medical.DICOMImageInformation();

            imageInfo.width = width;
            imageInfo.height = height;

            imageInfo.photometricInterpretation = file.data.elements.PhotometricInterpretation;
            imageInfo.minValue = 0;
            imageInfo.maxValue = 0;
            imageInfo.windowWidth = 0;
            imageInfo.windowCenter = 0;
            imageInfo.signed = false;
            imageInfo.firstStoredPixelValueMapped = 0;

            cellFrame.set_information(imageInfo);
        });

        // Creating the window level action
        var windowLevel = new lt.Controls.Medical.WindowLevelAction();
        // Setting the action to left mouse button.
        windowLevel.button = lt.Controls.MouseButtons.left; 
        // Setting the command
        cell.setCommand(0, windowLevel); 
        // Running it
        cell.runCommand(0); 

        // Creating the scale action
        var scale = new lt.Controls.Medical.ScaleAction(); 
        // Setting the button to middle mouse button.
        scale.button = lt.Controls.MouseButtons.middle; 
        // Setting the command
        cell.setCommand(0, scale);
        // Running it 
        cell.runCommand(0); 

        // Creating the pan action
        var offset = new lt.Controls.Medical.OffsetAction(); 
        // Setting the button to right mouse button.
        offset.button = lt.Controls.MouseButtons.right; 
        // Setting the command
        cell.setCommand(0, offset); 
        // Running it
        cell.runCommand(0); 
    }, []);

    select((text) => {
        // Run stuff here
    });

    return (
        <Card bg='dark' style={{ width: '75%', height: '70vh', display: 'flex', flexWrap: 'nowrap', padding: '10px' }}>
            <div id="MedicalViewerParentDiv" style={{ width: '100%', height: '100%', alignSelf: 'center' }} />
        </Card>
    );
};

export default LeadtoolsViewer;