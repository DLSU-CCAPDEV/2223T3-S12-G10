
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/usermodel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `profile` paths in the server
*/
const profileController = {

    /*
        executed when the client sends an HTTP GET request `/profile/:idNum`
        as defined in `../routes/routes.js`
    */
    getProfile: async function (req, res) {

        // find the user based on their ID
        var query = {username: req.params.username};

        // fields to be returned
        //Get all data except for password
        var projection = '-password';

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function searches the collection `users`
            based on the value set in object `query`
            the third parameter is a string containing fields to be returned
        */
        var result = await db.findOne(User, query, projection);

        /*
            if the user exists in the database
            render the profile page with their details
        */
        if(result != null) {
            
            var details = {
                userid: result._id,
                username: result.username,
                followers: result.followers.length,
                following: result.following.length,
                joindate: result.joindate,
                userdescription: result.userdescription
            };

            // render `../views/profile.hbs`
            res.render('profile', details);
        }

        /*
            if the user does not exist in the database
            render the error page
        */
        else {
            res.render('error');
        }
    }
}

/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = profileController;
