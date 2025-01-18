const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose=require("passport-local-mongoose");


const userSchema = new Schema({
  
    
    image: { 
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    bio:{
        type:String,
     },
    gender: { type: String ,required:true},
    followers:[{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    following:[{
        type: Schema.Types.ObjectId, ref: 'User'
        }],
    currentlogin:{
        type:Date,
        default:new Date(Date.now() + 5.5 * 60 * 60 * 1000)
    },
    lastlogin:{
        type:Date,
        default:new Date(Date.now() + 5.5 * 60 * 60 * 1000)
        },
    seen:{
        type:Boolean,
        default:false
    },
    messages:
       [{
        text: { type: String, required: true },
        time:{
            type:Date,
            default:new Date(Date.now() + 5.5 * 60 * 60 * 1000)
        },
        read:{
            type:Boolean,
            default:false
        }
        }],
    likedblogs:[{
            type:Schema.Types.ObjectId,
            ref:'Blog'
        }],
        
    blogs:[{
        type: Schema.Types.ObjectId, 
        ref: 'Blog'
    }],
    twitter:{
            type:String,
            default:' ',

        },
    linkden:{
            type:String,
            default:' ',
        },
    facebook:{
            type:String,
            default:' ',
        }
    

    });



    userSchema.plugin(passportLocalMongoose);
    module.exports = mongoose.model('User', userSchema);
