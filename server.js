require('dotenv').config();
fileSystem = require('fs')
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

app.use(fileUpload());

// This prevents the Access Control Origin Header Error
app.use(cors({ origin: true, credentials: true }));

app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    file.mv(`${__dirname}/uploads/${file.name}`, error => {
        if (error) {
            console.error(error);
            return res.status(500).send(error);
        }

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
});

app.get('/use/:file', (req, res) => {
    if (req.params.file === null) {
        return res.status(400).json({ msg: 'No file requested' });
    }

    var filePath = `${__dirname}/uploads/${req.params.file}`;
    var stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'dicom',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    readStream.on('data', function (data) {
        res.write(data);
    });

    readStream.on('end', function () {
        res.end();
    });
});

app.listen(process.env.REACT_APP_API_PORT, () => console.log(`Server Started On Port ${process.env.REACT_APP_API_PORT}!`));