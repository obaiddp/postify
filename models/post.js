const mongoose = require('mongoose');

// connect with atlas via mongoose
mongoose.connect('mongodb+srv://obaidullahzeb182:obaid123@cluster0.chrpiit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

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