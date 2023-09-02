const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    dotenv = require('dotenv').config({
        path: __dirname + '/.env'
    }),
    telegramRoute = require('./src/telegram/api'),
    viewRoute = require('./views/index');
    
app = express();
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/test-drive', (req, res,next) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.json({
        "VERSION": process.env.APP_VERSION,
        "SENDER":process.env.APP_NAME,
        "STATUS": "SUCCESS",
        "MESSAGE": "ALL FINE",
        "PAYLOAD": null
    })
});

app.use('/bot/', telegramRoute);
app.use('/page/', viewRoute);

app.use((req, res, next)=>{
    res.status(404);
    res.json({
        VERSION: process.env.APP_VERSION,
        SENDER:process.env.APP_NAME,
        STATUS:"ERROR",
        MESSAGE:"URL NOT FOUND",
    });
});
app.listen((process.env.PORT || process.env.HOST_PORT), () => {
    console.log('Server running on port: ' + (process.env.PORT || process.env.HOST_PORT));
});
