import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';

const LeadtoolsViewer = ({ files }) => {
    useEffect(() => {
        // Must set license otherwise this will not work
        lt.RasterSupport.setLicenseText(process.env.REACT_APP_LEADTOOLS_LICENSE, process.env.REACT_APP_LEADTOOLS_DEVELOPER_KEY);

        // Get the parent DIV
        var imageViewerDiv = document.getElementById('MedicalViewerParentDiv')

        // Return if the parent DIV is already created
        if (imageViewerDiv.outerHTML.includes("MedicalViewerParentDiv_MedicalViewer")) {
            return;
        }

        // Create the medical viewer control, and specify the number or rows and columns.
        var viewer = new lt.Controls.Medical.MedicalViewer(imageViewerDiv, 2, 2);

        // [optional] Update the splitter size so it become thick and easy to move.
        viewer.get_gridLayout().set_splitterSize(7);

        // Create a cell name var
        var cellName = "MedicalCell" + Date.now();

        // Create a cell. It will contain an image or a series of images, based on how many Frames are added (see below for more details).
        var cell = new lt.Controls.Medical.Cell(viewer, viewer.get_divId(), 1, 1);

        // Set the show border to "true", to show a border around the cell.
        cell.set_showFrameBorder(true);

        // Add the cell to the viewer.
        viewer.layout.get_items().add(cell);

        // [optional] Select the cell (it can also be selected by clicking on it.)
        cell.set_selected(true);

        // Now create a frame object which will hold the image inside the cell.
        var cellFrame = new lt.Controls.Medical.Frame(cell);

        // Add the frame to the cell class.
        cell.get_frames().add(cellFrame);

        // we are now going to to download an image from LEADTOOLS medical web service demo.

        // now, this is the MRTI info that contains the image information, width, height, tiles....etc.
        var mrtiInfo = new lt.Controls.Medical.MRTIImage();

        // The image dpi.
        mrtiInfo.fullDpi = lt.LeadSizeD.create(150, 150);

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
        cellFrame.set_width(mrtiInfo.resolutions[0].width);
        cellFrame.set_height(mrtiInfo.resolutions[0].height);

        // the image full size.
        mrtiInfo.fullSize = lt.LeadSizeD.create(
            cellFrame.get_width(),
            cellFrame.get_height()
        );

        // now we need the image URL,
        //mrtiInfo.imageUri = 'https://dicom-viewer-project-bucket.s3.us-west-1.amazonaws.com/GetImageTile.png';

        // sets the image url to the uploaded image
        mrtiInfo.imageUri = Array.from(files.values())[0];

        // set this info to the cell frame.
        cellFrame.mrtiInfo = mrtiInfo;

        // now we need to set the information for the image so we can do window level.
        var imageInfo = new lt.Controls.Medical.DICOMImageInformation();

        //console.log(imageInfo)

        // set the image width and height.
        imageInfo.width = 2460;
        imageInfo.height = 2970;

        // bits per pixel for the image
        imageInfo.bitsPerPixel = 24;
        // low and high bit.
        imageInfo.lowBit = 0;
        imageInfo.highBit = 11;

        // other information, setting some of them to zero means that the toolkit will try and calculate it by itself, but you can always get those values from the DicomDataSet.
        imageInfo.modalityIntercept = 0;
        imageInfo.modalitySlope = 1;
        imageInfo.minValue = 0;
        imageInfo.maxValue = 0;
        imageInfo.windowWidth = 0;
        imageInfo.windowCenter = 0;
        imageInfo.signed = false;
        imageInfo.photometricInterpretation = "MONOCHROME1";
        imageInfo.firstStoredPixelValueMapped = 0;

        // set these information to the frame.
        cellFrame.set_information(imageInfo);

        // [optional] Add an action that allows the user to move the loaded image using either the mouse or by touch and drag. we are adding an offset action.
        cell.setCommand(1, new lt.Controls.Medical.OffsetAction());

        // [optional] Add an action that allows the user to do window level on the image.
        cell.setCommand(2, new lt.Controls.Medical.WindowLevelAction());

        // [optional] Run the action. Now if the user clicks or touches the image and drags it, the image will move correspondingly.
        cell.runCommand(2);

        // [optional] Create an overlay text that will appear at the top of the loaded image.
        var overlay = new lt.Controls.Medical.OverlayText();

        // [optional] Set the aligment for the overlay text.
        overlay.set_alignment(lt.Controls.Medical.OverlayAlignment.topLeft);

        // [optional] Set the row index of overlay text.
        overlay.set_positionIndex(0);

        // [optional] add window level overlay text, this will change when you click and drag the mouse.
        overlay.set_type(lt.Controls.Medical.OverlayTextType.windowLevel);

        // [optional] Add this overlay to the overlay list of the cell. Currently there is only one overlay, but the user can add multiple overlay texts.
        cell.get_overlays().add(overlay);

        // alert(
        //     "-Hold left mouse button and drag to change the image window level \n-Double click to expand the view area \n-Double click again to return to the previous view area."
        // );
    }, []);

    return (
        <Card bg='dark' style={{ width: '75%', height: '70vh', display: 'flex', flexWrap: 'nowrap', padding: '10px' }}>
            <div id="MedicalViewerParentDiv" style={{ width: '100%', height: '100%', alignSelf: 'center' }} />
        </Card>
    );
};

export default LeadtoolsViewer;