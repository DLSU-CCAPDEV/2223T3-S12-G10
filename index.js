
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

hbs.registerHelper('isEmpty', function(string) {
    return string == '';
});

hbs.registerHelper('isEqual', function (val1, val2, options) {
    if (val1 == val2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('formatJoinDate', function(joinDate) {
    const date = new Date(joinDate);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return months[date.getMonth()] + " " + date.getFullYear();
});

hbs.registerHelper('nFormatter', function(num, digits) {
    if (num < 0) return num;
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
})
// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));

// set the folder `public` as folder containing static assets
// such as css, js, and image files
app.use(express.static('public'));

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

// define the paths contained in `./routes/routes.js`
app.use('/', routes);



// if the route is not defined in the server, render `../views/error.hbs`
// always define this as the last middleware
app.use(function (req, res) {
    res.render('error');
});

// connects to the database
db.connect();

// binds the server to a specific port
app.listen(port, function () {
    console.log('app listening at port ' + port);
});
