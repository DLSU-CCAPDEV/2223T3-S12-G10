
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/usermodel.js');

const Post =  require('../models/postmodel.js');

const Comment =  require('../models/commentmodel.js');



const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const Grid = require('gridfs-stream');
const MongoClient = require('mongodb').MongoClient;
const GridFSBucket = require('mongodb').GridFSBucket;


const storage = new GridFsStorage({
  url: 'mongodb+srv://raphaeltanai:nTISUPYixEgncCfN@projectnum1.5vkr5zy.mongodb.net/?retryWrites=true&w=majority',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: Date.now() + filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({ storage });

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
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
        if(result != null) {

            var details = {
                userid: result._id,
                displayName: result.displayName,
                username: result.username,
                followers: result.followers.length,
                following: result.following.length,
                joindate: result.joindate,
                userdescription: result.userdescription,
                profilePicture : result.profilePicture
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

     getSettings: async function (req, res) {
        res.render('settings');
        //const user = await db.findOne(User, { username: 'NewUser1' });
       // console.log(user);
    },   

    postSettings: async function (req, res)  {

        var query = {username: req.session.username};
        console.log(query);
        
        upload.single('file')(req, res, async (err) => {
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
        });
    },

    getImage: async function (req, res) {
      //  console.log(req.params.filename);

        const filename = req.params.filename;
        const dbURI = 'mongodb+srv://raphaeltanai:nTISUPYixEgncCfN@projectnum1.5vkr5zy.mongodb.net/test?retryWrites=true&w=majority';
        const client = await MongoClient.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = client.db('test'); // replace 'test' with the name of your database

        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        const downloadStream = bucket.openDownloadStreamByName(filename);

        downloadStream.on('data', (chunk) => {
          res.write(chunk);
        });

        downloadStream.on('error', () => {
          res.sendStatus(404);
        });

        downloadStream.on('end', () => {
          res.end();
        });
    }


    
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
