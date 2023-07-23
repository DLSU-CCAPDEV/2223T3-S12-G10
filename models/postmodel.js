
var mongoose = require('mongoose');

//posts
var PostSchema = new mongoose.Schema({
    postUserId: {type: mongoose.ObjectId},
    postTitle: String,
    date: {type:Date},
    postText: String,
    postTags: [{type: String}],
    upvotes: [{type: mongoose.ObjectId}],
    downvotes: [{type: mongoose.ObjectId}]
});

module.exports = mongoose.model('Post', PostSchema)