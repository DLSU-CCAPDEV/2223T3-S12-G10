
// import module `mongoose`
var mongoose = require('mongoose');

// defines the schema for collection `users`
var UserSchema = new mongoose.Schema({
    true_name: {
        type: mongoose.ObjectId,
        unique: true,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    joindate: {type: Date}, //this is formatted as YYYY-MM-DD
    userdescription: String,
    following: [{type: mongoose.ObjectId}],
    followers: [{type: mongoose.ObjectId}]
});



/*
    exports a mongoose.model object based on `UserSchema` (defined above)
    when another script exports from this file
    This model executes CRUD operations
    to collection `users` -> plural of the argument `User`
*/
module.exports = mongoose.model('User', UserSchema);
