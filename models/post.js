const mongoose = require('mongoose');

// connect with atlas via mongoose
mongoose.connect('link');

// create schema
const postSchema = mongoose.Schema({
    content: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "user"
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

// export schema
module.exports = mongoose.model('post', postSchema);
