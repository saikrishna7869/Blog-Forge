const express = require("express");
const methodOverride = require("method-override");
const router = express.Router();
const Blog=require("../models/blog");
const User=require("../models/login.js");
const Comment=require("../models/comment.js");
const cloudinary=require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { model } = require("mongoose");

router.use(methodOverride("_method"));


function isLogged(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}


cloudinary.config({ 
  cloud_name: 'ddyvolryf', 
  api_key: '447897213392583', 
  api_secret: 'eV5WADoX7mbTeVzzc_NBlMyHisI' 
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_images', // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Allowed file formats
    public_id: (req, file) => Date.now() + '-' + file.originalname // Custom file name
  }
});

const upload = multer({ storage });

router.get("/home", isLogged, async(req, res) => {
  const blogs = await Blog.find().populate('userid');
  const user= req.user;
  // console.log(blogs);
  res.render("home.ejs", { count: 5, tab: "home",blogs, user });
});

router.get("/Latest", isLogged, async(req, res) => {
const blogs=await Blog.find({created_at:{
  $gte:req.user.currentlogin-24*60*60*1000
}}).populate('userid').sort({created_at:-1});
const user=req.user;
  res.render("home.ejs", { count: 10, tab: "Latest",blogs,user });
});


router.get("/yourBlogs", isLogged, async(req, res) => {
  const blogs=await Blog.find({userid:req.user._id}).populate('userid').sort({created_at:-1});
  const user=req.user;
  res.render("home.ejs", { count: 15, tab: "YourBlogs",blogs,user });
});

router.get("/Following", isLogged, async(req, res) => {
  const user=req.user;
  const userids=await User.findById(user._id);
  console.log("following------->");
  console.log(userids);
  const blogs=await Blog.find({userid:{$in:userids.following}}).populate('userid').sort({created_at:-1});
  //const blogs=await Blog.find({userid:{$in:userids}}).populate('userid').sort({created_at:-1});

  res.render("home.ejs", { count: 20, tab: "Following",user ,blogs});
});

router.get("/newBlog",isLogged,(req,res)=>{
  const user=req.user;
  res.render("newone.ejs",{user});
});
router.post("/upload", async (req,res,next)=>{
  // console.log(req.body);
  const user=req.user;
  const blog=new Blog({
    userid:req.user._id,
    
    title:req.body.title,
    content:req.body.content,
    image:req.body.imageurl,
    category:req.body.category,
  });
   blog.save().then(async ()=>{
    await User.findByIdAndUpdate(req.user._id,{$push:{blogs:blog._id}})
    res.redirect("/home");
  }
);
});





router.post("/updateseen",async (req,res)=>{
  await User.findByIdAndUpdate({_id:req.user._id},{$set:{
    "messages.$[].read":true
  }});


})



router.get("/:id/read",isLogged,async (req,res)=>{
  const {id}=req.params;
  const blog = await Blog.findById(id).populate('userid')
  .populate({
      path: 'comments', // Populates the `comments` field
      model:'Comment',
      populate:{
        path: 'userid',
        model:'User'
      }
  });
  let rbb = new Set();
  const userBlogs = await Blog.find({ userid: blog.userid }).populate('userid');
  userBlogs.forEach((b) => rbb.add(b));

  const categoryBlogs = await Blog.find({ category: blog.category }).populate('userid');
  categoryBlogs.forEach((b) => rbb.add(b));

  const user=req.user;
  const rb = Array.from(rbb).filter((b) => b._id.toString() !== blog._id.toString());
  
  res.render("blog.ejs",{blog:blog,user,rb});
});



router.get("/profile",isLogged,(req,res)=>{
  const user=req.user;
  res.render("profile.ejs",{user});
});

router.get("/followers",isLogged,async(req,res)=>{
  const user=req.user;
  const followers=await User.findById(req.user._id).populate('followers');
  const followerslist=followers.followers;
  res.render("followers.ejs",{user,followerslist});
})
  


router.get("/profile/edit",isLogged,(req,res)=>{
  const user=req.user;
  res.render("profileedit.ejs",{user});
});

router.post('/profile/edit', isLogged,upload.single('profile-photo'), async (req, res) => {
 
  if(req.file){
  
    await User.findByIdAndUpdate({_id:req.user._id},{
    username:req.body.username,
    "image.public_id":req.file.public_id,
    "image.url":req.file.path,
    gender:req.body.gender,
    bio:req.body.bio,
    twitter:req.body.twitter,
    linkden:req.body.linkden,
    facebook:req.body.facebbok
  });
}
  else{
    await User.findByIdAndUpdate({_id:req.user._id}, {
      username:req.body.username,
      gender:req.body.gender,
      bio:req.body.bio,
      twitter:req.body.twitter,
      linkden:req.body.linkden,
      facebook:req.body.facebbok
      });
  }
  
  res.redirect('/home');
});



router.put("/:bid/follow/:id",isLogged,async(req,res,next)=>{
    const {bid,id}=req.params;

    console.log("Added succesfully");
    let username=req.user.username;
    const user=await User.findById(bid);
    console.log(user);
    await User.findByIdAndUpdate(
      bid,
      {
        $push: { followers: id },
        $addToSet: {
          messages: {
            text: `${username} has started following you`
          }
        }
      }
    );
    await User.findByIdAndUpdate(
      id,
      { $push: { following: bid },
        $addToSet: {
          messages: {
            text: `You started following ${user.username}`,
          },
          
        },
      }
    );
    




});



router.delete("/:bid/unfollow/:id",isLogged,async(req,res)=>{
  const {bid,id}=req.params;
  const blog=await User.findById(bid).followers;
  console.log("removed succesuly");
  await User.findByIdAndUpdate(bid,{$pull:{followers:id}});

  await User.findByIdAndUpdate(id,{$pull:{following:bid}});

});





module.exports = router;
