//region imports
import {initRoutes} from "./routes/init-routes";
import {authenticateToken} from "./middlewares/authenticateToken";

require('dotenv').config()

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const apiErrorHandler = require('./errors/apiErrorHandler-error')
// endregion

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};
const app = express();
const server = https.createServer(options, app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
//TODO valutare se aggiungre un url tra quelli accettati da cors invece che accettare chiamate che arrivano da ogni dove
app.use(cors({
    origin: ["http://localhost:4200", "http://192.168.1.11:4200"],
}));

app.use(authenticateToken);

initRoutes(app);

app.use(apiErrorHandler);

server.listen(3000);

server.on('uncaughtException', (err: Error) => {
    console.log(err)
})
