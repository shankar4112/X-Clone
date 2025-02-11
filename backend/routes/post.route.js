import express from "express";
import { protectRoute } from "../middleware/protectRoute";
const router=express.Router();

router.post("/create",protectRoute,createPost);
router.post("/like/:id",protectRoute,likeUnlikePost);
router.post("/comment",protectRoute,createComment);
router.post("/create",protectRoute,createPost);
export default router;