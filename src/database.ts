const fs = require('fs');
const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.cert');
export const db = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        database: 'gymhub_test',
        user: 'root',
        password: 'rootpsw',
        port: 3306,
        // host: process.env.DB_HOST,
        // database: process.env.DB_CONNECTION_NAME,
        // user: process.env.DB_USER_NAME,
        // password: process.env.DB_PASSWORD,
        // port: 3306,
        // ssl: {
        //     key: key,
        //     cert: cert,
        // }
    }
});

