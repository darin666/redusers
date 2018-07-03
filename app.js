const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

const append = require('./append.js');

// Create Redis Client
let client = redis.createClient();

client.on('connect', () => {
    console.log('Connected to Redis...');
});

// Set Port
const port = 3000;

// Init app
const app = express();

// View Engine
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// body-parser = middleware
app.use(bodyParser.json()); // basically tells the system that you want json to be used
app.use(bodyParser.urlencoded({extended:false})); // tells the system you want to use a simple algorithm for shallow parsing - here it is enough

// methodOverride - lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
app.use(methodOverride('_method'));

// Search Page
app.get('/', (req, res, next) => {
    res.render('searchusers');
});

// Search processing
app.post('/user/search', (req, res, next) => {
    let id = req.body.id;

    client.hgetall(id, (err, obj) => {
        if(!obj) {
            res.render('searchusers', {
                error: 'User does not exist.'
            });
        } else {
            obj.id = id;
            res.render('details', {
                user: obj
            });
        }
    });
});

// Add User Page
app.get('/user/add', (req, res, next) => {
    res.render('adduser');
});

// Process Add User Page
app.post('/user/add', (req, res, next) => {
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;

    client.hmset(id, [
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ], (err, reply) => {
        if (err) {
            console.log(err);
        }
        console.log(reply);
        res.redirect('/');
    });

    // appending JSON data
    append.appendData(req.body);
});

// Delete user
app.delete('/user/delete/:id', (req, res, next) => {
    // using params because id is sent via url not through form
    client.del(req.params.id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});