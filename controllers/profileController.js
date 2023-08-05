
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/usermodel.js');

const Post =  require('../models/postmodel.js');

const Comment =  require('../models/commentmodel.js');

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
                displayName: result.displayName,
                username: result.username,
                followers: result.followers.length,
                following: result.following.length,
                joindate: result.joindate,
                userdescription: result.userdescription
            };
            
            // render `../views/profile.hbs`
          if (req.path.includes('/usercomments')) {
                // If '/usercomments' is present in the route, render 'profile_comments' template
                var commentQuery = {CommentUserId: result._id};
                var comments = await db.findMany(Comment, commentQuery, '');
                var data = {
                    details: details,
                    comments: comments
                };
                res.render('profile_comments', data);
            } else {
                // If '/usercomments' is not present in the route, render 'profile' template
                var postQuery = {postUserId: result._id};
                var posts = await db.findMany(Post, postQuery, '');
                
                for(let i = 0; i < posts.length; i++) {
                    // if (posts[i].postText != null || posts[i].postText != undefined) {
                    //     posts[i].postText = DOMPurify.sanitize(marked.parse(posts[i].postText));
                    // }
                    if (posts[i].upvotes.length != 0 || posts[i].downvotes.length != 0) {
                        //calculate the votes
                        var votecount = posts[i].upvotes.length - posts[i].downvotes.length;
                        // votes.push(votecount);
                        posts[i].votes = votecount;
                    } else {
                        //both are 0
                        var votecount = 0;
                        // votes.push (votecount);
                        posts[i].votes = votecount;
                    }
    
                    var currentuser = await db.findOne(User, {username: req.session.username}, '_id');
                    
                    if (posts[i].upvotes.includes(currentuser.id)) {
                        posts[i].upvoted = true;
                        posts[i].downvoted = false;
                        posts[i].notvoted = false;
                    } else if (posts[i].downvotes.includes(currentuser.id)) {
                        posts[i].downvoted = true;
                        posts[i].upvoted = false;
                        posts[i].notvoted = false;
                    } else {
                        posts[i].downvoted = false;
                        posts[i].upvoted = false;
                        posts[i].notvoted = true;
                    }
                // console.log(votes[0]);
                    await db.findOne(User, {_id: posts[i]._doc.postUserId}, 'username')
                        .then(function(result) {
                            console.log(result);
                            // posts[i]._doc.postUserId = result.username;
                            posts[i].username = result.username;
                        });
                    await db.findMany(Comment, {CommentPostId: posts[i]._doc._id}, '_id')
                        .then(function(result) {
                            posts[i].commentcount = result.length;
                        })
                }

                
                var data = {
                    details: details,
                    posts: posts
                };
                console.log(data);
                res.render('profile', data);
            }
        }

        /*
            if the user does not exist in the database
            render the error page
        */
        else {
            res.render('error');
        }
    },

    followProfile: async function (req, res) {
        console.log("helo");
        var followed = {_id: req.body.followed}// ID of the person to be followed
        console.log(followed);
        var currentuser = await db.findOne(User, {_id: req.session.userId}, '');

        var result = await db.findOne(User, followed, 'Followers');
        console.log(result);
        if (result != null) {
            //Case 1: User is in Followers already
            if(!result.followers){
                result.followers = [];
                var condition = {$push: {followers: [{_id: req.session.userId}]} };
                var addition = await db.updateOne(User, followed, condition);
                
                var follow = {$push: {followed: [{_id: req.body.followid}]} };
                var addition2 = await db.updateOne(User, {id: req.session.userId}, follow)

                if (addition != null && addition2 != null) {
                    //redirect to page to refresh it
                    res.status(205);
                } else {
                    res.render('error');
                }
            }
            else{
                if (result.followers.includes(currentuser.id)) {
                    //remove the user from the other person's follower list
                    var condition = {$pullAll: {followers: [{_id: req.session.userId}]} };
                    var removal = await db.updateOne(User, followed, condition);
    
                    //remove other person from user's followed list
                    var unfollowed = {$pullAll: {following: [{_id: req.body.followid}]}}
                    var removal2 = await db.updateOne(User, {_id: req.session.userId}, unfollowed)
                    if (removal != null && removal2 != null) {
                        //redirect to page to refresh it
                        res.status(205);
                    } else {
                        res.render('error');
                    }
                } else {
                    //Case 2: User has not yet followed
                    //add the user to other person's follower list
                    var condition = {$push: {followers: [{_id: req.session.userId}]} };
                    var addition = await db.updateOne(User, followed, condition);
                    
                    var follow = {$push: {followed: [{_id: req.body.followid}]} };
                    var addition2 = await db.updateOne(User, {id: req.session.userId}, follow)
    
                    if (addition != null && addition2 != null) {
                        //redirect to page to refresh it
                        res.status(205);
                    } else {
                        res.render('error');
                    }
                }
            }
        }
    }
    
}


/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = profileController;
