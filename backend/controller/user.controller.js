import User from "../models/user.model.js";
export const getProfile =async(req,res)=>{
    try{
const {username}=req.params;
const user=await User.findOne({username});
if(!user)
{
    return res.status(400).json({error:"User Not found"});

}
res.status(200).json({user});

    }
    catch(error)
    {
        console.log(`Error in get User proifle controller:${error}`);
        res.status(500).json({error:"Internal server error"});
    }
}
export const followUnFollowUser =async(req,res)=>{
    try{
const {id}=req.params;
const userTomodify=await User.findOne({_id : id})
const currentUser=await User.findOne({_id :req.user._id});
if(id===req.user._id)
{
    return res.status(400).json({error:"You can't unfolow yourseld"})
}
if(!userTomodify||!currentUser)
{
    return res.status(400).json({error:"user not found"})

}
const isFollowing=currentUser.following.includes(id);
if(isFollowing)
{
    //unfollow
    await User.findByIdAndUpdate({_id:id},{$pull:{followers:req.user._id}})
    await User.findByIdAndUpdate({_id:req.user._id},{$pull:{following:id}})
return res.status(200).json({message:"Unfollow Sucessfully"})
}
else{
    //follow
    await User.findByIdAndUpdate({_id:id},{$push:{followers:req.user._id}})
    await User.findByIdAndUpdate({_id:req.user._id},{$push:{following:id}})
    //send notification
    const newNotification=new newNotification(
        {
        type:"follow",
        from:req.user._id,
        to:userTomodify._id

});
await newNotification.save()
    return res.status(200).json({message:"Follow Sucessfully"})

}
    }
    catch(error)
    {
        console.log(`Error in follow and unfollow controller:${error}`);
        res.status(500).json({error:"Internal server error"});
    }
}
