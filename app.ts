const express = require('express');
import {Request, Response} from "express";
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const http = require('http');
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());



app.use((req: Request, res: Response) => {
    console.log('test per vedere se il front-end connette');
    res.json({response: 'la connessione funziona!'});
});

server.listen(5000);
