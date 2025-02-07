import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User Not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(`Error in get User profile controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findOne({ _id: id });
    const currentUser = await User.findOne({ _id: req.user._id });

    if (id === req.user._id) {
      return res.status(400).json({ error: "You can't unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate({ _id: id }, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate({ _id: req.user._id }, { $pull: { following: id } });
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      // Follow
      await User.findByIdAndUpdate({ _id: id }, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate({ _id: req.user._id }, { $push: { following: id } });

      // Send notification
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();

      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.log(`Error in follow and unfollow controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUsers=async (req,res)=>{
    try{
const userId=req.user._id;
const userFollowedByMe=await User.findById({_id:userId}).select("-password")
const users=await User.aggregate([
   { $match:{
        _id:{$ne:userId}
    }
},{
    $sample:{
        size:15
    }
}
])
const filteredUser=users.filter((user)=>!userFollowedByMe.following.includes(user._id))
const suggestedUsers=filteredUser.slice(0,5);
suggestedUsers.forEach((user)=>(user.password=null))
res.status(200).json(suggestedUsers);
    }
    catch(error)
    {
        console.log(`Error in geySuggestedUsers Controller: ${error}`);
    res.status(500).json({ error: "Internal server error" });
    }
}