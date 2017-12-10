var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");
    // expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// app.use(expressSanitizer);

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//   title:"First Blog",
//   image:"https://farm3.staticflickr.com/2453/3830535451_29a8f2b373.jpg",
//   body:"Hello, this is my first Blog"
// });

//RESTFUL Routes
app.get("/",function(req,res){
    res.redirect("/blogs");    
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
      if(err){
          console.log("Something went wrong!");
      } 
      else{
          res.render("index",{blogs:blogs}); 
      }
    });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("/new");
        }
        else{
            console.log(newBlog);
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
      if(err){
          res.send("Invalid Id");
      }
      else{
          res.render("show",{blog:blog});
      }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,curBlog){
        if(err){
            console.log("Something unexpected happened");
        }
        else{
            res.render("edit",{blog:curBlog});
        }
    });
});

app.put("/blogs/:id",function(req,res){
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
       if(err){
           res.redirect("/blogs");
       }
       else{
           res.redirect("/blogs/"+req.params.id);
       }
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Server started!");
})