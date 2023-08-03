
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const Post = require('../models/postmodel.js');

const User = require('../models/usermodel.js');

const Comment = require('../models/commentmodel.js');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const moment = require('moment');

const marked = require('marked');

marked.use({
    mangle: false,
    headerIds: false
});

//let limit = 0;
/*
    defines an object which contains functions executed as callback
    when a client requests for `profile` paths in the server
*/
const postController = {
    /*
        executed when the client sends an HTTP GET request `/profile/:idNum`
        as defined in `../routes/routes.js`
        To be used for GETTING posts
    */

    getManyPosts: async function (req, res) {

        if (!req.session.username) {
            res.render('login');
            return;
        }

        // find post via title
        //var query = {postTitle: req.params.postTitle};
        //empty query
        var query = {}; //empty for testing
        //console.log(req.params);
        // fields to be returned
        //get the entire thing
        var projection = '';

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function searches the collection `users`
            based on the value set in object `query`
            the third parameter is a string containing fields to be returned
        */
       //limit is how many  documents it'll find, use skiplimited when loading MORE documents
         //placeholder\
        let limit = 0;
        var results = await db.limitedFindReverse(Post, query, projection, limit); //limiting works
        //limit = limit + 5;

        console.log('Limit variable testing: ' + limit);   
        console.log('Results lenght: ' + results.length);

        /*
            if the user exists in the database
            render the profile page with their details
        */
        if(results != null) {
            console.log("Nonnull result");
            //console.log(results);
            //console.log(results.postTags);
            // results.postText = DOMPurify.sanitize(marked.parse(results.postText));
            // results.postText = postText;
            // let votes = [];
            for(let i = 0; i < results.length; i++) {
                if (results[i]._doc.postText != null || results[i]._doc.postText != undefined) {
                    results[i]._doc.postText = DOMPurify.sanitize(marked.parse(results[i]._doc.postText));
                }
                if (results[i]._doc.upvotes.length != 0 || results[i]._doc.downvotes.length != 0) {
                    //calculate the votes
                    var votecount = results[i]._doc.upvotes.length - results[i]._doc.downvotes.length;
                    // votes.push(votecount);
                    results[i].votes = votecount;
                } else {
                    //both are 0
                    var votecount = 0;
                    // votes.push (votecount);
                    results[i].votes = votecount;
                }

                var currentuser = await db.findOne(User, {username: req.session.username}, '_id');
                
                if (results[i].upvotes.includes(currentuser.id)) {
                    results[i].upvoted = true;
                    results[i].downvoted = false;
                    results[i].notvoted = false;
                } else if (results[i].downvotes.includes(currentuser.id)) {
                    results[i].downvoted = true;
                    results[i].upvoted = false;
                    results[i].notvoted = false;
                } else {
                    results[i].downvoted = false;
                    results[i].upvoted = false;
                    results[i].notvoted = true;
                }
            // console.log(votes[0]);
                await db.findOne(User, {_id: results[i]._doc.postUserId}, 'username')
                    .then(function(result) {
                        console.log(result);
                        // results[i]._doc.postUserId = result.username;
                        results[i].username = result.username;
                    });
                await db.findMany(Comment, {CommentPostId: results[i]._doc._id}, '_id')
                    .then(function(result) {
                        results[i].commentcount = result.length;
                    })
            }
            var details = {
                post: results,
                displayName: req.session.displayName,
                username: req.session.username,
                following: req.session.following,
                followers: req.session.followers,
                joindate: req.session.joindate,
                postUserId: req.session.userId,
                profilePicture: req.session.profilePicture
            }

            console.log(details);
            //pass the entire thing
            // render `../views/profile.hbs`
            res.render('conv_index', details);
        }

        /*
            if the user does not exist in the database
            render the error page
        */
        else {
            console.log("Getting Post Ended in Failure.")
            res.render('error');
        }
    },

    getOnePost: async function (req, res) {
        // find post via title
        //var query = {postTitle: req.params.postTitle};
        var query = {_id: req.params._id};
        // console.log(req.params);
        // fields to be returned
        //get the entire thing
        var projection = '';

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function searches the collection `users`
            based on the value set in object `query`
            the third parameter is a string containing fields to be returned
        */
       //limit is how many  documents it'll find, use skiplimited when loading MORE documents
        //Finds the post
        let limit = 0;
        var results = await db.limitedFind(Post, query, projection, limit); //limiting works
        if (results[0]._doc.upvotes.length != 0 || results[0]._doc.downvotes.length != 0) {
            //calculate the votes
            var votecount = results[0]._doc.upvotes.length - results[0]._doc.downvotes.length;
            // votes.push(votecount);
            results[0].votes = votecount;
        } else {
            //both are 0
            var votecount = 0;
            // votes.push (votecount);
            results[0].votes = votecount;
        }

        var currentuser = await db.findOne(User, {username: req.session.username}, '_id');
        if (results[0].postUserId == currentuser.id) {
            results[0].editablePost = true;
        } else {
            results[0].editablePost = false;
        }
        // upvoted or downvoted already
        if (results[0].upvotes.includes(currentuser.id)) {
            results[0].upvoted = true;
            results[0].downvoted = false;
            results[0].notvoted = false;
        } else if (results[0].downvotes.includes(currentuser.id)) {
            results[0].downvoted = true;
            results[0].upvoted = false;
            results[0].notvoted = false;
        } else {
            results[0].downvoted = false;
            results[0].upvoted = false;
            results[0].notvoted = true;
        }

        var commentcount = await db.findMany(Comment, {CommentPostId: req.params._id}, '_id');
        if (commentcount != null) {
            results[0].commentcount = commentcount.length;
        } else {
            results[0].commentcount = 0;
        }
        
        

        //find the parent comments
        query = {ParentComment:{ $eq: null}, CommentPostId: req.params._id };
        projection = '';
        var comments = await db.limitedFindReverse(Comment, query, projection, limit);
        for (let i = 0; i < comments.length; i++) {
            if(comments[i].CommentUserId == currentuser.id) {
                comments[i].editableComment = true;
            } else {
                comments[i].editableComment = false;
            }
        }

        // //find the replies
        // query = {ParentComment: {$ne: null}, CommentPostId: req.params._id};
        // projection = '';
        // var replies = await db.findMany(Comment, query, projection);


        /*
            if the user exists in the database
            render the profile page with their details
        */
        if(results != null) {
            await db.findOne(User, {_id: results[0]._doc.postUserId}, 'username')
                    .then(function(result) {
                        console.log(result);
                        results[0].username = result.username;
                    });

            results[0]._doc.postText = marked.parse(results[0]._doc.postText);
            
            // results.postText = DOMPurify.sanitize(marked.parse(results.postText))
            if(comments != null) {
                for (let i = 0; i < comments.length; i++) {
                    if (comments[i]._doc.postText != null || comments[i]._doc.postText != undefined) {
                        comments[i]._doc.postText = comments.parse(results[i]._doc.postText);
                    }
                    if (comments[i]._doc.upvotes.length != 0 || comments[i]._doc.downvotes.length != 0) {
                        //calculate the votes
                        var votecount = comments[i]._doc.upvotes.length - comments[i]._doc.downvotes.length;
                        // votes.push(votecount);
                        comments[i].votes = votecount;
                    } else {
                        //both are 0
                        var votecount = 0;
                        // votes.push (votecount);
                        comments[i].votes = votecount;
                    }
                    await db.findOne(User, {_id: comments[i]._doc.CommentUserId}, 'username')
                    .then(function(result) {
                        comments[i]._doc.CommentUserId = result.username;
                    });
                    //check if upvoted/downvoted already
                    if (comments[i].upvotes.includes(currentuser.id)) {
                        comments[i].upvoted = true;
                        comments[i].downvoted = false;
                        comments[i].notvoted = false;
                    } else if (comments[i].downvotes.includes(currentuser.id)) {
                        comments[i].upvoted = false;
                        comments[i].downvoted = true;
                        comments[i].notvoted = false;
                        
                    } else {
                        comments[i].upvoted = false;
                        comments[i].downvoted = false;
                        comments[i].notvoted = true;
                    }
                }
            }

            var details = {
                post: results,
                comments: comments,
                username: req.session.username,
                following: req.session.following,
                followers: req.session.followers,
                joindate: req.session.joindate,
            }
            //console.log(details;
            //pass the entire thing
            // render `../views/profile.hbs`
            res.render('singlepost', details);
        }

        /*
            if the user does not exist in the database
            render the error page
        */
        else {
            console.log("Getting Post Ended in Failure.")
            res.render('error');
        }
    },

    getFollowedPosts: async function (req, res) {
        var userId = req.session._id;

        var query = {_id: userId};

        var projection = 'followed'; //get the followed array

        var response = await db.findOne(User, query, projection);

        if(response != null) {
            //get all of the posts from those people
            var followedposts = [];

            for(let i = 0; i < response.length; i++) {
                var query2 = {postUserId: response[i]._id};
                var results = await db.findMany(Post, query2, projection);

                followedposts.push(results);
            }

            res.render('/followedposts', followedposts);
        }
        else {
            res.render('error')
        }
 
    },

    postPost: async function (req, res) {
        //for posting posts
        const date = new Date();
        //assign variables
        //var postUserId = req.body.postUserId;
        var postTitle = req.body.postTitle;
        var postDate = date.getUTCDate();
        var postText = req.body.postContent;
        //process the tags
        var parsedTags = req.body.postTags.trim().split(',');
        
        var postTags = parsedTags;

        console.log("postTags content is: " + postTags);
        //upvotes and downvotes are defaulted to 0;
        var post = {
            postUserId: req.session.userId,
            postTitle: postTitle,
            date: postDate,
            postText: postText,
            postTags: postTags
        };

        var response = await db.insertOne(Post, post);
        if(response != null) {
            console.log('Posting SUCCCESSFUL!');
            console.log('Data Confirmation');
            console.log('------------------');
            console.log('Post-Title: ' + postTitle);
            console.log('Post-Date: ' + date.getUTCDate());
            
            res.redirect('/');
        }
        else {
            res.render('error');
        }
    
    },

    searchPost: async function (req, res) {
        let postSearch = req.params.postSearch;
        var query = {postTitle: {$regex: '.*' + postSearch + '.*'} };
        console.log('The postSearch is: ' + postSearch);
        var projection = '';

        //await MyModel.find({ name: /john/i }, 'name friends').exec();0
        var results = await db.findMany(Post, query, projection);

        if (results != null) {
            //there are posts similar in name to the search query
            // var details = {
            //     post: results
            // };

            console.log('Redirect URL: '+'/search?postSearch=' + postSearch );
            res.redirect('/search/searchedPosts?postSearch=' + postSearch); //
            
            // res.render('searched_posts', details);
        }
        else {
            console.log('There are no posts with similar names')
        }

    },

    getSearchedPosts: async function (req, res) {
        console.log('Secondary Search Accessed...');
        var query = {postTitle: {$regex: new RegExp('.*' + req.query.postSearch + '.*', 'i') } };
        console.log("postSearch is: " + req.query.postSearch);
        var projection = '';

        var results = await db.findMany(Post, query, projection);

        if (results.length != 0 ) {
            //there are posts similar in name to the search query
            console.log("query: "+ query.postTitle);
            var details = {
                post: results
            };
            res.render('searched_posts', details);
            console.log(details);
        }
        else {
            var details = {};
            console.log('There are no posts with similar names');
            console.log(details);
            res.render('searched_posts', details);
        }

    },

    //For Editing the post
    updatePost: async function (req, res) {
        //req.body
        var filter = {_id: req.body.postID};
        
        var editedTitle = req.body.editedTitle;
        var editedText = req.body.editedText;
        var editedTags = req.body.editedTags;

        var update = {
            postTitle: editedTitle,
            postText: editedText,
            postTags: editedTags
        }
        
        //find the specific post and update it
        var response = await db.updateOne(Post, filter, update);

        if (response != null) {
            //stuff, re-render the post with the changes basically
        }
    },

    updateReply: async function (req, res) {
        //req.body
        var userID = await db.findOne(User, {username: req.session.username}, '_id');
        // var commentID = await db.findOne(Comment, {CommentUserId: userID}, '');
        var filter = {_id: req.body.commentID};
        var editedText = req.body.editedText;
        console.log('Comment ID is: ' + filter);

        var update = {
            Body: editedText,
        }
        
        //find the specific post and update it
        var response = await db.updateOne(Comment, filter, update);

        if (response != null) {
            //stuff, re-render the post with the changes basically
            //test
            res.redirect('back');
        }
    },

    //for posting comment, not sure how it's gonna get called
    postComment: async function (req, res) {
        //assuming this is coming from /post/:_id
        
        var text = req.body.Body;
        var postID = req.body.postID;
        var userID = await db.findOne(User, {username: req.session.username}, '_id');

        var comment = {
            CommentUserId: userID,
            CommentPostId: postID,
            Body: text,
        };

        //console.log(comment);

        var response = await db.insertOne(Comment, comment);

        if (response != null) {
            //console.log('Comment: ' + response);
            res.status(205).redirect('/post/' + postID);
        }
    },

    postReply: async function (req, res) {
        //
        var userID = await db.findOne(User, {username: req.session.username}, '_id');
        var parentID = req.body.parentID;
        var postID = req.body.postID;
        var replyText = req.body.Body;

        var reply = {
            CommentUserId: userID,
            CommentPostId: postID,
            ParentComment: parentID,
            Body: replyText
        };

        var response = await db.insertOne(Comment, reply);

        if (response != null) {
            res.redirect('/post/' + postID);
        }
    },

    //for generating replies
    getReplies: async function (req, res) {
        var commentID = req.query.commentID;
        // console.log('CommentID is: ' + commentID);
        var currentuser = await db.findOne(User, {username: req.session.username}, '_id');
        //find the replies whose parent are the comment's
        var query = {ParentComment: commentID};
        var projection = '-CommentPostId';
        var response = await db.findMany(Comment , query, projection);

        var usernames = [];
        //get their usernames
        for(let i = 0; i < response.length; i++) {
            //search for the username and push it into an array
            var namequery = {_id: response[i].CommentUserId};
            var want = 'username';

            var username = await db.findOne(User, namequery, want);

            usernames.push(username);

            //convert the dates as well
            var format = "MM/DD/YYYY, HH:mm:ss A";
            response[i]._doc.Date = moment(response[i]._doc.Date).format(format);

            if(response[i].CommentUserId == currentuser.id) {
                response[i]._doc.editableReply= true;
            } else {
                response[i]._doc.editableReply = false;
            }
        }

        var details = {
            replies: response,
            usernames: usernames
        };

        if (response != null) {
            //if they have replies then return that data 
            //it will be rendered via javascript
            return res.status(200).send(details);
        }
        else {
            console.log('Comment has no replies.')
        }
    },

    //for voting
    postUpvote: async function (req, res) {
        //check if the user has already upvoted/downvoted the post before
        //queries: get the specific post, check if the user is in upvote or downvote
        var username = req.session.username;
        var finduser = await db.findOne(User, {username: username}, '_id');
        var userID = finduser._doc._id;
        var postID = req.body.postID;
        // var query = {_id: postID, $or:[{upvotes: userID}, {downvotes: userID}]};//
        var query = {_id: postID}; 

        //checker
        console.log('UserID is ' + userID);
        //get the upvotes and downvotes only
        var projection ='upvotes downvotes';
        var voted = await db.findOne(Post, query, projection);


        //user has interacted already
        if(voted != null) {
            //has upvotedset
            //decision for upvote or downvote
            if (voted.upvotes.includes(userID) == true && voted.downvotes.includes(userID) == false) {
                //user has already upvoted and is trying to upvote again
                var removalquery = {_id: postID};
                var condition = {$pullAll: {upvotes: [{_id: userID}]} };
                //remove the user from upvotes
                var removal = await db.updateOne(Post, removalquery, condition);
                if (removal != null) {
                    //redirect to page to refresh it
                    res.status(205);
                } else {
                    res.render('error');
                }
            }
            else if ((voted.upvotes.includes(userID) == false) && (voted.downvotes.includes(userID) == true)) {
                //downvoted -> upvote 
                var removalquery = {_id: postID};
                var pull = {$pullAll: {downvotes: [{_id: userID}]} };
                //remove the user from upvotes
                var removal = await db.updateOne(Post, removalquery, pull);

                if (removal != null) {
                    //add to upvote
                    var addquery = {_id: postID};
                    var push = {$push: {upvotes: [{_id: userID}]} };
                    var addition = await db.updateOne(Post, addquery, push)
                    if (addition != null) {
                        res.status(205);
                    } else {
                        res.render('error');
                    }
                }
                else {
                    res.render('error');
                }
            }
            else {
                //user has not yet upvoted/downvoted the post
                var query = {_id: postID};
                var push = {$push: {upvotes: [{_id: userID}]} };
                var addition = await db.updateOne(Post, query, push)
                //re-render the page
                if (addition != null) {
                    res.status(205);
                }
            }
        } else {
            //error message, 
        }
    },

    postDownvote: async function (req, res) {
        //check if the user has already upvoted/downvoted the post before
        //queries: get the specific post, check if the user is in upvote or downvote
        var username = req.session.username;
        var finduser = await db.findOne(User, {username: username}, '_id');
        var userID = finduser._doc._id;
        var postID = req.body.postID;
        // var query = {_id: postID, $or:[{upvotes: userID}, {downvotes: userID}]};//
        var query = {_id: postID}; 

        //get the upvotes and downvotes only
        var projection ='upvotes downvotes';
        var voted = await db.findOne(Post, query, projection);


        //user has interacted already
        if(voted != null) {
            //has downvote set
            if (voted.upvotes.includes(userID) == false && voted.downvotes.includes(userID) == true) {
                //downvote -> none
                var removalquery = {_id: postID};
                var condition = {$pullAll: {downvotes: [{_id: userID}]} };
                //remove the user from upvotes
                var removal = await db.updateOne(Post, removalquery, condition);
                if (removal != null) {
                    //redirect to page to refresh it
                    res.status(205);
                } else {
                    res.render('error');
                }
            }
            else if ((voted.upvotes.includes(userID) == true) && (voted.downvotes.includes(userID) == false)) {
                //upvoted -> downvote
                var removalquery = {_id: postID};
                var pull = {$pullAll: {upvotes: [{_id: userID}]} };
                //remove the user from upvotes
                var removal = await db.updateOne(Post, removalquery, pull);

                if (removal != null) {
                    //add to upvote
                    var addquery = {_id: postID};
                    var push = {$push: {downvotes: [{_id: userID}]} };
                    var addition = await db.updateOne(Post, addquery, push)
                    if (addition != null) {
                        res.status(205);
                    } else {
                        res.render('error');
                    }
                }
                else {
                    res.render('error');
                }
            }
            else {
                //user has not yet upvoted/downvoted the post
                var query = {_id: postID};
                var push = {$push: {downvotes: [{_id: userID}]} };
                var addition = await db.updateOne(Post, query, push)
                //re-render the page
                if (addition != null) {
                    res.status(205);
                }
            }
        } else {
            //error message, 
            res.render('error');
        }
    },
    commentUpvote: async function (req, res) {
        //check if the user has already upvoted/downvoted the post before
        //queries: get the specific post, check if the user is in upvote or downvote
        var username = req.session.username;
        var finduser = await db.findOne(User, {username: username}, '_id');
        var userID = finduser._doc._id;
        var commentID = req.body.commentID;
        // var query = {_id: postID, $or:[{upvotes: userID}, {downvotes: userID}]};//
        var query = {_id: commentID}; 

        //get the upvotes and downvotes only
        var projection ='upvotes downvotes';
        var voted = await db.findOne(Comment, query, projection);


        //user has interacted already
        if(voted != null) {
            //has upvotedset
            //decision for upvote or downvote
            if (voted.upvotes.includes(userID) == true && voted.downvotes.includes(userID) == false) {
                //user has already upvoted and is trying to upvote again
                var removalquery = {_id: commentID};
                var condition = {$pullAll: {upvotes: [{_id: userID}]} };
                //remove the user from upvotes
                var removal = await db.updateOne(Comment, removalquery, condition);
                if (removal != null) {
                    //redirect to page to refresh it
                    res.status(205);
                } else {
                    res.render('error');
                }
            }
            else if ((voted.upvotes.includes(userID) == false) && (voted.downvotes.includes(userID) == true)) {
                //downvoted -> upvote 
                var removalquery = {_id: commentID};
                var pull = {$pullAll: {downvotes: [{_id: userID}]} };
                //remove the user from upvotes
                var removal = await db.updateOne(Comment, removalquery, pull);

                if (removal != null) {
                    //add to upvote
                    var addquery = {_id: commentID};
                    var push = {$push: {upvotes: [{_id: userID}]} };
                    var addition = await db.updateOne(Comment, addquery, push)
                    if (addition != null) {
                        res.status(205);
                    } else {
                        res.render('error');
                    }
                }
                else {
                    res.render('error');
                }
            }
            else {
                //user has not yet upvoted/downvoted the post
                var query = {_id: commentID};
                var push = {$push: {upvotes: [{_id: userID}]} };
                var addition = await db.updateOne(Comment, query, push)
                //re-render the page
                if (addition != null) {
                    res.status(205);
                }
            }
        } else {
            //error message, 
            res.render('error');
        }
    },
    commentDownvote: async function (req, res) {
        //check if the user has already upvoted/downvoted the post before
        //queries: get the specific post, check if the user is in upvote or downvote
        var username = req.session.username;
        var finduser = await db.findOne(User, {username: username}, '_id');
        var userID = finduser._doc._id;
        var commentID = req.body.commentID;
        // var query = {_id: postID, $or:[{upvotes: userID}, {downvotes: userID}]};//
        var query = {_id: commentID}; 

        //get the upvotes and downvotes only
        var projection ='upvotes downvotes';
        var voted = await db.findOne(Comment, query, projection);


        //user has interacted already
        if(voted != null) {
            //has downvote set
            if (voted.upvotes.includes(userID) == false && voted.downvotes.includes(userID) == true) {
                //downvote -> none
                var removalquery = {_id: commentID};
                var condition = {$pullAll: {downvotes: [{_id: userID}]} };
                //remove the user from upvotes
                var removal = await db.updateOne(Comment, removalquery, condition);
                if (removal != null) {
                    //redirect to page to refresh it
                    res.status(205);
                } else {
                    res.render('error');
                }
            }
            else if ((voted.upvotes.includes(userID) == true) && (voted.downvotes.includes(userID) == false)) {
                //upvoted -> downvote
                var removalquery = {_id: commentID};
                var pull = {$pullAll: {upvotes: [{_id: userID}]} };
                //remove the user from upvotes
                var removal = await db.updateOne(Comment, removalquery, pull);

                if (removal != null) {
                    //add to upvote
                    var addquery = {_id: commentID};
                    var push = {$push: {downvotes: [{_id: userID}]} };
                    var addition = await db.updateOne(Comment, addquery, push)
                    if (addition != null) {
                        res.status(205);
                    } else {
                        res.render('error');
                    }
                }
                else {
                    res.render('error');
                }
            }
            else {
                //user has not yet upvoted/downvoted the post
                var query = {_id: commentID};
                var push = {$push: {downvotes: [{_id: userID}]} };
                var addition = await db.updateOne(Comment, query, push)
                //re-render the page
                if (addition != null) {
                    res.status(205);
                }
            }
        } else {
            //error message, 
            res.render('error');
        }
    },

    // postReply: async function (req, res) {
    //     //
    //     var parentID = req.body.parentID;
    //     var postID = req.body.postID;
    //     var replyText = req.body.Body;

    //     var reply = {
    //         CommentPostId: postID,
    //         ParentComment: parentID,
    //         Body: replyText
    //     };

    //     console.log('Reply: ' + reply);

    //     var response = await db.insertOne(Comment, reply);

    //     if (response != null) {
    //         console.log('Reply: ' + reply);
    //         res.redirect('/post/' + postID);
    //     }
    // },

    //deleting stuff
    postDelete: async function(req, res) {
        //not a true delete
        //id somehow
        var filter = {_id: req.body.postID};
       //console.log(filter);
   
        //console.log(postID);

        var condition = {$set: 
            {
                postTitle: 'Deleted Post', 
                postText: "Post has been deleted",
                postTags: []
            }
        };
        
        console.log(condition);
        var response = await db.updateOne(Post, filter, condition);

        if (response != null) {
            console.log("A post has been deleted.")
        }
    },

    replyDelete: async function(req, res) {
        var filter = {_id: req.body.replyID};
    
        console.log(filter);
    
        var condition = {$set: 
            {
                Body: "This comment has been deleted.",
            }
        };
    
        console.log(condition);
        var response = await db.updateOne(Comment, filter, condition);
    
        if (response != null) {
            console.log("A comment has been deleted.")
        }
    }
    

}

/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = postController;
