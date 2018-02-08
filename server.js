const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

app.get('/index2', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/dist/index.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.js'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));