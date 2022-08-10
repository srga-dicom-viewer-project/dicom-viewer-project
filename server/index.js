const express = require('express'),
    path = require('path'),
    dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') }),
    cors = require('cors'),
    app = express(),
    route = require('./route.js'),
    port = process.env.REACT_APP_API_PORT;

app.use(express.static(path.resolve(__dirname, '../client/build')));

// This prevents the Access Control Origin Header Error
app.use(cors({ origin: true, credentials: true }));

route(app);

app.listen(port, () => {
    console.log(`Server listening on the port: ${port}`);
});