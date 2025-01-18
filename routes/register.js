const express = require("express");
const User = require("../models/login");
const cloudinary=require("cloudinary").v2;
const path = require("path");
const router = express.Router();

cloudinary.config({ 
  cloud_name: 'ddyvolryf', 
  api_key: '447897213392583', 
  api_secret: 'eV5WADoX7mbTeVzzc_NBlMyHisI' // Click 'View API Keys' above to copy your API secret
});




router.get("/register", (req, res) => {
  const error = "";
  res.render("register.ejs", { error });
});

router.post("/register", async (req, res) => {
  const { username, password, cpassword, gender } = req.body;
  const user1 = await User.findOne({ username: username });
  console.log(user1);
  if (user1) {
    const error = "username already exists";
    res.render("register.ejs", { error });
  } 
  else if (password !== cpassword) {
    const error = "passwords do not match";
    res.render("register.ejs", { error });
  } 
  else {
    let default_img="";
    let pub_id="";
    console.log(gender);
    if (gender === "male") {
      pub_id='Screenshot_3_xx3psw';
      default_img = "https://res.cloudinary.com/ddyvolryf/image/upload/v1736088550/Screenshot_3_xx3psw.png";
    } else {
      pub_id='Screenshot_5_dfrokw';
      default_img = 'https://res.cloudinary.com/ddyvolryf/image/upload/v1736088894/Screenshot_5_dfrokw.png';
    }
    
    // const imageu=await cloudinary.uploader.upload(default_img,{
    //   folder:'Home'
    // }).catch(()=>{
    //   console.log("Error");
    // });

    


    const user = new User({
      username: username,
      gender: gender,
      image:{
        public_id:pub_id,
        url:default_img
      }
    
    });
    await User.register(user, password);
    req.session.messages = "Registration Successfull";
    res.redirect("/login");
  }
});

module.exports = router;
