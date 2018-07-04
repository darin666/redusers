const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const _ = require('lodash');

const append = require('./append.js');
const errorHandler = require('./errorHandler.js');

// Create Redis Client
const client = redis.createClient();

client.on('connect', () => {
    console.log('Connected to Redis...');
});

// use port 3000 unless there is a preconfigured one
const port = process.env.port || 3000;

// Init app
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// error handler
app.use(errorHandler.errorHandler);

// GET
app.get('/count', (req, res, next) => {
    client.get('count', (error, reply) => {
        if (error){
            throw error;
        } else if (reply === null) {
            res.send('Count is empty.');
        }
        res.send(reply);
    });
});

// POST
app.post('/track', (req, res, next) => {
    const isEmpty = _.isEmpty(req.body);
    const count = req.body.count;
    const isInteger = Number.isInteger(count);

    // appending JSON data
    console.log(count);
    console.log(req.body);
    append.appendData(req.body);

    if (isEmpty) {
        throw new Error('Recieved an empty object.');
    } else if (!isInteger) {
        throw new Error('Count expects a number.');
    } else {
        client.incrby('count', count,
        (error, reply) => {
            if (error) {
                throw error;
            }
            console.log(reply);
            res.sendStatus(200);
        });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// if (count != undefined) {
//     client.incrby('count', count,
//         (error, reply) => {
//             if (error) {
//                 throw error;
//             }
//             console.log(reply);
//             res.sendStatus(200);
//         });
// } else if (count && !isInteger) {
//     throw new Error('Count expects a number.');
// } else if (isEmpty) {
//     throw new Error('Recieved an empty object.');
// }