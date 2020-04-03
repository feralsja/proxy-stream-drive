'use strict'

const PORT = 3000;
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.options('*', (req, res, next) => res.end());

app.use(require('./routes'));

app.listen(PORT, () => console.log('Run app port: %s', PORT));
