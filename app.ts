//region imports
const express = require('express');
import {Request, Response} from "express";
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const database = require('./database');
const User = require('./models/user');
const Scheda = require('./models/scheda');
const Exercise = require('./models/exercise');

User.hasOne(Scheda);
Scheda.hasMany(Exercise);
Exercise.belongsTo(Scheda);
Scheda.belongsTo(User);

const app = express();

const https = require('https');
const fs = require('fs');
const helmet = require('helmet');

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

const server = https.createServer(options, app);

const authRoutes = require('./routes/auth-routes');
// endregion

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(authRoutes);

app.use((req: Request, res: Response) => {
    res.send('<h1>Error 404: page not found!</h1>');
})

database.sync()
    .then(() => {
        console.log('server running');
        server.listen(process.env.PORT || 3000);
    })
    .catch((err: Error) => {
        console.log(err);
    })


