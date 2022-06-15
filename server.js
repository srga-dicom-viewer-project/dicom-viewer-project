require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

app.use(fileUpload());

// This prevents the Access Control Origin Header Error
app.use(cors({origin:true,credentials: true}));


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

app.listen(process.env.REACT_APP_API_PORT, () => console.log(`Server Started On Port ${process.env.REACT_APP_API_PORT}!`));