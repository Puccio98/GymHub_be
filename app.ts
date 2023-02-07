//region imports
const express = require('express');
import {Request, Response} from "express";

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const database = require('./database');

const app = express();

const http = require('http');
const server = http.createServer(app);

const authRoutes = require('./routes/auth-routes');
// endregion

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(authRoutes);

app.use((req: Request, res: Response) => {
    res.send('<h1>Error 404: page not found!</h1>');
})

database.sync()
    .then(() => {
        console.log('server running');
        server.listen(3000);
    })
    .catch((err: Error) => {
        console.log(err);
    })


