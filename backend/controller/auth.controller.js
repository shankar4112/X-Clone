import User from "../models/user.model.js";
 import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
export const signup=async(req, res) => {
   try{
const {username,fullName,email,password}=req.body;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email))
{
return res.status(400).json({error:"Invalid Email Format"});
}

const existingUsername=await  User.findOne({username})//we can also check with the email instead of username for extising uer because both these are unique for every indivdual users

const existingEmail=await  User.findOne({email})

if(existingUsername||existingEmail)
{
    return res.status(400).json({error:"Already Existing User or Email"})
}

if(password.length<8)
{
    return res.status(400).json({error:"Password Should be Minimum 8 Character Length"})
}

//hashing the password or encrpyt the password

const salt=await bcrypt.genSalt(10);// instead of giving 10 having a idea of using math.random but not implemented dont know about the how it works

const hashedPassword=await bcrypt.hash(password,salt);

const newUser=new User({
    username,//we can use username:username we used only the username,beause the both the names are same that's why
    fullName,
    email,
    password:hashedPassword,

})

if(newUser)
{generateToken(newUser._id,res)
    await newUser.save();
    res.status(200).json({
        _id: newUser._id,
  username: newUser.username, 
  fullName: newUser.fullName,
  email: newUser.email,
  followers: newUser.followers,
  following: newUser.following,
  profileImg: newUser.profileImg,
  coverImg: newUser.coverImg,
  bio: newUser.bio,
  link: newUser.link

    })
}
else{
    res.status(400).json({error:"Invalid User Data"})
}

}
   catch(error)
   {
    console.log(`Error in signup controller : ${error}`)
    res.status(500).json({error:"Internal Server Error"});
   }
};

export const login=async(req, res) => {
   try{const{username,password}=req.body;
   const user=await User.findOne({username});
    const isPasswordCorrect=await bcrypt.compare(password,user?.password||"");
    if(!user||!isPasswordCorrect)
    {
        return res.status(400).json({error:"Invalid username or password"})
    }
   
   generateToken(user._id,res)
   res.status(200).json({
        _id: user._id,
  username: user.username, 
  fullName: user.fullName,
  email: user.email,
  followers: user.followers,
  following: user.following,
  profileImg: user.profileImg,
  coverImg: user.coverImg,
  bio: user.bio,
  link: user.link
   })
}
   catch(error)
   {
    console.log(`Error in login Controller: ${error}`)
    res.status(500).json({error:"Internal Server Error"});
   }
};
export const logout=async(req,res)=>{
try{
res.cookie("jwt","",{maxAge:0});
res.status(200).json({message:"Logout successfully"});
}
catch(error)
{
  console.log(`Error in Logout Controller: ${error}`);
  res.status(500).json({error : "Internal Server Error"});
}
} 

export const getMe=async( )=>{
 try {  
    const user=await User.findOne({_id:req.user._id}).select("-password");
    res.status(200).json(user);
 } catch (error) {
    console.log(`Error in getMe Controller: ${error}`);
  res.status(500).json({error : "Internal Server Error"});
 }   
}
