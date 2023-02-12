//region Imports
import {initRoutes} from "./routes/init-routes";
import {Request, Response} from "express";
import * as winston from "winston";
import "./db_definitions"


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database');

const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');
// endregion

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};
const data = new Date().toISOString().substr(0, 10);
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({filename: `./log/${data}.log`})
    ]
});
const app = express();
// morgan è un console logger, con l'opzione tiny loggerà in console tutte le chiamate che arriveranno al server e lo stato della chiamata
app.use(morgan('tiny'));
const server = https.createServer(options, app);


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Middleware degli errori
app.use((err: any, req: Request, res: Response, next: any) => {
    logger.info(`richiesta ${req.path}`);
    console.log(JSON.stringify(err));
    logger.error(`richiesta "${req.path}" errore: ${JSON.stringify(err)}, parametri: ${req.body.toString()}`);
    return res.status(err.statusCode).send({error: {...err}});
});

// import routes into app
initRoutes(app);

// Registrazioni di tutti i modelli nel database
const Project = import(__dirname + "/models");
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
    logger.info(`server Back-End in ambiente ${process.env.ENVIRONMENT} protocollo ${process.env.PROTOCOL} porta ${process.env.PORT_BACKEND}`);
}).catch((err: Error) => {
    console.log(err);
})

// Prevengo errori non gestiti che possono bloccare l'esecuzione del server
process.on('uncaughtException', (err) => {
    logger.error(err.message);
});
