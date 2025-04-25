const express = require('express');
const userModel = require('./models/user');
const postModel = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// ============================ Signup
app.get('/', (req, res) => {
    res.render('index');
})

app.post('/create', async (req, res) => {
    let {username, name, age, email, password} = req.body;

    let user = await userModel.findOne({email: email})
    if (user) return res.status(500).send("User already exits");

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username: username,
                name: name,
                age: age,
                email: email,
                password: hash
            });

            // secret key: "shhhh"
            let token = jwt.sign({email: email, userid: createdUser._id}, "shhhh");
            res.cookie("token", token);
            res.send("Registered");
        })
    })
})

// ============================ Login
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    let {email, password} = req.body;

    let user = await userModel.findOne({email: email})
    if (!user) return res.send("Something went wrong");

    bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
            let token = jwt.sign({email: email, userid: user._id}, "shhhh");
            res.cookie("token", token);
            res.redirect("/profile");
        }
        else res.redirect("/login");
    })
})

// ============================ Logout
app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/login'); 
})

// ============================ Profile (Protected route)
app.get('/profile', isLoggedIn, async (req, res) => {
    // instead of postid in posts, whole post will be populated
    let user = await userModel.findOne({email: req.user.email}).populate("posts");
    
    res.render('profile', {user: user});
})

app.post('/post', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    let {content} = req.body;

    let post = await postModel.create({
        user: user._id,
        content: content
    })

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
})

app.get("/likes/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate("user");

    if (post.likes.indexOf(req.user.userid) === -1){
        post.likes.push(req.user.userid);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect("/profile");
})

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id });
    res.render("edit", { post });
}); 

app.post('/update/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content })
    res.redirect("/profile");
})


// ============================ LoggedIn function
/*
function isLoggedIn(req, res, next){
    if (req.cookies.token === "") res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next(); 
    }
}
 */

function isLoggedIn(req, res, next){
    if (!req.cookies.token) return res.redirect("/login");
    try {
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next(); 
    } catch (err) {
        return res.redirect("/login");
    }
}


app.listen(5000, () => {
    console.log("App listening on port 3000");
})

/*
Common HTTP status codes you might use in Express routes:

- 200 - OK: The standard success response for GET requests
- 201 - Created: Successful creation of a resource (POST requests)
- 204 - No Content: Success but nothing to return (often for DELETE operations)
- 400 - Bad Request: The client sent invalid data
- 401 - Unauthorized: Authentication required
- 403 - Forbidden: Authentication succeeded but user lacks permissions
- 404 - Not Found: The requested resource doesn't exist
- 409 - Conflict: Request conflicts with current state (like duplicate entries)
- 500 - Internal Server Error: Something went wrong on the server
*/