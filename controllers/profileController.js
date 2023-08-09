
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/usermodel.js');

const Post =  require('../models/postmodel.js');

const Comment =  require('../models/commentmodel.js');

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const fs = require('fs');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const marked = require("marked");

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

marked.use({
    mangle: false,
    headerIds: false
});

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

        var isNotProfile = true;
        if(result.username == req.session.username)
            isNotProfile = false;
        //console.log(result.username + " " +req.session.username);
        //console.log(isOwnProfile);
        if(result != null) {
        
            var details = {
                isNotProfile,
                userid: result._id,
                displayName: result.displayName,
                username: result.username,
                followers: result.followers.length,
                following: result.following.length,
                joindate: result.joindate,
                userdescription: result.userdescription,
            };
            if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
                details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
            } else {
                details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
            }
            
            //console.log(details);
            // render `../views/profile.hbs`
          if (req.path.includes('/usercomments')) {
                // If '/usercomments' is present in the route, render 'profile_comments' template
                var commentQuery = {CommentUserId: result._id};
                var comments = await db.findMany(Comment, commentQuery, '');
                for (let i = 0; i < comments.length; i++) {
                    /*db.findOne(User, {_id: comments[i].CommentUserId}, 'username').then(function(result) {
                        comments[i].CommentUser = result.username;
                    });*/
                    comments[i].CommentUser = req.session.username;
                    if (fs.existsSync('public/images/' + comments[i].CommentUserId.toString() + '.png')) {
                        comments[i].profilePicture = '/images/' + comments[i].CommentUserId.toString() + '.png';
                    } else {
                        comments[i].profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + comments[i].CommentUserId.toString();
                    }
                    comments[i].editableComment = true;
                }
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

                    posts[i].postText = DOMPurify.sanitize(marked.parse(posts[i].postText));

                    if (fs.existsSync('public/images/' + posts[i].postUserId.toString() + '.png')) {
                        posts[i].profilePicture = '/images/' + posts[i].postUserId.toString() + '.png';
                    } else {
                        posts[i].profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + posts[i].postUserId.toString();
                    }
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

     getSettings: async function (req, res) {
         if (!req.session.username) {
            res.redirect('/');
            return;
        }
        var details = {
            flag: false,
            error: '',
            displayName: req.session.displayName,
            username: req.session.username,
            user_description: req.session.userdescription,
            following: req.session.following,
            followers: req.session.followers,
            joindate: req.session.joindate,
        }
         if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
             details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
         } else {
             details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
         }
        res.render('settings', details);
        //const user = await db.findOne(User, { username: 'NewUser1' });
       // console.log(user);
    },   

    postSettings: async function (req, res)  {
        bcrypt.compare(req.body.old_password, req.session.password, async function (err, equal) {
            if (!equal) {
                var details = {
                    flag: true,
                    error: "Current password is incorrect!",
                    displayName: req.session.displayName,
                    username: req.session.username,
                    user_description: req.session.userdescription,
                    following: req.session.following,
                    followers: req.session.followers,
                    joindate: req.session.joindate
                };
                if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
                    details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
                } else {
                    details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
                }
                res.render('settings', details);
            } else if (req.body.display_name.length == 0) {
                var details = {
                    flag: true,
                    error: "Please enter a display name!",
                    displayName: req.session.displayName,
                    username: req.session.username,
                    user_description: req.session.userdescription,
                    following: req.session.following,
                    followers: req.session.followers,
                    joindate: req.session.joindate
                };
                if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
                    details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
                } else {
                    details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
                }
                res.render('settings', details);
            } else if (req.body.display_name.length > 16) {
                var details = {
                    flag: true,
                    error: "Display name is too long!",
                    displayName: req.session.displayName,
                    username: req.session.username,
                    user_description: req.session.userdescription,
                    following: req.session.following,
                    followers: req.session.followers,
                    joindate: req.session.joindate
                };
                if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
                    details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
                } else {
                    details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
                }
                res.render('settings', details);
            } else if (req.body.username.length < 3) {
                var details = {
                    flag: true,
                    error: "Username is too short!",
                    displayName: req.session.displayName,
                    username: req.session.username,
                    user_description: req.session.userdescription,
                    following: req.session.following,
                    followers: req.session.followers,
                    joindate: req.session.joindate
                };
                if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
                    details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
                } else {
                    details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
                }
                res.render('settings', details);
            } else if (req.body.username.length > 16) {
                var details = {
                    flag: true,
                    error: "Username is too long!",
                    displayName: req.session.displayName,
                    username: req.session.username,
                    user_description: req.session.userdescription,
                    following: req.session.following,
                    followers: req.session.followers,
                    joindate: req.session.joindate
                };
                if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
                    details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
                } else {
                    details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
                }
                res.render('settings', details);
            } else if (req.body.username.indexOf(' ') >= 0) {
                var details = {
                    flag: true,
                    error: "Username cannot contain spaces!",
                    displayName: req.session.displayName,
                    username: req.session.username,
                    user_description: req.session.userdescription,
                    following: req.session.following,
                    followers: req.session.followers,
                    joindate: req.session.joindate
                };
                if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
                    details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
                } else {
                    details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
                }
                res.render('settings', details);
            } else if (!req.body.username.match("^(?=.{3,16}$)[a-zA-Z0-9_]+$")) {
                var details = {
                    flag: true,
                    error: "Username can only contain alphanumeric characters and underscores!",
                    displayName: req.session.displayName,
                    username: req.session.username,
                    user_description: req.session.userdescription,
                    following: req.session.following,
                    followers: req.session.followers,
                    joindate: req.session.joindate
                };
                if (fs.existsSync('public/images/' + req.session.userId.toString() + '.png')) {
                    details.profilePicture = '/images/' + req.session.userId.toString() + '.png';
                } else {
                    details.profilePicture = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + req.session.userId.toString();
                }
                res.render('settings', details);
            } else {
                var update = {
                    displayName: req.body.display_name,
                    username: req.body.username,
                    userdescription: req.body.user_description
                }

                req.session.displayName = update.displayName;
                req.session.username = update.username;
                req.session.userdescription = update.userdescription;

                if (req.body.new_password != '') {
                    bcrypt.hash(req.body.new_password, 10, function (err, hash) {
                        update.password = hash;
                        req.session.password = hash;
                    });
                }

                await db.updateOne(User, {_id: req.session.userId}, update);

                res.status(200);
                res.redirect('/settings');
            }
        });

        //if (passEqual == false) return;

        /*upload.single('file')(req, res, async (err) => {
            if(err){
                // handle error
                res.status(500).send({ error: err.message });
            }
            else{
                // File is uploaded successfully
                // req.file contains the information of the uploaded file
                const user = await db.findOne(User, query);
                //console.log(user);
                
                //var result = await db.findOne(User, query, projection);

                if(user){
                    var condition = {$set: 
                        {
                            profilePicture: req.file.filename
                        }
                    };

                  //  user.profileImage = req.file.filename;
                  //  console.log(user.profileImage);
                    await db.updateOne(User, query, condition);

                    const user = await db.findOne(User, query);
                    req.session.profilePicture = user.profilePicture;
                    //console.log(user);
                    res.render('settings');
                }
                else{
                    res.status(404).send({ error: 'User not found.' });
                }
            }
        });*/
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
    },

    checkUsername: function(req, res) {
        db.findOne(User, {username: req.query.username}, 'username').then(function(result) {
            res.send(result);
        });
    },

    checkUsernameAsync: async function(req, res) {
        await db.findOne(User, {username: req.query.username}, 'username').then(function(result) {
            res.send(result);
        });
    }
}

/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = profileController;
