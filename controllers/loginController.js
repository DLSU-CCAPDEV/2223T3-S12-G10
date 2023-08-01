
// import module `database` from `../models/db.js`
const e = require('express');
const db = require('../models/db.js');
const bcrypt = require('bcrypt');
// import module `User` from `../models/UserModel.js`
const User = require('../models/usermodel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `signup` paths in the server
*/
const loginController = {

    /*
        executed when the client sends an HTTP GET request `/signup`
        as defined in `../routes/routes.js`
    */
    getLogin: function (req, res) {
        res.render('login');
    },

    postLogin: async function (req, res) {
        var query = {username: req.body.username};
        var password = req.body.password;
        var projection = '';
        console.log("username & password: " +  req.body.username, req.body.password);
        console.log("double check user pw: " + query + password)
        if(req.body.username != undefined){
            if(req.body.password != undefined){
                console.log("got here!!");
                var result = await db.findOne(User, query, projection);
            }
        }
        console.log("current result: " + result);
        if(result) {
            var profile  = {
                username: result.username,
                joindate: result.joindate,
                password: result.password,
                userdescription: result.userdescription,
                following: result.following,
                followers: result.followers
            };
            console.log("Profile is: ");
            console.log(profile);
            bcrypt.compare(password, result.password, function(err, equal) {
                if(equal) {
                    req.session.username = profile.username;
                    req.session.joindate = profile.joindate;
                    req.session.following = profile.following;
                    req.session.followers = profile.followers;
                    req.session.userdescription = profile.userdescription; 
                    res.redirect('/');
                }
                else {
                    var details = {
                        flag: false,
                        error: `ID Number and/or Password is incorrect.`
                    };
                    console.log(details);
                    res.render('login');
                }
            });
        }
        else {
            var details = {
                flag: false,
                error: `ID Number and/or Password is incorrect.`
            };
            console.log(details);
            res.render('login');
        }
    }
}
        // if(result){
        //     var profile = {
        //         userid: result._id,
        //         username: result.username,
        //         joindate: result.joindate,
        //         userdescription: result.userdescription
        //     };
        //     console.log(profile);
        // }
        // else {
        //     console.log("error!!");
        // }
       
            

/*
    exports the object `signupController` (defined above)
    when another script exports from this file
*/
module.exports = loginController;
