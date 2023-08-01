
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const Post = require('../models/postmodel.js');

const User = require('../models/usermodel.js');

const Comment = require('../models/commentmodel.js');

const marked = require('../node_modules/marked');

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
        var results = await db.limitedFind(Post, query, projection, limit); //limiting works
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
            for(let i = 0; i < results.length; i++) {
                if (results[i]._doc.postText != null || results[i]._doc.postText != undefined) {
                    results[i]._doc.postText = marked.parse(results[i]._doc.postText);
                }
            }
            var details = {
                post: results
            }

            //console.log(details;
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
        //empty query
        var query = {_id: req.params._id}; //empty for testing
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
        //limit = limit + 5;

        //find the parent comments
        query = {ParentComment:{ $eq: null}, CommentPostId: req.params._id };
        projection = '';
        var comments = await db.findMany(Comment, query, projection);

        //find the replies
        query = {ParentComment: {$ne: null}, CommentPostId: req.params._id};
        projection = '';
        var replies = await db.findMany(Comment, query, projection);


        /*
            if the user exists in the database
            render the profile page with their details
        */
        if(results != null) {
            console.log("Nonnull result");
            //console.log(results);
            //console.log(results.postTags);

            //sconsole.log(results[0]._doc.postText);

            results[0]._doc.postText = marked.parse(results[0]._doc.postText);
            
            // results.postText = DOMPurify.sanitize(marked.parse(results.postText))

            var details = {
                post: results,
                comments: comments,
                replies: replies
            }
            console.log('Comments that are replies: ' + replies);
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
        var filter = {_id: req.body.commentID};
        var editedText = req.body.editedText;
        console.log('Comment ID is: ' + filter);
        var update = {
            Body: editedText,
        }
        
        //find the specific post and update it
        var response = await db.updateOne(Post, filter, update);

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

        var comment = {
            // commentUserId: req.session._id
            CommentPostId: postID,
            Body: text,
        };

        //console.log(comment);

        var response = await db.insertOne(Comment, comment);

        if (response != null) {
            //console.log('Comment: ' + response);
            await res.redirect('/post/' + postID);
        }
    },

    postReply: async function (req, res) {
        //
        var parentID = req.body.parentID;
        var postID = req.body.postID;
        var replyText = req.body.Body;

        var reply = {
            CommentPostId: postID,
            ParentComment: parentID,
            Body: replyText
        };

        console.log('Reply: ' + reply);

        var response = await db.insertOne(Comment, reply);

        if (response != null) {
            console.log('Reply: ' + reply);
            res.redirect('/post/' + postID);
        }
    },

    //for generating replies
    getReplies: async function (req, res) {
        var commentID = req.query.commentID;
        console.log('CommentID is: ' + commentID);

        //find the replies whose parent are these comments
        var query = {ParentComment: commentID};
        var projection = '';

        var response = await db.findMany(Comment , query, projection);

        if (response != null) {
            //if they have replies then return that data 
            //it will be rendered via javascript
            return res.status(200).send(response);
        }
        else {
            console.log('Comment has no replies.')
        }
    },

    //for voting
    postVote: async function (req, res) {
        //check if the user has already upvoted/downvoted the post before
        //queries: get the specific post, check if the user is in upvote or downvote
        var userID = req.session._id;
        var query = {_id: req.body._id, $or:[{upvotes: userID}, {downvotes: userID}]};//

        //get the upvotes and downvotes only
        var projection ='upvotes downvotes';
        var voted = await db.findOne(Post, query,projection);

        if(voted != null) {
            //decision for upvote or downvote
            if (voted.upvotes.inlcudes(userID)) {
                //user has already upvoted and is trying to upvote again
                if (upvote) {
                    var removalquery = {_id: req.body._id};
                    var condition = {$pullAll: {upvotes: [{_id: userID}]} };
                    var removal = await db.updateOne(Post, removalquery, condition);
                    if(removal != null) {
                        //update the page
                    }
                }
                else {
                    //upvote -> downvote
                    var removalquery = {_id: req.body._id};
                    var condition = {$pullAll: {upvotes: [{_id: userID}]} };
                    var removal = await db.updateOne(Post, removalquery, condition);

                    if (removal != null) {
                        //add to downvote
                        var addquery = {_id: req.body._id};
                        var condition = {$push:{downvotes: {_id: userID} }};
                        var downvote = await db.updateOne(Post, addquery, condition);
                    }
                }
            }
            else if (voted.downvotes.includes(userID)) {
                //downvote to downvote
                if(downvote) {
                    var removalquery = {_id: req.body._id};
                    var condition = {$pullAll: {downvotes: [{_id: userID}]} };
                    var removal = await db.updateOne(Post, removalquery, condition);
                    if(removal != null) {
                        //update the page
                    }
                }
                else {
                    //downvote -> upvote
                    var removalquery = {_id: req.body._id};
                    var condition = {$pullAll: {downvotes: [{_id: userID}]} };
                    var removal = await db.updateOne(Post, removalquery, condition);

                    if (removal != null) {
                        //add to downvote
                        var addquery = {_id: req.body._id};
                        var condition = {$push:{upvotes: {_id: userID} }};
                        var upvote = await db.updateOne(Post, addquery, condition);
                    }
                }
            }
        } else {
            //user has yet to vote at all
            if (upvote) {
                var addquery = {_id: req.body._id};
                var condition = {$push:{upvotes: {_id: userID} }};
                var downvote = await db.updateOne(Post, addquery, condition);
            } else {
                //downvote
                var addquery = {_id: req.body._id};
                var condition = {$push:{downvotes: {_id: userID} }};
                var downvote = await db.updateOne(Post, addquery, condition);
            }
        }
    },


    //for posting comment, not sure how it's gonna get called
    postComment: async function (req, res) {
        //assuming this is coming from /post/:_id
        var text = req.body.Body;
        var postID = req.body.postID;
        
        var date = Date();

        var comment = {
            // commentUserId: req.session._id
            CommentPostId: postID,
            Body: text,
            Date: date,
        };

        //console.log(comment);

        var response = await db.insertOne(Comment, comment);

        if (response != null) {
            //console.log('Comment: ' + response);
            await res.redirect('/post/' + postID);
        }
    },

    postReply: async function (req, res) {
        //
        var parentID = req.body.parentID;
        var postID = req.body.postID;
        var replyText = req.body.Body;

        var reply = {
            CommentPostId: postID,
            ParentComment: parentID,
            Body: replyText
        };

        console.log('Reply: ' + reply);

        var response = await db.insertOne(Comment, reply);

        if (response != null) {
            console.log('Reply: ' + reply);
            res.redirect('/post/' + postID);
        }
    },

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
    }

}

/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = postController;
