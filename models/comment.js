const mongoose=require("mongoose");
const { Schema } = mongoose;
const commentSchema = new Schema({
    text:{
        type:String,
        required:true
    },
    userid:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    created_at:{
        type: Date,
        default:new Date(Date.now() + 5.5 * 60 * 60 * 1000)
    }
    });



    module.exports = mongoose.model('Comment', commentSchema);