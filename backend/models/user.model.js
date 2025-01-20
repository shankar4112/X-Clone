import mongoose from "mongoose";
const UserSchema=mongoose.Schema({
    username :{
        type : String,
        required:true,
        unique:true
    },
    fullName : {
        type : String,
        required:true
    },
    email:{
        type : String,
        required:true,
        unique :true
    },
    password:{
        type : String,
        required:true,
        minLength:8
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileImg:{
        type:String,
        default:"ProfileImg"
    },
    coverImg:{
        type:String,
        default:"CoverImg"
    },
    bio :{
        type:String,
        default:"ElonMusk"
    },
    link :{
        type:String,
        default:"www.x.com"
    }


},{timestamps : true}
) 
const User=mongoose.model("User",UserSchema);

export default User;