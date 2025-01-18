const express = require("express");
const router = express.Router();
const Blog=require("../models/blog");
const User=require("../models/login.js");
const Comment=require("../models/comment.js");

router.use(express.json()); // This will automatically parse the body as JSON

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }                                                     
}
router.put("/:id/comment/:uid",async (req,res,next)=>{
    const id=req.params.id;
    const uid=req.params.uid;
    const {comment}=req.body;
    console.log(comment);
    
    const user=req.user;
    
    const newc=new Comment({
        text:comment,
        userid:user._id
        
    });
    const blog=await Blog.findById(id);
    const bloguser=await User.findById(blog.userid);
    let blogname=blog.title;
    let name=user.username;
    if(bloguser._id.toString()!=uid){
        await User.findByIdAndUpdate(blog.userid,{$push:{messages:{text:`${name} has commented on your blog,BlogTitle: ${blogname}`}}});
    }



    newc.save();
    await Blog.updateOne({_id:id},{$push:{comments:newc._id}});
     res.redirect(`/${id}/read`);



})  


module.exports=router