
// import module `express`
const express = require('express');

// import module `hbs`
const hbs = require('hbs');

const session = require('express-session');

const MongoStore = require('connect-mongo'); 

// import module `mongoose`
const mongoose = require('mongoose');


// import module `routes` from `./routes/routes.js`
const routes = require('./routes/routes.js');

// import module `database` from `./model/db.js`
const db = require('./models/db.js');

const app = express();
const port = 9090;

// set `hbs` as view engine
app.set('view engine', 'hbs');

// sets `/views/partials` as folder containing partial hbs files
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('isNull', function (value) {
    return value !== undefined;
});


hbs.registerHelper('isEqual', function (val1, val2, options) {
    if (val1 == val2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));

// set the folder `public` as folder containing static assets
// such as css, js, and image files
app.use(express.static('public'));

// define the paths contained in `./routes/routes.js`
app.use('/', routes);



// if the route is not defined in the server, render `../views/error.hbs`
// always define this as the last middleware
app.use(function (req, res) {
    res.render('error');
});

// connects to the database
db.connect();

// use `express-session`` middleware and set its options
// use `MongoStore` as server-side session storage
app.use(session({
    secret: 'ccapdev-session', 
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://raphaeltanai:nTISUPYixEgncCfN@projectnum1.5vkr5zy.mongodb.net/?retryWrites=true&w=majority'
    })
  })); 

// binds the server to a specific port
app.listen(port, function () {
    console.log('app listening at port ' + port);
});
