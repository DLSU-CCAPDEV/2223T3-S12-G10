
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/usermodel.js');

const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');

/*
    defines an object which contains functions executed as callback
    when a client requests for `signup` paths in the server
*/
const signupController = {

    /*
        executed when the client sends an HTTP GET request `/signup`
        as defined in `../routes/routes.js`
    */
    getSignUp: function (req, res) {
        res.render('register');
    },

    /*
        executed when the client sends an HTTP POST request `/signup`
        as defined in `../routes/routes.js`
    */
    postSignUp: async function (req, res) {

        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            var errorMessages = errors.array().map(error => error.msg);
            res.render('register', { errors: errorMessages.pop() });
        } 
        else{
            
            /*
                when submitting forms using HTTP POST method
                the values in the input fields are stored in `req.body` object
                each <input> element is identified using its `name` attribute
                Example: the value entered in <input type="text" name="fName">
                can be retrieved using `req.body.fName`
            */
            var username = req.body.username;
            var password = req.body.password;
            console.log('password is: ' + password);
    
            bcrypt.hash(password, 10, async function (err, hash) {
                var user = {
                    username: username,
                    password: hash,
                    joindate: new Date(),
                    userdescription: '',
                    following: [],
                    followers: []
                }
    
                /*
                calls the function insertOne()
                defined in the `database` object in `../models/db.js`
                this function adds a document to collection `users`
            */
                var response = await db.insertOne(User, user);
                /*
                    upon adding a user to the database,
                    redirects the client to `/success` using HTTP GET,
                    defined in `../routes/routes.js`
                    passing values using URL
                    which calls getSuccess() method
                    defined in `./successController.js`
                */
    
                if (response != null) {
                    req.session.username = user.username;
                    req.session.joindate = user.joindate;
                    req.session.following = user.following;
                    req.session.followers = user.followers;
                    req.session.userdescription = user.userdescription;
                    res.redirect('/');
                } else {
                    res.render('error');
                }
           
            });
         }


    }
}

/*
    exports the object `signupController` (defined above)
    when another script exports from this file
*/
module.exports = signupController;
