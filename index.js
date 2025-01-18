const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/login.js");
const loginRoutes = require("./routes/login.js");
const registerRoutes = require("./routes/register");
const homeRoutes = require("./routes/home");
const comments=require("./routes/comment");

const app = express();

main().then(() => {
  console.log("Connected to database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BlogDB");
}

app.listen(8080, () => {
  console.log("Server is running on port 8080");
  console.log("http://localhost:8080/login");
});

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(session({
  secret: "BlogForgeProject",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 24 * 60 * 60 * 1000,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use(loginRoutes);

app.use(registerRoutes);

app.use(homeRoutes);

app.use(comments);




app.use((req, res) => {
  res.send("Page Still Under Process");
});

