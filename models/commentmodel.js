var mongoose = require('mongoose');

//comments
var CommentSchema = new mongoose.Schema({
    Date: {type:Date},
    CommentUserId: {type: mongoose.ObjectId},
    CommentPostId: {type: mongoose.ObjectId}, //tracks which post it belongs to
    Body: String,
    upvotes: [{type: mongoose.ObjectId}],
    downvotes: [{type: mongoose.ObjectId}],
    ParentComment: {type: mongoose.ObjectId}
});

module.exports = mongoose.model('Comment', CommentSchema);
