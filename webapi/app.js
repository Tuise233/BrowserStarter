const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync("C:\\Users\\Administrator\\Desktop\\SSL\\key.key", "utf8");
const certificate = fs.readFileSync("C:\\Users\\Administrator\\Desktop\\SSL\\key.pem", "utf8");

const mainRouter = require('./router/main');

const credentials = { key: privateKey, cert: certificate };

const app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


app.use(cors());
app.use(express.urlencoded({ extended: false, limit: '1000000kb' }));
app.use('/api', mainRouter);

httpsServer.listen(8081);
httpServer.listen(8082);

console.log('api server running at http://127.0.0.1:8081');

app.get('/', (req, res) => {
    res.header('Content-Type', 'text/html');
    return res.end('<h1>Homepage Web API</h1>');
});

// app.listen(8081, () => {
//     console.log('api server running at http://127.0.0.1:8081');
// });