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
//const server = https.createServer(options, app);

app.use(bodyParser.urlencoded!({extended: false}));
app.use(bodyParser.json!());
app.use(helmet());

app.use(express.static!(path.join(__dirname, 'public')));
//TODO valutare se aggiungre un url tra quelli accettati da cors invece che accettare chiamate che arrivano da ogni dove
app.use(cors());
// {
//     origin: ["http://localhost:4200", "http://192.168.1.11:4200"],
// }
//prova cors a manina
// app.use(function (req: any, res: any, next: any) {    //CORS
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.setHeader("Access-Control-Allow-Headers", "Origin, x-access-token, X-Requested-With, Content-Type, Accept");
//     if ('OPTIONS' == req.method) {
//         res.send(200);
//     } else {
//         next();
//     }
// });


app.use(authenticateToken);

initRoutes(app);

app.use(apiErrorHandler);

app.listen(process.env.PORT || 80, () => {
    console.log('la tua porta è ' + process.env.PORT + ' ' + 80);
});  //3000    server, non app

app.on('uncaughtException', (err: Error) => {
    console.log(err);
})  //server, non app
