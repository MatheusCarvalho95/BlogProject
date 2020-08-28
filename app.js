//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = "This is a basic Blog project, here i'm making a daily journal and i'm gonna post some updates on my projects";
const aboutContent = "I'm just a fullstack student.";
const contactContent = "You can contact-me at: matheus_carvalho2@hotmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//Pre variables section
var posts = []
//Render pages section
app.get("/",function(req,res){
  res.render("home",{startC:homeStartingContent, postContent:posts}) 
  
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
//Post section
app.post("/cp", function(req,res){
  var newPost = {
  title : req.body.titleContent,
  content : req.body.textContent
}
posts.push(newPost);
res.redirect("/");
})

//Listen section
app.listen(3000, function() {
  console.log("Server started on port 3000");
})
