//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//Session section 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
//Passport initialize
app.use(passport.initialize());
app.use(passport.session());




//Mongoose section

mongoose.connect(process.env.DATABASE_POSTS, {useNewUrlParser:true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
//Posts schema and models 
const postSchema ={
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);

//Users schema and models, config with passport
const userSchema = new mongoose.Schema({
  username : String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

//Passport
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//Pre variables section

const homeStartingContent = "This is a basic blog project, here i'm making a daily journal and i'm gonna post some updates on my projects";
const aboutContent = "I'm just a fullstack student.";
const contactContent = "You can contact-me at: matheus_carvalho2@hotmail.com";


//Render pages section
app.get("/",function(req,res){
  Post.find({}, function(err, posts){
    res.render("home",{startC:homeStartingContent,postContent:posts})
  })
});
app.get("/about", function(req,res){
  res.render("about",{aboutC:aboutContent})
});
app.get("/contact", function(req,res){
  res.render("contact",{contactC:contactContent})
});
app.get("/compose", function(req,res){
    if(req.isAuthenticated()){
      res.render('compose');
    }else{
      res.redirect("/login");
    }
  
});

app.get("/posts/:postId", function(req,res){
    const requeredPostId = req.params.postId;
    Post.findOne({_id:requeredPostId}, function(err,post){
      res.render("post", {
        title:post.title,
        content:post.content
      })
    })
  });
//Login route
app.get('/login', function(req,res){
  res.render('login')
});

app.post('/login', function(req,res){
  const user = new User({
    username: req.body.username,
    password : req.body.password
  });
  req.login(user, function(err){
    if(err){console.log(err)
    }else{passport.authenticate("local")(req,res, function(){
      res.redirect('/compose')
    })}
  })

});

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/')
})

//Post section
app.post("/cp", function(req,res){
 if(req.isAuthenticated()){
  const post = new Post ({
    title : req.body.titleContent,
    content : req.body.textContent
  })
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
 }else{
   res.redirect('/login')
 }
})
//Functions to update and delete
function editThePost(id,title,text){
    Post.update(
      {_id: id},
      {title: title, content: text},
      {overwrite: true},
      function(err){
        if(!err){return}else{console.log(err)};
      }
    )
}
function deleteThePost(id){
  Post.deleteOne({_id:id}, function(err){ if(!err){return} else{console.log(err)}})
}

//Edit post
app.post("/patch", function(req,res){
  const editId = req.body.postId;
  const editTitle = req.body.postTitle;
  const editText = req.body.textContent;
  if(req.isAuthenticated()){
    editThePost(editId, editTitle,editText);
    res.send("Updated the post")
  }
});
;
//Delete post
app.post("/delete", function(req,res){
  const deleteId = req.body.deleteId;
if(req.isAuthenticated()){
  deleteThePost(deleteId)
  res.send("Deleted the post")
}else{
  res.redirect('/login')
}
})

//Listen section
let port = process.env.PORT;
if (port == null || port== ""){
  port = 3000;
}
app.listen(port,function(){console.log("server started")});
