const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const mainRouter = require('./router/main');
const { databaseInit } = require('./util/database');

app.use('/api', mainRouter);

app.listen(8081, () => {
    console.log('api server running at http://127.0.0.1:8081');
});