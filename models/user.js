const mongoose = require('mongoose');

// connect with atlas via mongoose
mongoose.connect('link');

// create schema
const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'post'
    }]
})

// export schema
module.exports = mongoose.model('user', userSchema);
