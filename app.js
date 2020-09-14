//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//Mongoose section

mongoose.connect("mongodb+srv://adminfordatabase:HRXEFNqNaiYL51AO@blackwork.bkdhb.gcp.mongodb.net/blogDB?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology: true});

const postSchema ={
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);

//Pre variables section

const homeStartingContent = "This is a basic blog project, here i'm making a daily journal and i'm gonna post some updates on my projects";
const aboutContent = "I'm just a fullstack student.";
const contactContent = "You can contact-me at: matheus_carvalho2@hotmail.com";


//Render pages section
app.get("/",function(req,res){
  Post.find({}, function(err, posts){
    res.render("home",{startC:homeStartingContent,postContent:posts})
  })
})
app.get("/about", function(req,res){
  res.render("about",{aboutC:aboutContent})
})
app.get("/contact", function(req,res){
  res.render("contact",{contactC:contactContent})
})
app.get("/compose", function(req,res){
  res.render("compose")
})

app.get("/posts/:postId", function(req,res){
    const requeredPostId = req.params.postId;
    Post.findOne({_id:requeredPostId}, function(err,post){
      res.render("post", {
        title:post.title,
        content:post.content
      })
    })
  })
//Post section
app.post("/cp", function(req,res){
  const post = new Post ({
  title : req.body.titleContent,
  content : req.body.textContent
})
post.save(function(err){
  if(!err){
    res.redirect("/");
  }
});
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
  editThePost(editId, editTitle,editText);
  res.send("Updated the post")
});
;
//Delete post
app.post("/delete", function(req,res){
  const deleteId = req.body.deleteId;
  deleteThePost(deleteId)
  res.send("Deleted the post")
})

//Listen section
let port = process.env.PORT;
if (port == null || port== ""){
  port = 3000;
}
app.listen(port)
