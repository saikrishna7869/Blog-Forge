const mongoose=require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
    userid:{
       type: Schema.Types.ObjectId,
       ref: 'User',
     },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
        },
    image:{
        type:String,

    },
    created_at:{
        type:Date,
        default:new Date(Date.now() + 5.5 * 60 * 60 * 1000)
        },
    category:
    {
        type:String,
        enum:["Tech","Sports","Entertainment","Business","Food","Others"],
        required:true
        },
    likes:{
        type:Number,
        default:0
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        }],
    dislikes:{
        type:Number,
        default:0
    }
    });



    const Blog = mongoose.model('Blog', blogSchema);


    module.exports=Blog


