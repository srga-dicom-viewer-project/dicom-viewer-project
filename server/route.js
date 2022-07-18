const fileUpload = require('express-fileupload'),
      path = require('path'),
      AWS = require('aws-sdk'),
      Helper = require('@accusoft/document-processing-helper'),
      fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const documentProcessingHelper = new Helper({
    prizmDocServerBaseUrl: process.env.ACCUSOFT_API_URL,
    apiKey: process.env.ACCUSOFT_API_KEY
});

module.exports = app => {
    app.use(fileUpload());

    app.post('/api/upload', async (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'No file to upload!' });
        }

        const file = req.files.file;

        const output = await documentProcessingHelper.convert({
            input: file.data,
            outputFormat: 'png'
        });
        await output[0].saveToFile('output.png');

        //console.log(output[0])
        const fileContent = fs.readFileSync('output.png');

        const params = {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${file.name}.png&frame=0&x=0&y=0&w=0&h=0&xr=307&yr=371&wldata=true`,
            Body: fileContent,
        };

        const upload = await s3.upload(params, (err, data) => {
            if (err) {
                console.log(err)
                reject(err)
            }

            resolve(data.Location)
        }).promise();

        res.json({ fileName: file.name + '.png', fileURL: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.name}.png` });
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