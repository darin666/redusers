const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const append = require('./src/append');
const errorHandler = require('./src/errorHandler');
const redis = require('./src/redis');

// use port 3000 unless there is a preconfigured one
const port = process.env.port || 3000;

// Init app
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// GET
app.get('/count', async (req, res) => {
    const count = await redis.redisGet('count');
    res.status(200).send(count);
});

// POST
app.post('/track', async (req, res, next) => {
    try {
        if (_.isEmpty(req.body)) throw new Error('Received an empty object.');
        const hasCountProperty = req.body.hasOwnProperty('count');
        const count = req.body.count;

        if(hasCountProperty) await redis.redisIncrby('count', count);

        append.appendData(req.body);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    };
});

// error handler
app.use(errorHandler.errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
