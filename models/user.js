const mongoose = require('mongoose');

// connect with atlas via mongoose
mongoose.connect('mongodb+srv://obaidullahzeb182:obaid123@cluster0.chrpiit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

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