const express = require("express");
const passport = require("passport");
const User = require("../models/login.js");
const router = express.Router();

router.get("/login", (req, res) => {
  const error = req.session.messages || "";
  req.session.messages = null;
  res.render("login.ejs", { error });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: "Invalid username or password",
  }),
  async (req, res) => {
    console.log(req.user);
    const lastlogin=await User.findOne({username:req.user.username}).currentlogin;
    await User.findByIdAndUpdate({_id:req.user._id},{
      currentlogin:Date.now()+5.5*60*60*1000,
      lastlogin:lastlogin
    });
    res.redirect("/home");
  }
);

router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err) console.log(err);
    

  res.redirect("/login");
})
});

module.exports = router;
