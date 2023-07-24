
// import module `express`
const express = require('express');

// import module `controller` from `../controllers/controller.js`
const controller = require('../controllers/controller.js');

// import module `signupController` from `../controllers/signupController.js`
const signupController = require('../controllers/signupController.js');

// import module `successController` from `../controllers/successController.js`
const successController = require('../controllers/successController.js');

// import module `profileController` from `../controllers/profileController.js`
const profileController = require('../controllers/profileController.js');

const postController = require('../controllers/postController.js');

const app = express();
const postRouter = require('./postroutes.js');


/*
    execute function getFavicon()
    defined in object `controller` in `../controllers/controller.js`
    when a client sends an HTTP GET request for `/favicon.ico`
*/
app.get('/favicon.ico', controller.getFavicon);

/*
    execute function getIndex()
    defined in object `controller` in `../controllers/controller.js`
    when a client sends an HTTP GET request for `/`
*/
app.get('/', postController.getManyPosts);

app.get('/index', postController.getManyPosts);

/*
    execute function getSignUp()
    defined in object `signupController` in `../controllers/signupController.js`
    when a client sends an HTTP GET request for `/signup`
*/
app.get('/register', signupController.getSignUp);

/*
    execute function postSignUp()
    defined in object `signupController` in `../controllers/signupController.js`
    when a client sends an HTTP POST request for `/signup`
*/
app.post('/register', signupController.postSignUp);

/*
    execute function getSuccess()
    defined in object `successController` in `../controllers/successController.js`
    when a client sends an HTTP GET request for `/success`
*/
app.get('/success', successController.getSuccess);

/*
    execute function getProfile()
    defined in object `profileController` in `../controllers/profileController.js`
    when a client sends an HTTP GET request for `/profile/:idNum`
    where `idNum` is a parameter
*/
app.get('/profile/:username', profileController.getProfile);

app.post('/search/:postSearch', postController.searchPost);

app.get('/search/:postSearch', postController.getSearchedPosts);
/*
    these ones will be used specifically to get posts in the main index page
*/
//this
app.use('', postRouter);

/*
    exports the object `app` (defined above)
    when another script exports from this file
*/
module.exports = app;
