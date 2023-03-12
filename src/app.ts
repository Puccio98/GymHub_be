//region imports
import {initRoutes} from "./routes/init-routes";
import {AuthHelper} from "./helpers/AuthHelper";

require('dotenv').config()

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
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
app.use(cors());


app.use(AuthHelper.authenticateToken)
// import routes into app
initRoutes(app);

app.use(apiErrorHandler);

server.listen(3000);

server.on('uncaughtException', (err: Error) => {
    console.log(err)
})