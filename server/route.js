const fileUpload = require('express-fileupload'),
      path = require('path'),
      AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const url = require('url');
const proxy = require('express-http-proxy');
const apiProxy = proxy('https://react-vtkjs-viewport.netlify.app/headsq.vti/', {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path
});

module.exports = app => {

    app.use(fileUpload());

    app.post('/api/upload', async (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'No file to upload!' });
        }

        const file = req.files.file;

        const params = {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.name,
            Body: file.data
        };

        const upload = await s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            }

            resolve(data.Location)
        }).promise();

        res.json({ fileName: file.name, fileURL: upload.Location });
    });

    app.use('/headsq.vti/*', apiProxy);

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });
};