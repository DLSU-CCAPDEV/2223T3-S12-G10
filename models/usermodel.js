
// import module `mongoose`
var mongoose = require('mongoose');

// defines the schema for collection `users`
var UserSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    joindate: {type: Date}, //this is formatted as YYYY-MM-DD
    userdescription: String,
    following: [{type: mongoose.ObjectId}],
    followers: [{type: mongoose.ObjectId}],
    profilePicture: String
});



/*
    exports a mongoose.model object based on `UserSchema` (defined above)
    when another script exports from this file
    This model executes CRUD operations
    to collection `users` -> plural of the argument `User`
*/
module.exports = mongoose.model('User', UserSchema);
