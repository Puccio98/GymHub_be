//region Imports
import {initRoutes} from "./routes/init-routes";
import {Request, Response} from "express";


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
// endregion

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};
const data = new Date().toISOString().substr(0, 10);
const app = express();
const server = https.createServer(options, app);


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Middleware degli errori
app.use((err: any, req: Request, res: Response, next: any) => {
    console.log(JSON.stringify(err));
    return res.status(err.statusCode).send({error: {...err}});
});

// import routes into app
initRoutes(app);

app.use((req: Request, res: Response) => {
    res.send('<h1>Error 404: page not found!</h1>');
})

/***
 * Come funziona .sync():
 * https://stackoverflow.com/questions/21066755/how-does-sequelize-sync-work-specifically-the-force-option
 * NON CAMBIARE FORCE A TRUE, SE LO CAMBI DISTRUGGI TUTTI I DATI PRESENTI NEL DB
 */
database.sync({alter: true, force: false}).then(() => {
    server.listen(process.env.PORT || 3000);
}).catch((err: Error) => {
    console.log(err);
})

// Prevengo errori non gestiti che possono bloccare l'esecuzione del server
process.on('uncaughtException', (err) => {
});
