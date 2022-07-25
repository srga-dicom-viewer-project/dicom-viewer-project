const fileUpload = require('express-fileupload'),
    path = require('path'),
    AWS = require('aws-sdk'),
    dcmjsImaging = require('dcmjs-imaging'),
    { DicomImage, NativePixelDecoder } = dcmjsImaging,
    Jimp = require('jimp');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

NativePixelDecoder.initializeAsync();

module.exports = app => {
    app.use(fileUpload());

    app.post('/api/upload', async (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'No file to upload!' });
        }

        const file = req.files.file;
        const fileName = file.name + '.png';

        const fileBuffer = file.data;
        const dicomImage = new DicomImage(fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength));

        const renderingResult = dicomImage.render();
        const renderedPixels = Buffer.from(renderingResult.pixels);

        const rawImageData = {
            data: renderedPixels,
            width: dicomImage.getWidth(),
            height: dicomImage.getHeight(),
        };

        Jimp.read(rawImageData, function (err, image) {
            if (!err) {
                image.getBuffer(Jimp.MIME_PNG, async function (err, data) {
                    const params = {
                        ACL: 'public-read',
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: `${fileName}&frame=0&x=0&y=0&w=0&h=0&xr=307&yr=371&wldata=true`,
                        Body: data,
                    };

                    const upload = await s3.upload(params, (err, data) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }

                        resolve(data.Location);
                    }).promise();

                    delete dicomImage.elements.PixelData;
                    delete dicomImage.elements.RequestAttributesSequence;
                    
                    var fileUrl = upload.Location;
                    fileUrl = fileUrl.substring(0, fileUrl.indexOf(fileName) + fileName.length);
                    res.json({ fileName: fileName, fileURL: fileUrl, dicomData: dicomImage });
                });
            } else {
                console.log(err);
            }
        });
    });

    // You need to have the following Leadtools scripts inside the directory below:
    // * Leadtools.js
    // * Leadtools.Controls.js
    // * Leadtools.Annotations.Engine.js
    // * Leadtools.Annotations.Designers.js
    // * Leadtools.Annotations.Rendering.JavaScript.js
    // * Leadtools.Annotations.Automation.js
    // * Leadtools.Controls.Medical.js
    app.get('/api/leadtools/:file', async (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/src/viewer/leadtools/lib/', req.params.file));
    });

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });
};