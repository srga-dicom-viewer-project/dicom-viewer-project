import React, { useEffect, useState } from 'react';

const tags = {
    "topRight": {
        "dicomData": {
            "Name": "PatientName",
            "PID": "PatientID",
            "Sex": "PatientSex",
            "DOB": "PatientBirthDate"
        },
        "textType": {
            "laterality": 4
        }
    },
    "topLeft": {
        "dicomData": {
            "Acc#": "AccessionNumber",
            "Study Date": "StudyDate",
            "Study": "StudyDescription",
            "Series": "SeriesDescription",
            "Se#": "SeriesNumber",
        },
        "textType": {
            "frameNumber": 0,
            "instanceNumber": 6,
            "windowLevel": 7,
        }
    },
    "bottomLeft": {
        "dicomData": {},
        "textType": {
            "imageQuality": 0,
            "fieldOfView": 1
        }
    },
    "centerLeft": {
        "dicomData": {},
        "textType": {
            "leftOrientation": 0
        }
    },
    "centerTop": {
        "dicomData": {},
        "textType": {
            "topOrientation": 0
        }
    },
    "centerRight": {
        "dicomData": {},
        "textType": {
            "rightOrientation": 0
        }
    },
    "centerBottom": {
        "dicomData": {},
        "textType": {
            "bottomOrientation": 0
        }
    },
    "bottomRight": {
        "dicomData": {},
        "textType": {
            "mprType": 0
        }
    }
};
const LeadtoolsViewer = ({ files, select, setActiveFile }) => {
    const [cell, setCell] = useState({});

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

        // Disable exploding since only one cell is used
        viewer.set_explodeType(lt.Controls.Medical.ExplodeType.None);

        // Create a cell. It will contain an image or a series of images, based on how many Frames are added (see below for more details).
        var cell = new lt.Controls.Medical.Cell(viewer, viewer.get_divId(), 1, 1);

        // Add the cell to the viewer.
        viewer.layout.get_items().add(cell);

        // Select the cell
        cell.set_selected(true);

        // Set selected border to black
        cell.set_selectedBorderColor('#000000')

        // Allow overlay text to be visible
        cell.set_overlayTextVisible(true);

        Array.from(files.values()).forEach(file => {
            const width = file.data.elements.Columns;
            const height = file.data.elements.Rows;

            var cellFrame = new lt.Controls.Medical.Frame(cell);

            cellFrame.set_enableDraw(true);

            cell.get_frames().add(cellFrame);

            var mrtiInfo = new lt.Controls.Medical.MRTIImage();

            // The image dpi.
            mrtiInfo.fullDpi = lt.LeadSizeD.create(width, height);

            // the tile size
            mrtiInfo.tileSize = lt.LeadSizeD.create(width, height);
            mrtiInfo.frameIndex = 0;

            // does this image support window level.
            mrtiInfo.supportWindowLevel = true;

            // sets the resolution of the image
            mrtiInfo.resolutions = [lt.LeadSizeD.create(width, height)];

            // the image width and height.
            cellFrame.set_width(width);
            cellFrame.set_height(height);

            // the image full size.
            mrtiInfo.fullSize = lt.LeadSizeD.create(cellFrame.get_width(), cellFrame.get_height());

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

            cellFrame.set_JSON(file.data.elements);
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

        // Update the cell
        updateCell(cell);

        // Adds an event listener to update the cell every time a different frame is displayed
        cell.add_currentOffsetChanged(() => updateCell(cell));

        // Sets the cell state so that other parts of the component can use it
        setCell(cell);
    }, []);

    select((index) => {
        cell.currentOffset = index;
    });

    const updateCell = (cell) => {
        // This will set the current file on the left side of the viewer to the one that is shown
        setActiveFile(Array.from(files)[cell.currentOffset][1].url);

        // Adds an overlay to show the current info of the image
        addOverlay(cell.get_frames().toArray()[cell.currentOffset]);

        // Run onSizeChanged so that the overlay shows
        cell.viewer.onSizeChanged();
    }

    const addOverlay = (frame) => {
        const json = frame.get_JSON();

        frame.parentCell.get_overlays().clear();
        for (const [position, data] of Object.entries(tags)) {
            var overlays = [];

            Object.entries(data.textType).forEach(([type, positionIndex]) => {
                overlays[positionIndex] = createOverlay(null, positionIndex, lt.Controls.Medical.OverlayAlignment[position], lt.Controls.Medical.OverlayTextType[type]);
            });
            Object.entries(data.dicomData).forEach(([name, path], index) => {
                var positionIndex = index;
                while (overlays[positionIndex] !== undefined) {
                    positionIndex++;
                }
                overlays[positionIndex] = createTag(`${name}: ${json[path]}`, positionIndex, lt.Controls.Medical.OverlayAlignment[position]);
            });

            for (var i = 0; i < overlays.length; i++) {
                var overlay = overlays[i];
                overlay.positionIndex = i;
                frame.parentCell.get_overlays().add(overlay);
            }
        }
    };

    const createTag = (text, positionIndex, alignment) => {
        return createOverlay(text, positionIndex, alignment, lt.Controls.Medical.OverlayTextType.userData);
    };

    const createOverlay = (text, positionIndex, alignment, textType) => {
        var overlay = new lt.Controls.Medical.OverlayText;
        overlay.text = text;
        overlay.type = textType;
        overlay.positionIndex = positionIndex;
        overlay.weight = 1;
        overlay.alignment = alignment;
        return overlay;
    };

    return (
        <div id="MedicalViewerParentDiv" style={{ width: '100%', height: '100%', alignSelf: 'center' }} />
    );
};

export default LeadtoolsViewer;