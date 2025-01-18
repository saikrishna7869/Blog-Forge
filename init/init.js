const mongoose = require('mongoose');
const users=require("../models/login");
const blogs=require("../models/blog");
const comments=require("../models/comment.js");

main().then(()=>{
    console.log("Connection succesful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/BlogDB');

}

